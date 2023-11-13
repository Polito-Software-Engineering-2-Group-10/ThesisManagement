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
import dayjs from 'dayjs'
import { TitleFilter,ProfessorFilter,DateFilter,TypeFilter,TagFilter,LevelFilter,GroupFilter } from './filteringFunction.js';
//let now=dayjs().format();
//console.log(now)
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

app.get('/api/teacher/details', isLoggedInAsTeacher, async (req, res) => {
    try {
        const teacher = await teacherTable.getDetailsById(req.user.id);
        res.json(teacher);
    } catch (err) {
        res.status(503).json({ error: `Database error during retrieving teacher details ${err}` });
    }
});

app.get('/api/student/details', isLoggedInAsStudent, async (req, res) => {
    try {
        const student = await studentTable.getDetailsById(req.user.id);
        res.json(student);
    } catch (err) {
        res.status(503).json({ error: `Database error during retrieving student details ${err}` });
    }
});

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

//Accept or Reject Application
//PATCH /api/teacher/applicationDetail/<applicationid>
//should be used when the teacher clicks on the Accept or Reject button
app.patch('/api/teacher/applicationDetail/:applicationid',
    isLoggedInAsTeacher,
    [
        check('status').isBoolean()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            const applicationDetail = await applicationTable.getTeacherAppDetailById(req.params.applicationid);
            if (!applicationDetail) {
                return res.status(400).json({ error: 'The application does not exist!' });
            }
            if (applicationDetail.status !== undefined) {
                return res.status(400).json({ error: `This application has already been ${applicationDetail.status ? 'accepted' : 'rejected'}` });
            }
            const applicationResult = await applicationTable.updateApplicationStatusById(req.params.applicationid, Boolean(req.body.status));
            res.json(applicationResult);
        } catch (err) {
            res.status(503).json({ error: `Database error during retrieving application List ${err}` });
        }
    }


);
/*End Accept or Reject Application*/

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

/*Browse Active Proposals */

//GET /api/teacher/ProposalsList
// get the list of all active proposals
// active may not mean that the proposal is not expired, active means that the proposal is not *archived*
// waiting for response on tg channel from professor
// in the meantime, the commented out code is the one that checks for expiration date
app.get('/api/teacher/ProposalsList',
    isLoggedInAsTeacher,
    // UNCOMMENT THIS IF active MEANS DATE NOT EXPIRED
    /*
    [
         check('date').isDate().optional()           
    ],
    */
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            // UNCOMMENT THIS IF active MEANS DATE NOT EXPIRED
            /*
            if (req.body.date === undefined) {
                const proposalList = await thesisProposalTable.getNotExpired();
                const proposalSummary = proposalList.map(
                    p => {
                        return { thesis_title: p.title, thesis_expiration: p.expiration, thesis_level: p.level, thesis_type: p.type }
                    }
                );
                res.json({ proposalSummary, date: req.body.date }); // UNCOMMENT THIS IF active MEANS DATE NOT EXPIRED
            } else {
                const proposalList = await thesisProposalTable.getNotExpiredFromDate(req.body.date); 
                const proposalSummary = proposalList.map(
                    p => {
                        return { thesis_title: p.title, thesis_expiration: p.expiration, thesis_level: p.level, thesis_type: p.type }
                    }
                );
                res.json({ proposalSummary, date: req.body.date }); // UNCOMMENT THIS IF active MEANS DATE NOT EXPIRED
            }
            */
            // AND COMMENT THIS OUT INSTEAD
            const proposalList = await thesisProposalTable.getActiveProposals();
            const proposalSummary = proposalList.map(
                p => {
                    return { thesis_title: p.title, thesis_expiration: p.expiration, thesis_level: p.level, thesis_type: p.type }
                }
            );
            res.json(proposalSummary);
        }
        catch (err) {
            res.status(503).json({ error: `Database error during retrieving application List ${err}` });
        }
    }
);

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



/*Search Proposal*/
//GET /api/student/ProposalList
app.get('/api/student/ProposalsList',
    async (req, res) => {
     
            try{
            const proposalList = await thesisProposalTable.getActiveProposalsStudent();
                if(Object.keys(req.body).length === 0)
                {
                    res.json(proposalList);
                }
                else{
                        let filteredArray =[];
                        //multiple filtering
                        /*TRIPLE*/

                        /*DOUBLE*/
                        if(req.body.title && req.body.professor)
                        {
                            filteredArray=TitleFilter(proposalList,req.body.title);
                            filteredArray=ProfessorFilter(filteredArray,req.body.professor);
                        }
                        else if(req.body.title && req.body.expiration_date)
                        {
                            filteredArray=TitleFilter(proposalList,req.body.title);
                            filteredArray=DateFilter(filteredArray,req.body.expiration_date);
                        }
                        else if(req.body.title && req.body.type)
                        {
                            filteredArray=TitleFilter(proposalList,req.body.title);
                            filteredArray=TypeFilter(filteredArray,req.body.type);
                        }
                        else if(req.body.title && req.body.tags)
                        {
                            filteredArray=TitleFilter(proposalList,req.body.title);
                            filteredArray=TagFilter(filteredArray,req.body.tags);
                        }
                        else if (req.body.title && req.body.tags)
                        {
                            filteredArray=TitleFilter(proposalList,req.body.title);
                            filteredArray=TagFilter(filteredArray,req.body.tags);
                        }
                        else if (req.body.title && req.body.level)
                        {
                            filteredArray=TitleFilter(proposalList,req.body.title);
                            filteredArray=LevelFilter(filteredArray,req.body.level);
                        }
                        else if (req.body.title && req.body.groups)
                        {
                            filteredArray=TitleFilter(proposalList,req.body.title);
                            filteredArray=GroupFilter(filteredArray,req.body.groups);
                        }
                        

                        
                        //single filtering
                        else if(req.body.professor)
                        {
                            filteredArray =ProfessorFilter(proposalList,req.body.professor);
                        }
                        else if(req.body.title)
                        {
                            filteredArray = TitleFilter(proposalList,req.body.title);
                        }
                        else if(req.body.type)
                        {
                            filteredArray = TypeFilter(proposalList,req.body.type); 
                        }
                        else if (req.body.tags)
                        {
                            filteredArray = TagFilter(proposalList,req.body.tags); 
                        }
                        else if(req.body.level)
                        {
                            filteredArray = LevelFilter(proposalList,req.body.level); 
                        }
                        else if (req.body.groups)
                        {
                            filteredArray = GroupFilter(proposalList,req.body.groups)
                        }
                        else if (req.body.expiration_date)
                        { 
                            filteredArray = DateFilter(proposalList,req.body.expiration_date)
                        }
                        res.json(filteredArray);
                    }

                   
                    
                }
            catch(err){
                res.status(503).json({ error: `Database error during the getting proposals: ${err}` });
            }
        
    }
);



/*END API*/


const server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

export { server, app, psqlDriver };