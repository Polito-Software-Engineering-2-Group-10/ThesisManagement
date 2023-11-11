'use strict';
import express from 'express';
import passport from 'passport';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import baseconfig from './config/config.js';
import passportconfig from './config/passport-config.js';
import authrouteconfig from './auth-routes.js';
import {
    studentTable,
    teacherTable,
    departmentTable,
    careerTable,
    degreeTable,
    groupTable,
    thesisProposalTable,
    applicationTable
} from './dbentities.js';
import { psqlDriver } from './dbdriver.js';
import { check, validationResult } from "express-validator"; // validation middleware
const env = process.env.NODE_ENV || 'development';
const currentStrategy = process.env.PASSPORT_STRATEGY || 'saml';
const config = baseconfig[env][currentStrategy];
passportconfig(passport, config, currentStrategy);

const app = express();

app.set('port', config.app.port);
app.use(morgan('dev'));
const corsOptions = {
    origin: `http://${config.app.frontend_host}:${config.app.frontend_port}`,
    credentials: true
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(
    {
        resave: currentStrategy === 'local' ? false : true,
        saveUninitialized: currentStrategy === 'local' ? false : true,
        secret: 'TcEn#GiCD@Y$Etj7N933YHGK9h'
    }));
app.use(passport.initialize());
app.use(passport.session());

authrouteconfig(app, config, passport, currentStrategy);


/*API*/

/*to do: add a check to see if the user is loggen in and is the right type: student or professor for the called api (for all api)*/

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    res.status(401).json({ error: 'Not authenticated' });
};
const isLoggedInAsTeacher = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'teacher')
        return next();
    res.status(401).json({ error: 'Not authenticated' });
};
const isLoggedInAsStudent = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'student')
        return next();
    res.status(401).json({ error: 'Not authenticated' });
};

/*Browse Applications */

//Applications List
//GET /api/teacher/ApplicationsList
//get the list of applications by teacher id
app.get('/api/teacher/ApplicationsList',
    isLoggedInAsTeacher,
    async (req, res) => {
        try {
            const applicationList = await applicationTable.getByTeacherId(req.user.id);
            res.json(applicationList);
        }
        catch (err) {
            res.status(503).json({ error: `Database error during retrieving application List` });

        }

    }
);
//Application Details
//GET /api/teacher/applicationDetail/<applicationid>
//get the application details by application id
//should be used when the teacher click on the application from the list to see the details
app.get('/api/teacher/applicationDetail/:applicationid',
    isLoggedInAsTeacher,
    async (req, res) => {
        try {
            const applicationDetail = await applicationTable.getTeacherAppDetailById(req.params.applicationid);
            const cleanApplication = {
                thesis_title: applicationDetail.title,
                student_id: applicationDetail.id,
                student_name: applicationDetail.name,
                student_surname: applicationDetail.surname,
                application_date: applicationDetail.apply_date,
                student_gender: applicationDetail.gender,
                student_nationality: applicationDetail.nationality,
                student_email: applicationDetail.email,
                student_carrer: applicationDetail.title_degree,
                student_ey: applicationDetail.enrollment_year
            };
            res.json(cleanApplication);
        } catch (err) {
            res.status(503).json({ error: `Database error during retrieving application List` });
        }
    }


);
/*END Browse Application*/

// GET /api/student/ApplicationsList
// get the list of applications as a student to browse them and see their status
app.get('/api/student/ApplicationsList', isLoggedInAsStudent, async (req, res) => {
    try {
        const applicationList = await applicationTable.getByStudentId(req.user.id);
        res.json(applicationList);
    }
    catch (err) {
        res.status(503).json({ error: `Database error during retrieving application List` });
    }
})

/*Insert a new thesis proposal*/
app.post('/api/teacher/insertProposal',
    isLoggedInAsTeacher,
    [
        check('title').isString().isLength({ min: 1 }),
        check('supervisor').isEmail(),
        check('co_supervisor').isArray().optional(),
        check('keywords').isArray({ min: 1 }),
        check('type').isString().isLength({ min: 1 }),
        check('groups').isArray({ min: 1 }),
        check('description').isString().isLength({ min: 1 }),
        check('required_knowledge').isArray().optional(),
        check('notes').isString().optional(),
        check('expiration').isDate({ format: 'YYYY-MM-DD', strictMode: true }),
        check('level').isInt({ min: 1, max: 2 }),
        check('programmes').isArray({ min: 1 })
    ],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const proposal = {
            title: req.body.title,
            teacher_id: req.user.id,
            supervisor: req.body.supervisor,
            co_supervisor: req.body.co_supervisor,
            keywords: req.body.keywords,
            type: req.body.type,
            groups: req.body.groups,
            description: req.body.description,
            required_knowledge: req.body.required_knowledge,
            notes: req.body.notes,
            expiration: req.body.expiration,
            level: req.body.level,
            programmes: req.body.programmes
        }
        try {
            const proposalId = await thesisProposalTable.addThesisProposal(proposal)
            res.json(proposalId); //choose the field of the new proposal to return to give a confirmation message
        } catch (err) {
            res.status(503).json({ error: `Database error during the insert of proposal: ${err}` });
        }

    }
);




/*END API*/


const server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

export { server, app, psqlDriver };