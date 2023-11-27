import { Strategy as SamlStrategy } from '@node-saml/passport-saml';
import { Strategy as LocalStrategy } from 'passport-local'
import { studentTable, teacherTable } from '../dbentities.js'

async function getUserFromDb(email, password) {
    const students = await studentTable.getByAuthInfo(email, password);
    const teachers = await teacherTable.getByAuthInfo(email, password);
    if (students.length > 0) {
        const student = students[0];
        return {
            id: student.id,
            email: student.email,
            name: student.name,
            surname: student.surname,
            role: 'student'
        };
    } else if (teachers.length > 0) {
        const teacher = teachers[0];
        return {
            id: teacher.id,
            email: teacher.email,
            name: teacher.name,
            surname: teacher.surname,
            role: 'teacher'
        };
    } else {
        throw new Error('Incorrect username or password');
    }
}

function samlstrategy(passport, config) {

    const samlStrategy = new SamlStrategy(
        config.passport.saml,
        function (user, done) {
            getUserFromDb(user.email, user.id).then((u) => done(null, { ...u, saml: { nameID: user.nameID, nameIDFormat: user.nameIDFormat } })).catch((err) => done(err));
        }
    );

    passport.serializeUser((user, done) => {
        done(null, `${user.id}~${user.role}~${user.saml.nameID}~${user.saml.nameIDFormat}`);
    });
    

    passport.deserializeUser((idrole, done) => {
        const [id, role, nameID, nameIDFormat] = idrole.split('~');
        getUserFromDbByIdRole(id, role).then((user) => done(null, {...user, saml: { nameID: nameID, nameIDFormat: nameIDFormat }})).catch((err) => done(err));
    })

    passport.logoutSaml = function (req, res) {
        req.user.nameID = req.user.saml.nameID;
        req.user.nameIDFormat = req.user.saml.nameIDFormat;
        samlStrategy.logout(req, function (err, request) {
            if (!err) {
                //redirect to the IdP Logout URL
                res.redirect(request);
            }
        });
    }

    passport.logoutSamlCallback = function (req, res) {
        req.logout(function (err) {
            if (!err) {
                res.redirect('http://localhost:5173');
            }
        });
    }

    passport.use(samlStrategy);

};

async function getUserFromDbByIdRole(id, role) {
    if (role === 'student') {
        const student = await studentTable.getById(id);
        return {
            id: student.id,
            email: student.email,
            name: student.name,
            surname: student.surname,
            role: 'student'
        };
    } else if (role === 'teacher') {
        const teacher = await teacherTable.getById(id);
        return {
            id: teacher.id,
            email: teacher.email,
            name: teacher.name,
            surname: teacher.surname,
            role: 'teacher'
        };
    } else {
        throw new Error('Unknown role');
    }
}

function localstrategy(passport, config) {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
        function (email, password, done) {
            getUserFromDb(email, password).then((user) => done(null, user)).catch((err) => done(err));
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, `${user.id}:${user.role}`);
    });

    passport.deserializeUser((idrole, done) => {
        const [id, role] = idrole.split(':');
        getUserFromDbByIdRole(id, role).then((user) => done(null, user)).catch((err) => done(err));
    })

}


export default function (passport, config, strategy) {
    if (strategy === 'local') {
        localstrategy(passport, config);
    } else if (strategy === 'saml') {
        samlstrategy(passport, config);
    } else {
        throw new Error('Unknown strategy');
    }
};