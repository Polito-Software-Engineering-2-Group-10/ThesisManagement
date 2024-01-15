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
import multer from 'multer';
import {
    studentTable,
    teacherTable,
    departmentTable,
    careerTable,
    degreeTable,
    groupTable,
    thesisProposalTable,
    applicationTable,
    thesisRequestTable,
    applicantCvTable,
    secretaryClerkTable
} from './dbentities.js';
import virtualClock from './VirtualClock.js';
import { psqlDriver } from './dbdriver.js';
import { check, validationResult } from "express-validator"; // validation middleware
import validator from "validator";
import dayjs from 'dayjs';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const env = process.env.NODE_ENV || 'development';
const currentStrategy = process.env.PASSPORT_STRATEGY || 'saml';
const config = baseconfig[env][currentStrategy];
passportconfig(passport, config, currentStrategy);
import sendEmail from './emailSender.js';
const app = express();

app.set('port', config.app.port);
app.use(morgan('dev'));
const corsOptions = {
    origin: [`http://${config.app.frontend_host}:${config.app.frontend_port}`, `http://localhost:${config.app.frontend_port}`],
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
const isLoggedInAsClerk = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'clerk')
        return next();
    res.status(401).json({ error: 'Not authenticated' });
};

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      return cb(null, "./public/files")
    },
    filename: function (req, file, cb) {
      return cb(null, `${Date.now()}_${file.originalname}`)
    }
})
  
const upload = multer({storage})

function checkEmail(str){
    const valid = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return valid.test(str);
}

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
            const applicationList = await applicationTable.getByTeacherId2(req.user.id);
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
                student_ey: applicationDetail.enrollment_year,
            };
            const applicationStatus = await applicationTable.getTeacherAppStatusById(req.params.applicationid);
            const applicationResult = { status: applicationStatus.status }
            res.json({ detail: cleanApplication, status: applicationResult });
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
            const applicationStatus = await applicationTable.getTeacherAppStatusById(req.params.applicationid);

            if (!applicationStatus) {
                return res.status(400).json({ error: 'The application does not exist!' });
            }
            if (applicationStatus.status !== null) {
                return res.status(400).json({ error: `This application has already been ${applicationStatus.status ? 'accepted' : 'rejected'}` });
            }
            const newStatus = Boolean(req.body.status);
            const applicationResult = await applicationTable.updateApplicationStatusById(req.params.applicationid, newStatus);
            //send email to co-supervisor
            const proposalDetail = await thesisProposalTable.getProposalDetailById(applicationResult.proposal_id);
            const studentInfo = await studentTable.getById(applicationResult.student_id);
            const teacherInfo = await teacherTable.getById(proposalDetail.teacher_id);
            const co_supervisorMails = proposalDetail.co_supervisor;
            for(const csm of co_supervisorMails)
            {
                //if(checkEmail(csm))
                if(validator.isEmail(csm))
                {
                    try {
                    const res = await sendEmail({
                        recipient_mail: csm,
                        subject: `Application Status Updated - "${proposalDetail.title}"`,
                        message: `Dear Co-Supervisor,
                        \nOne application of thesis "${proposalDetail.title}" by Student ${studentInfo.surname} ${studentInfo.name} related to you has been ${applicationResult.status ? 'ACCEPTED' : 'REJECTED'} by Main Supervisor ${teacherInfo.surname} ${teacherInfo.name}.
                        \nBest Regards,\nPolito Staff.`
                    });
                }
                catch (err) {
                    res.status(500).json({ error: `Server error during sending notification ${err}` });
                    return;
                }
                }
            }
            // when an application is accepted, the relative proposal has to be archived
            if (newStatus == true) {
                await thesisProposalTable.archiveThesisProposal(applicationResult.proposal_id);
            }
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
            //const proposalList = await thesisProposalTable.getActiveProposals();
            const proposalList = await thesisProposalTable.getByTeacherId(req.user.id);
            res.json(proposalList);
        }
        catch (err) {
            res.status(503).json({ error: `Database error during retrieving application List ${err}` });
        }
    }
);

//Archive Proposal
//PATCH /api/teacher/ProposalsList/<proposalid>
//should be used when the teacher clicks on the Archive button
app.patch('/api/teacher/ProposalsList/:proposalid',
    isLoggedInAsTeacher,
    async (req, res) => {
        try {
            const proposalDetail = await thesisProposalTable.getById(req.params.proposalid);
            if (!proposalDetail) {
                return res.status(400).json({ error: 'The proposal does not exist!' });
            }

            if (proposalDetail.archived === false) {
                const proposalResult = await thesisProposalTable.archiveThesisProposal(req.params.proposalid);
                res.json(proposalResult);
            } if (proposalDetail.archived === true) {
                const proposalResult = await thesisProposalTable.unArchiveThesisProposal(req.params.proposalid);
                res.json(proposalResult);
            }

        } catch (err) {
            res.status(503).json({ error: `Database error during archival of thesis proposal ${err}` });
        }
    }


);
/*End Archive Proposal*/

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

/*Get a CV based on an application to a thesis*/
app.get('/api/teacher/getGeneratedCV/:applicationid', isLoggedInAsTeacher, async (req, res) => {
    try {
        const application = await applicationTable.getById(req.params.applicationid);
        const careerData = await careerTable.getByStudentId(application.student_id);
        const studentData = await studentTable.getById(application.student_id);
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        })
        doc.setFontSize(20);
        doc.text('Curriculum Vitae', 105, 15, { align: 'center' });
        doc.setFontSize(15);
        doc.text('Student Information', 105, 30, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Name: ${studentData.name}`, 10, 40);
        doc.text(`Surname: ${studentData.surname}`, 10, 50);
        doc.text(`Email: ${studentData.email}`, 10, 60);
        doc.text(`Cod degree: ${studentData.cod_degree}`, 10, 70);
        doc.text(`Enrollment year: ${dayjs(studentData.enrollment_year).format('YYYY-MM-DD')}`, 10, 80);
        doc.setFontSize(15);
        doc.text('Career', 105, 100, { align: 'center' });
        doc.setFontSize(12);
        doc.autoTable( 
            {
                head: [['Cod Course', 'Title Course', 'CFU', 'Grade', 'Date']],
                body: careerData.map(c => [c.cod_course, c.title_course, c.cfu, c.grade, dayjs(c.date).format('YYYY-MM-DD')]),
                startY: 110
            },
        );
        const blob = doc.output();
        res.send(blob);
    } catch (err) {
        res.status(503).json({ error: `Database error during retrieving CV ${err}` });
    }
});

/*Get a CV based on an application to a thesis*/
app.get('/api/teacher/getSubmittedCV/:applicationid', isLoggedInAsTeacher, async (req, res) => {
    try {
        const cvs = await applicantCvTable.getByApplicationId(req.params.applicationid);
        if (cvs.length == 0) {
            return res.status(404).json({ error: `No CV submitted for this application` });
        } else {
            const cv = cvs[0];
            const filepath = `./public/files/${cv.filepath}`;
            res.download(filepath);
        }
    } catch (err) {
        res.status(503).json({ error: `Database error during retrieving CV ${err}` });
    }
});

/*Apply for a thesis proposal*/
app.post('/api/student/applyProposal',
    isLoggedInAsStudent,
    upload.single('file'),
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const Applyproposal = {
            student_id: req.user.id,
            proposal_id: req.body.proposal_id,
            apply_date: req.body.apply_date
        }
        try {
            const existingApplication = await applicationTable.getCountByFK(Applyproposal.student_id, Applyproposal.proposal_id);
            if (existingApplication.count > 0) {
                return res.status(400).json({ error: `You can't apply to the same proposal twice` });
            }
            const applypropID = await applicationTable.addApplicationWithDate(Applyproposal.student_id, Applyproposal.proposal_id, Applyproposal.apply_date);
            if (req.file) {
                const proposalInfo = await thesisProposalTable.getById(Applyproposal.proposal_id);
                await applicantCvTable.addApplicantCv(Applyproposal.proposal_id, Applyproposal.student_id, proposalInfo.teacher_id, applypropID.id, req.file.filename);
            }
            const proposalDetail = await thesisProposalTable.getProposalDetailById(Applyproposal.proposal_id);
            const teacherInfo = await thesisProposalTable.getTeacherInfoById(Applyproposal.proposal_id);
            try {
                const res = await sendEmail({
                    recipient_mail: proposalDetail.supervisor,
                    subject: `New Application - "${proposalDetail.title}"`,
                    message: `Dear Professor ${teacherInfo.surname} ${teacherInfo.name},\nThere is a new application of your thesis topic "${proposalDetail.title}" to you.\nBest Regards,\nPolito Staff.`
                });
            }
            catch (err) {
                res.status(500).json({ error: `Server error during sending notification ${err}` });
                return;
            }
            res.json(applypropID);
        } catch (err) {
            res.status(503).json({ error: `Database error during the insert of the application: ${err}` });
        }

    }
);

/*Apply thesis request */

//POST /api/student/applyRequest/:thesisid
//apply thesis request
app.post('/api/student/applyRequest/:thesisid',
    isLoggedInAsStudent,
    [
        check('title').isString().isLength({ min: 1 }),
        check('description').isString().isLength({ min: 1 }),
        check('supervisor').isEmail(),
        check('co_supervisor').isArray().optional(),
        check('apply_date').isDate({ format: 'YYYY-MM-DD', strictMode: true }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const request = {
            title: req.body.title,
            description: req.body.description,
            supervisor: req.body.supervisor,
            co_supervisor: req.body.co_supervisor,
            apply_date: req.body.apply_date
        }
        try {
            const existingRequest = await thesisRequestTable.getCountByFK(req.user.id, req.params.thesisid);
            if (existingRequest.count > 0) {
                return res.status(400).json({ error: `The student already request to this thesis before!` });
            }
           // const requestInfo = await thesisRequestTable.addThesisRequestNoDate(req.user.id, req.params.thesisid, request);
            const requestInfo = await thesisRequestTable.addThesisRequestWithDate(req.user.id, req.params.thesisid, request);
            res.json(requestInfo);
        }
        catch (err) {
            res.status(503).json({ error: `Database error during retrieving application List: ${err}` });

        }

    }
);

/*End*/


/*Get thesis request list - clerk */

//GET /api/clerk/Requestlist
//get clerk info
app.get('/api/clerk/details', isLoggedInAsClerk, async (req, res) => {
    try {
        const clerk = await secretaryClerkTable.getById(req.user.id);
        res.json(clerk);
    } catch (err) {
        res.status(503).json({ error: `Database error during retrieving clerk details ${err}` });
    }
});

//Get thesis request
app.get('/api/clerk/Requestlist',
    isLoggedInAsClerk,
    async (req, res) => {
        try {
            const requestList = await thesisRequestTable.getAllNotApprovedByClerkRequest();
            res.json(requestList);
        }
        catch (err) {
            res.status(503).json({ error: `Database error during retrieving requests list. ${err}` });
        }
    }
)
/*End*/

/*Approve thesis request - clerk */

//PATCH /api/clerk/Requestlist/:requestid
//Approve a thesis request
app.patch('/api/clerk/Requestlist/:requestid',
      isLoggedInAsClerk,
    [
        check('status_clerk').isBoolean()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            const requestDetail = await thesisRequestTable.getRequestDetailById(req.params.requestid);
            if (!requestDetail) {
                return res.status(400).json({ error: 'The request does not exist!' });
            }
            if (requestDetail.status_clerk !== null) {
                return res.status(400).json({ error: `This request has already been ${requestDetail.status_clerk ? 'accepted' : 'rejected'}` });
            }
            const requestResult = await thesisRequestTable.updateRequestClerkStatusById(req.params.requestid, req.body.status_clerk);
            const co_supervisorMails = requestResult.co_supervisor;
            //when request is approved, send email to co-supervisor
            if(requestResult.status_clerk === true)
            {
                for(const csm of co_supervisorMails)
            {
                //if(checkEmail(csm))
                if(validator.isEmail(csm))
                {
                    //console.log(csm+" "+validator.isEmail(csm));
                    //console.log(validator.isEmail("test"));
                    try {
                    const res = await sendEmail({
                        recipient_mail: csm,
                        subject: `New Request Approved - "${requestResult.title}"`,
                        message: `Dear Co-Supervisor,\nThe thesis request "${requestResult.title}" related to you has been APPROVED by clerk.\nBest Regards,\nPolito Staff.`
                    });
                }
                catch (err) {
                    res.status(500).json({ error: `Server error during sending notification ${err}` });
                    return;
                }
                }
            }
            }
            res.json(requestResult);
        } catch (err) {
            res.status(503).json({ error: `Database error during retrieving requests list. ${err}` });
        }
    }
);

/*End*/

//Get thesis request - Professor
app.get('/api/teacher/Requestlist',
    isLoggedInAsTeacher,
    async (req, res) => {
        try {
            const requestList = await thesisRequestTable.getAllNotApprovedRequestByTeacher(req.user.id);
            res.json(requestList);
        }
        catch (err) {
            res.status(503).json({ error: `Database error during retrieving requests list. ${err}` });
        }
    }
)
/*End*/

/*Approve thesis request - Professor */

//Approve a thesis request
//PATCH /api/teacher/Requestlist/:requestid
app.patch('/api/teacher/Requestlist/:requestid',
      isLoggedInAsTeacher,
    [
       check('status_teacher').isInt()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array()});
            }
            const requestDetail = await thesisRequestTable.getRequestDetailById(req.params.requestid);
            if (!requestDetail) {
                return res.status(400).json({ error: 'The request does not exist!' });
            }
            if (requestDetail.status_teacher !== null) {
                return res.status(400).json({ error: `This request has already been evaluated` });
            }
            //const requestResult = await thesisRequestTable.updateRequestTeacherStatusById(req.params.requestid, req.body.status_teacher, req.body.comment);
            const requestResult = await thesisRequestTable.updateRequestTeacherStatusById(req.params.requestid, req.body.status_teacher);
            res.json(requestResult);
        } catch (err) {
            res.status(503).json({ error: `Database error during retrieving requests list. ${err}` });
        }
    }
);

//Add a comment of request
//PATCH /api/teacher/Requestlist/:requestid/comment
app.patch('/api/teacher/Requestlist/:requestid/comment',
      isLoggedInAsTeacher,
    [
        check('comment').isString().isLength({ min: 1 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array()});
            }
            const requestDetail = await thesisRequestTable.getRequestDetailById(req.params.requestid);
            if (!requestDetail) {
                return res.status(400).json({ error: 'The request does not exist!' });
            }
            const requestComment = await thesisRequestTable.updateRequestCommentById(req.params.requestid, req.body.comment);
            res.json(requestComment);
        } catch (err) {
            res.status(503).json({ error: `Database error during retrieving requests list. ${err}` });
        }
    }
);

/*End*/

app.get('/api/proposal/:proposalid', async (req, res) => {
    try {
        const proposal = await thesisProposalTable.getById(req.params.proposalid);
        res.json(proposal);
    } catch (err) {
        res.status(503).json({ error: `Database error during retrieving proposal ${err}` });
    }
});

app.get('/api/ProposalsList',
    async (req, res) => {
        try {
            const proposalList = await thesisProposalTable.getAll();
            res.json(proposalList);
        }
        catch (err) {
            res.status(503).json({ error: `Database error during retrieving application List ${err}` });
        }
    }
)



app.post('/api/student/ProposalsList',
    async (req, res) => {
        try {
            const proposalList = await thesisProposalTable.getAll(req.body.cod_degree);
            res.json(proposalList);
        }
        catch (err) {
            res.status(503).json({ error: `Database error during retrieving application List ${err}` });
        }
    }
)

/*Search Proposal*/
//GET /api/ProposalList
app.post('/api/ProposalsList/filter',
    [
        check('title').isString().optional(),
        check('professor').isInt().optional(),
        check('date').isDate().optional(),
        check('type').isArray().optional(),
        check('keywords').isArray().optional(),
        check('level').isInt({ min: 1, max: 2 }).optional(),
        check('groups').isArray().optional(),
        check('cod_degree').isString().optional()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            const filterObject = {
                title: req.body.title || null,
                teacher_id: req.body.professor || null,
                date: req.body.date || null,
                type: req.body.type || null,
                keywords: req.body.keywords || null,
                level: req.body.level || null,
                groups: req.body.groups || null,
                cod_degree: req.body.cod_degree || null
            }
            res.json(await thesisProposalTable.getFilteredProposals(filterObject));
        }
        catch (err) {
            res.status(503).json({ error: `Database error during the getting proposals: ${err}` });
        }

    }
);

app.get('/api/student/list', async (req, res) => {
    try {
        const studentList = await studentTable.getAllStudents();
        res.json(studentList.map(t => {
            return {
                name: t.name,
                surname: t.surname,
                id: t.id,
                email: t.email
            }
        }));
    } catch (err) {
        res.status(503).json({ error: `Database error during retrieving students list ${err}` });
    }
})

app.get('/api/teacher/list', async (req, res) => {
    try {
        const teacherList = await teacherTable.getAll();
        res.json(teacherList.map(t => {
            return {
                name: t.name,
                surname: t.surname,
                id: t.id
            }
        }));
    } catch (err) {
        res.status(503).json({ error: `Database error during retrieving teacher list ${err}` });
    }
})

app.post('/api/teacher/retrieveCosupGroup', isLoggedInAsTeacher, async (req, res) => {
    try {
        let groups = [];
        let g = '';
        for (const c of req.body.cosup_mails) {
            g = await teacherTable.getGroupByMail(c);
            //check if is an external supervisor
            if (g.length != 0)
                groups = [...groups, g[0].name];
        }
        res.json(groups);
    } catch (err) {
        res.status(503).json({ error: `Database error during retrieving cosupervisor groups ${err}` })
    }
})

app.get('/api/thesis/types', async (req, res) => {
    try {
        const types = await thesisProposalTable.getTypes();
        res.json(types);
    } catch (err) {
        res.status(503).json({ error: `Database error during retrieving thesis types ${err}` });
    }
});

app.get('/api/thesis/keywords', async (req, res) => {
    try {
        const keywords = await thesisProposalTable.getKeywords();
        res.json(keywords);
    } catch (err) {
        res.status(503).json({ error: `Database error during retrieving thesis keywords ${err}` });
    }
});

app.get('/api/thesis/groups', async (req, res) => {
    try {
        const groups = await thesisProposalTable.getGroups();
        res.json(groups);
    } catch (err) {
        res.status(503).json({ error: `Database error during retrieving thesis groups ${err}` });
    }
});

app.delete('/api/teacher/deleteProposal',
    isLoggedInAsTeacher,
    [
        check('proposalId').isInt()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            const studentEmails = await applicationTable.getStudentInfoPendingApplicationForAProposal(req.body.proposalId);
            if (studentEmails.length != 0) {
                for (const s of studentEmails) {
                    const app = await applicationTable.getById(s.app_id);
                    const proposalInfo = await thesisProposalTable.getById(app.proposal_id);
                    const teacherInfo = await teacherTable.getById(proposalInfo.teacher_id);
                    try {                                        
                        const res = await sendEmail({
                            recipient_mail: s.email,
                            subject: `Info about on your application about ${proposalInfo.title}`,
                            message: `Hello dear student,\n Unfortunately your thesis application for the ${proposalInfo.title} proposal, supervised by professor ${teacherInfo.surname}, has been cancelled because the thesis proposal was deleted.\nBest Regards, Polito Staff.`
                        });
                    }
                    catch (err) {
                        res.status(500).json({ error: `Server error during sending notification ${err}` });
                        return;
                    }
                }
            }
            const nApplication = await applicationTable.countAcceptedApplicationForAProposal(req.body.proposalId)
            if (nApplication == 0) {
                const deletedProposal = await thesisProposalTable.deleteById(req.body.proposalId)
                res.json(deletedProposal);
            }
            else
                res.status(400).json({ error: `The proposal has been accepted by a student, so it cannot be deleted` });
        }
        catch (err) {
            res.status(503).json({ error: `Database error during the deletion of the thesis proposal: ${err}` });
        }
    });
app.post('/api/virtualclock', [
    check('date').isDate({ format: 'YYYY-MM-DD', strictMode: true })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    };
    let now = dayjs();
    let new_date = dayjs(req.body.date);
    virtualClock.setOffset(new_date.unix() - now.unix());
    res.json({ date: new_date });
})

app.get('/api/virtualclock', (req, res) => {
    let date = virtualClock.getSqlDate();
    res.json({ date: date });
});

app.delete('/api/virtualclock', (req, res) => {
    virtualClock.resetOffset();
    res.json({ date: dayjs() });
})

app.put('/api/teacher/updateProposal/:thesisid',
    isLoggedInAsTeacher,
    [
        check('title').isString().isLength({ min: 1 }),
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

        const thesisId = req.params.thesisid;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const proposal = {
            title: req.body.title,
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
            const proposalId = await thesisProposalTable.updateThesisProposal(proposal, thesisId)
            res.json(proposalId);
        } catch (err) {
            res.status(503).json({ error: `Database error during the update of the proposal: ${err}` });
        }

    }
);

/*SEND MAIL APIS*/
app.post("/api/send_email",
    isLoggedInAsTeacher,
    async (req, res) => {
        sendEmail(req.body)
            .then((response) => res.send(response.message))
            .catch((error) => res.status(500).json({ error: error.message }));
    });

/*UPLOAD FILE API*/
app.post('/upload', upload.single('file'), (req, res) => {
    return res.json({uploaded: true})
})

/*END API*/

export { app, psqlDriver, isLoggedIn, isLoggedInAsStudent, isLoggedInAsTeacher, isLoggedInAsClerk, sendEmail };