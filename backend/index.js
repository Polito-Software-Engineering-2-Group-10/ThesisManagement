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
//GET /api/ApplicationsList
//get the list of applications by teacher id
app.get('/api/ApplicationsList',
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
//GET /api/applicationDetail/<applicationid>
//get the application details by application id
//should be used when the teacher click on the application from the list to see the details
app.get('/api/applicationDetail/:applicationid',
    isLoggedInAsTeacher,
    async (req, res) => {
        try {
            const applicationDetail = await applicationTable.getDetailById(req.params.applicationid); //to do: modify the current manual id with user.id logged in at the moment
            const cleanApplicationList = applicationDetail.map(item => {
                return {
                    thesis_title: item.title,
                    student_id: item.id,
                    student_name: item.name,
                    student_surname: item.surname,
                    application_date: item.apply_date,
                    student_gender: item.gender,
                    student_nationality: item.nationality,
                    student_email: item.email,
                    student_carrer: item.title_degree,
                    student_ey: item.enrollment_year
                };
            });

            res.json(cleanApplicationList);

        } catch (err) {
            res.status(503).json({ error: `Database error during retrieving application List` });
        }
    }


);
/*END Browse Application*/


/*Insert a new thesis proposal*/
app.post('/api/insertProposal',
    [
        check('title').isLength({ min: 1 }),
        check('teacher_id').isInt(),
        check('supervisor').isLength({ min: 1 }),
        check('co_supervisor').isArray(),
        check('keywords').isArray(),
        check('type').isLength({ min: 1 }),
        check('groups').isArray(),
        check('description').isLength({ min: 1 }),
        check('required_knowledge').isArray(),
        check('notes').isLength({ min: 1 }),
        check('expiration').isDate({ format: 'YYYY-MM-DD', strictMode: true }),
        check('level').isInt(),
        check('programmes').isArray()
    ],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const proposal = {
            title: req.body.title,
            teacher_id: req.body.teacher_id, //to do: use req.user.id instead of req.bosy.teacher.id 
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