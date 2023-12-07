import request from 'supertest';
import { psqlDriver, app, isLoggedInAsTeacher, sendEmail } from '../index.js';
import { thesisProposalTable, applicationTable, teacherTable } from '../dbentities.js';
//import nodemailer, { createTransport } from 'nodemailer';
import { jest } from '@jest/globals';
import { response } from 'express';

afterAll(async () => {
    await psqlDriver.closeAll();
});

function registerMockMiddleware(app, index, middleware) {
    function mockWare(req, res, next) {
        middleware(req, res, next)
        app._router.stack.splice(index, 1);
    }
    app.use(mockWare)
    app._router.stack.splice(index, 0, app._router.stack.find(r => r.name === 'mockWare'));
}

describe('isLoggedInAsTeacher middleware', () => {
    test('Should allow the user authenticated as a professor to proceed', async () => {
        const isAuthenticated = jest.fn(() => true);
        const req = {
            isAuthenticated: isAuthenticated,
            user: { id: 1, role: 'teacher' }
        };
        const res = {};
        const next = jest.fn();
        await isLoggedInAsTeacher(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    test('Should throw an error with 401 error code when the user is not authenticated as a professor', async () => {
        const isAuthenticatedMock = jest.fn(() => true);
        const req = {
            isAuthenticated: isAuthenticatedMock,
            user: { id: 1, role: 'student' }
        };
        const res = { status: jest.fn(() => ({ json: jest.fn() })) };
        const next = jest.fn();
        await isLoggedInAsTeacher(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });
});

describe('GET /api/teacher/details', () => {
    test('Should successfully return the details of the logged professor', async () => {
        const teacherDetails = {
            id: 1,
            surname: 'surname1',
            name: 'name1',
            email: 'email1',
            cod_group: 1,
            cod_department: 1,
        };
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        })
        jest.spyOn(teacherTable, 'getDetailsById').mockImplementationOnce(() => teacherDetails);
        const response = await request(app).get('/api/teacher/details');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(teacherDetails);
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        })
        jest.spyOn(teacherTable, 'getDetailsById').mockImplementationOnce(() => {
            throw new Error("Database error")
        });
        const response = await request(app).get('/api/teacher/details');
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during retrieving teacher details Error: Database error' });
    });
});

describe('GET /api/teacher/ApplicationsList', () => {
    test('Should successfully return the list of applications from students of the logged professor', async () => {
        const applications = [
            {
                id: 1,
                student_id: 1,
                proposal_id: 1,
                apply_date: '2023/01/01',
                status: true,
                thesis_title: 'Title1',
            },
            {
                id: 2,
                student_id: 2,
                proposal_id: 2,
                apply_date: '2023/01/01',
                status: false,
                thesis_title: 'Title2',
            },
        ]
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        jest.spyOn(applicationTable, 'getByTeacherId2').mockImplementationOnce(() => applications);
        const response = await request(app).get('/api/teacher/applicationsList');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(applications);
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        jest.spyOn(applicationTable, 'getByTeacherId2').mockImplementationOnce(() => {
            throw new Error('Database error')
        });
        const response = await request(app).get('/api/teacher/applicationsList');
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during retrieving application List' });
    });
});

describe('GET /api/teacher/applicationDetail/:applicationid', () => {
    test('Should successfully return an application given the ID', async () => {
        const applicationDetailed = {
            title: 'Title1',
            id: 1,
            name: 'Name1',
            surname: 'Surname1',
            apply_date: '01/01/2023',
            gender: 'M',
            nationality: 'Italian',
            email: 'email1',
            title_degree: 'career1',
            enrollment_year: '01/01/2022',
        }
        const application = {
            thesis_title: 'Title1',
            student_id: 1,
            student_name: 'Name1',
            student_surname: 'Surname1',
            application_date: '01/01/2023',
            student_gender: 'M',
            student_nationality: 'Italian',
            student_email: 'email1',
            student_carrer: 'career1',
            student_ey: '01/01/2022',
        }
        jest.spyOn(applicationTable, 'getTeacherAppDetailById').mockResolvedValueOnce(applicationDetailed);
        jest.spyOn(applicationTable, 'getTeacherAppStatusById').mockResolvedValueOnce({ status: true });
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        const response = await request(app).get('/api/teacher/applicationDetail/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ detail: application, status: { status: true } });
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        jest.spyOn(applicationTable, 'getTeacherAppDetailById').mockImplementationOnce(() => {
            throw new Error('Database error');
        });
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        const response = await request(app).get('/api/teacher/applicationDetail/1');
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during retrieving application List' });
    });
});

describe('PATCH /api/teacher/applicationDetail/:applicationid', () => {
    test('Should successfully accept the application with the specified ID and archive the relative proposal', async () => {
        const application = {
            id: 1,
            status: undefined,
        }
        const application2 = {
            id: 1,
            status: null,
        }
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        jest.spyOn(applicationTable, 'getTeacherAppDetailById').mockImplementationOnce(() => application)
        jest.spyOn(applicationTable, 'getTeacherAppStatusById').mockImplementationOnce(() => application2);
        jest.spyOn(applicationTable, 'updateApplicationStatusById').mockImplementationOnce(() => true);
        jest.spyOn(thesisProposalTable, 'archiveThesisProposal').mockImplementationOnce(() => true);
        const response = await request(app).patch('/api/teacher/applicationDetail/1').send({status: true})
        expect(response.status).toBe(200);
        expect(response.body).toBe(true);
    });

    test('Should successfully reject the application with the specified ID', async () => {
        const application = {
            id: 1,
            status: undefined,
        }
        const application2 = {
            id: 1,
            status: null,
        }
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        jest.spyOn(applicationTable, 'getTeacherAppDetailById').mockImplementationOnce(() => application)
        jest.spyOn(applicationTable, 'getTeacherAppStatusById').mockImplementationOnce(() => application2);
        jest.spyOn(applicationTable, 'updateApplicationStatusById').mockImplementationOnce(() => true);
        const response = await request(app).patch('/api/teacher/applicationDetail/1').send({ status: false })
        expect(response.status).toBe(200);
        expect(response.body).toBe(true);
    });

    test('Should throw an error with 422 status code when the format of the request is not valid', async () => {
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        const response = await request(app).patch('/api/teacher/applicationDetail/1').send({ status: 'invalid' })
        expect(response.status).toBe(422);
        expect(response.body).toBeTruthy();
    });

    test('Should throw an error with 400 status code if the application does not exist', async () => {
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        jest.spyOn(applicationTable, 'getTeacherAppDetailById').mockImplementationOnce(() => { })
        const response = await request(app).patch('/api/teacher/applicationDetail/1').send({ status: true })
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'The application does not exist!' });
    });

    test('Should throw an error with 400 status code when the application has already been accepted', async () => {
        const application = {
            id: 1,
            status: true,
        }
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        jest.spyOn(applicationTable, 'getTeacherAppDetailById').mockImplementationOnce(() => application)
        const response = await request(app).patch('/api/teacher/applicationDetail/1').send({ status: true })
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'This application has already been accepted' });
    });

    test('Should throw an error with 400 status code when the application has already been rejected', async () => {
        const application = {
            id: 1,
            status: false,
        }
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        jest.spyOn(applicationTable, 'getTeacherAppDetailById').mockImplementationOnce(() => application)
        const response = await request(app).patch('/api/teacher/applicationDetail/1').send({ status: true })
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'This application has already been rejected' });
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        const application = {
            id: 1,
            status: undefined,
        }
        const application2 = {
            id: 1,
            status: null,
        }
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        jest.spyOn(applicationTable, 'getTeacherAppDetailById').mockImplementationOnce(() => application)
        jest.spyOn(applicationTable, 'getTeacherAppStatusById').mockImplementationOnce(() => application2);
        jest.spyOn(applicationTable, 'updateApplicationStatusById').mockImplementationOnce(() => {
            throw new Error('Database error');
        })
        const response = await request(app).patch('/api/teacher/applicationDetail/1').send({ status: true })
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during retrieving application List Error: Database error' });
    });
});

describe('GET /api/teacher/ProposalsList', () => {
    test('Should successfully return the list of active proposals of the logged professor', async () => {
        const proposals = [
            {
                title: 'Title1',
                expiration: '2023/01/01',
                level: 1,
                type: 'Type1'
            },
            {
                title: 'Title2',
                expiration: '2023/01/01',
                level: 2,
                type: 'Type2'
            },
        ];
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        jest.spyOn(thesisProposalTable, 'getByTeacherId').mockImplementationOnce(() => proposals);
        const response = await request(app).get('/api/teacher/ProposalsList');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(proposals);
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        jest.spyOn(thesisProposalTable, 'getByTeacherId').mockImplementationOnce(() => {
            throw new Error('Database error')
        });
        const response = await request(app).get('/api/teacher/ProposalsList');
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during retrieving application List Error: Database error' });
    });
});

describe('POST /api/teacher/insertProposal', () => {
    test('Should successfully insert a new thesis proposal for the logged professor', async () => {
        const proposal = {
            title: 'Title',
            supervisor: 'supervisor@example.com',
            co_supervisor: ['co_supervisor1', 'co_supervisor2'],
            keywords: ['keyword1', 'keyword2'],
            type: 'Type1',
            groups: ['group1', 'group2'],
            description: 'Description1',
            required_knowledge: ['knowledge1', 'knowledge2'],
            notes: 'Notes1',
            expiration: '2023-12-31',
            level: 1,
            programmes: ['program1', 'program2'],
        }
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        jest.spyOn(thesisProposalTable, 'addThesisProposal').mockImplementationOnce(() => true);
        const response = await request(app).post('/api/teacher/insertProposal').send(proposal)
        expect(response.status).toBe(200);
        expect(response.body).toBeTruthy();
    });

    test('Should throw an error with 422 status code when the format of the request is not valid', async () => {
        const proposal = {
            title: 'Title',
            supervisor: 'supervisor@example.com',
            keywords: 'INVALID KEYWORDS!!!!!!!!!!!',
            type: 'Type1',
            groups: ['group1', 'group2'],
            description: 'Description1',
            expiration: '2023-12-31',
            level: 'INVALID LEVEL!!!!!!!!!!!!',
            programmes: ['program1', 'program2'],
        }
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        const response = await request(app).post('/api/teacher/insertProposal').send(proposal)
        expect(response.status).toBe(422);
        expect(response.body).toBeTruthy();
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        const proposal = {
            title: 'Title',
            supervisor: 'supervisor@example.com',
            co_supervisor: ['co_supervisor1', 'co_supervisor2'],
            keywords: ['keyword1', 'keyword2'],
            type: 'Type1',
            groups: ['group1', 'group2'],
            description: 'Description1',
            required_knowledge: ['knowledge1', 'knowledge2'],
            notes: 'Notes1',
            expiration: '2023-12-31',
            level: 1,
            programmes: ['program1', 'program2'],
        }
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        jest.spyOn(thesisProposalTable, 'addThesisProposal').mockImplementationOnce(() => {
            throw new Error('Database error');
        });
        const response = await request(app).post('/api/teacher/insertProposal').send(proposal)
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during the insert of proposal: Error: Database error' });
    });
});

describe('DELETE /api/teacher/deleteProposal', () => {
    test('Should successfully delete a proposal of the logged professor given the ID', async () => {
        const deletedProposal = {
            id: 1,
            title: 'Proposal1',
            teacher_id: 1,
            supervisor: 'Supervisor1',
            cosupervisor: ['Cosupervisor1', 'Cosupervisor2'],
            keywords: ['keyword1', 'keyword2'],
            type: 'Type1',
            groups: ['Group1', 'Group2'],
            description: 'Description1',
            required_knowledge: ['Knowledge1', 'Knowledge2'],
            notes: 'Notes1',
            expiration: new Date().getMilliseconds(),
            level: 1,
            programmes: ['Program1', 'Program2'],
            archived: true,
        }
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        jest.spyOn(applicationTable, 'getStudentInfoPendingApplicationForAProposal').mockImplementationOnce(() => []);
        jest.spyOn(applicationTable, 'countAcceptedApplicationForAProposal').mockImplementationOnce(() => 0);
        jest.spyOn(thesisProposalTable, 'deleteById').mockImplementationOnce(() => deletedProposal);
        const response = await request(app).delete('/api/teacher/deleteProposal').send({proposalId: 1});
        expect(response.status).toBe(200);
        expect(response.body).toEqual(deletedProposal);
    });

    test('Should throw an error with 422 status code when the provided proposal ID is not an integer', async () => {
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        const response = await request(app).delete('/api/teacher/deleteProposal').send({ proposalId: 'invalidId' });
        expect(response.status).toBe(422);
        expect(response.body).toBeTruthy();
    });

    test('Should throw an error with 400 status code if the application has already been accepted by a student', async () => {
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        jest.spyOn(applicationTable, 'getStudentInfoPendingApplicationForAProposal').mockImplementationOnce(() => []);
        jest.spyOn(applicationTable, 'countAcceptedApplicationForAProposal').mockImplementationOnce(() => 1);
        const response = await request(app).delete('/api/teacher/deleteProposal').send({proposalId: 1});
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: `The proposal has been accepted by a student, so it cannot be deleted` });
    });

    /*test('Should throw an error with 500 status code when it fails to send a notification to the relative students', async () => {
        const deletedProposal = {
            id: 1,
        }
        const application = {
            id: 1,
        }
        const proposalInfo = {
            title: "Proposal1",
        }
        const teacherInfo = {
            name: 'Professor1',
        }
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        jest.spyOn(applicationTable, 'getStudentInfoPendingApplicationForAProposal')
            .mockImplementationOnce(() => ['mail1']);
        jest.spyOn(applicationTable, 'getById').mockImplementationOnce(() => application);
        jest.spyOn(thesisProposalTable, 'getById').mockImplementationOnce(() => proposalInfo);
        jest.spyOn(teacherTable, 'getById').mockImplementationOnce(() => teacherInfo);
        const response = await request(app).delete('/api/teacher/deleteProposal').send({proposalId: 1});
        expect(response.status).toBe(500);
        expect(response.body).toBeTruthy();
    });*/

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        const application = {
            id: 1,
        }
        const proposalInfo = {
            title: "Proposal1",
        }
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        jest.spyOn(applicationTable, 'getStudentInfoPendingApplicationForAProposal').mockImplementationOnce(() => ['mail1'])
        jest.spyOn(applicationTable, 'getById').mockImplementationOnce(() => application);
        jest.spyOn(thesisProposalTable, 'getById').mockImplementationOnce(() => proposalInfo);
        jest.spyOn(teacherTable, 'getById').mockImplementationOnce(() => {
            throw new Error('Database error')
        });
        jest.spyOn(applicationTable, 'getStudentInfoPendingApplicationForAProposal').mockImplementationOnce(() => []);
        jest.spyOn(applicationTable, 'countAcceptedApplicationForAProposal').mockImplementationOnce(() => 0);

        const response = await request(app).delete('/api/teacher/deleteProposal').send({ proposalId: 1 });
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during the deletion of the thesis proposal: Error: Database error' });
    });
});

describe("PUT /api/teacher/updateProposal/:thesisid", () => {
    test('Should successfully update the a thesis proposal given its ID', async () => {
        const proposalID = 1;
        const proposalUpdated = {
            title: 'Proposal1',
            co_supervisor: ['Cosupervisor1', 'Cosupervisor2'],
            keywords: ['keyword1', 'keyword2'],
            type: 'Type1',
            groups: ['Group1', 'Group2'],
            description: 'Description1',
            required_knowledge: ['Knowledge1', 'Knowledge2'],
            notes: 'Notes1',
            expiration: '2022-02-02',
            level: 1,
            programmes: ['Program1', 'Program2'],
        }
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        jest.spyOn(thesisProposalTable, 'updateThesisProposal').mockImplementationOnce(() => proposalID);
        const response = await request(app)
            .put(`/api/teacher/updateProposal/${proposalID}`)
            .send(proposalUpdated);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(proposalID);
    });

    test('Should throw an error with 422 status code when a validation error occurs', async () => {
        const proposalID = 1;
        const InvalidProposalUpdated = {
            title: 'Proposal1',
            co_supervisor: ['Cosupervisor1', 'Cosupervisor2'],
            keywords: ['keyword1', 'keyword2'],
            type: 1234567890,
            groups: ['Group1', 'Group2'],
            description: 'Description1',
            required_knowledge: ['Knowledge1', 'Knowledge2'],
            notes: 'Notes1',
            expiration: 'INVALID DATE!!!!!!',
            level: 1,
            programmes: ['Program1', 'Program2'],
        }
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        const response = await request(app)
            .put(`/api/teacher/updateProposal/${proposalID}`)
            .send(InvalidProposalUpdated);
        expect(response.status).toBe(422);
        expect(response.body).toBeTruthy();
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        const proposalID = 1;
        const proposalUpdated = {
            title: 'Proposal1',
            co_supervisor: ['Cosupervisor1', 'Cosupervisor2'],
            keywords: ['keyword1', 'keyword2'],
            type: 'Type1',
            groups: ['Group1', 'Group2'],
            description: 'Description1',
            required_knowledge: ['Knowledge1', 'Knowledge2'],
            notes: 'Notes1',
            expiration: '2022-02-02',
            level: 1,
            programmes: ['Program1', 'Program2'],
        }
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        jest.spyOn(thesisProposalTable, 'updateThesisProposal').mockImplementationOnce(() => {
            throw new Error('Database error');
        })
        const response = await request(app)
            .put(`/api/teacher/updateProposal/${proposalID}`)
            .send(proposalUpdated);
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during the update of the proposal: Error: Database error' });
    });
})

//archive proposal
describe('PATCH /api/teacher/ProposalsList/:proposalid', () => {

    test('Should successfully update the status of the proposal to archived', async () => {
        const proposal = {
            title: 'Title1',
            expiration: '2023/01/01',
            level: 1,
            type: 'Type1',
            archived: false
        }
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        jest.spyOn(thesisProposalTable, 'getById').mockImplementationOnce(() => proposal);
        jest.spyOn(thesisProposalTable, 'archiveThesisProposal').mockImplementationOnce(() => true);
        const response = await request(app).patch('/api/teacher/ProposalsList/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(true);
    });

    test('Should successfully update the status of the proposal to active', async () => {
        const proposal = {
            title: 'Title1',
            expiration: '2023/01/01',
            level: 1,
            type: 'Type1',
            archived: true
        }
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        jest.spyOn(thesisProposalTable, 'getById').mockImplementationOnce(() => proposal);
        jest.spyOn(thesisProposalTable, 'unArchiveThesisProposal').mockImplementationOnce(() => true);
        const response = await request(app).patch('/api/teacher/ProposalsList/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(true);
    });

    test('Should throw an error when the proposal do not exists', async () => {
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        jest.spyOn(thesisProposalTable, 'getById').mockImplementationOnce(() => { });
        const response = await request(app).patch('/api/teacher/ProposalsList/1');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'The proposal does not exist!' });
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        jest.spyOn(thesisProposalTable, 'getById').mockImplementationOnce(() => { throw new Error('Database error') });
        const response = await request(app).patch('/api/teacher/ProposalsList/1');
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: `Database error during archival of thesis proposal Error: Database error` });
    });
});

describe('POST /api/teacher/retrieveCosupGroup', () => {
    test('Should successfully return the groups of the co-supervisors given their email', async () => {
        const groups = [
            'Group1',
            'Group2'
        ];
        const group1 = [
            {
                name: 'Group1'
            }
        ]
        const group2 = [
            {
                name: 'Group2'
            }
        ]
        const group3 = []
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        jest.spyOn(teacherTable, 'getGroupByMail').mockImplementationOnce(() => group1);
        jest.spyOn(teacherTable, 'getGroupByMail').mockImplementationOnce(() => group2);
        jest.spyOn(teacherTable, 'getGroupByMail').mockImplementationOnce(() => group3);
        const response = await request(app).post('/api/teacher/retrieveCosupGroup')
            .send({cosup_mails: ['mail1', 'mail2', 'mail3']});
        expect(response.status).toBe(200);
        expect(response.body).toEqual(groups);
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        jest.spyOn(teacherTable, 'getGroupByMail').mockImplementationOnce(() => {
            throw new Error('Database error')
        });
        const response = await request(app).post('/api/teacher/retrieveCosupGroup')
            .send({cosup_mails: ['mail1']});
        expect(response.status).toBe(503);
        expect(response.body).toEqual({error: 'Database error during retrieving cosupervisor groups Error: Database error'});
    });
});

//send notification



describe('POST /api/send_email', () => {

    const params = {
        recipient_mail: 's319950@studenti.polito.it',
        subject: 'pluto',
        message: 'paperino'
    }

    //correct email sending

    //internal server error 500


    //database error 503


    test('Should throw an error with 503 status code when a database error occurs', async () => {
    const params2 = {
        recipient_mail: 'pippo',
        subject: 'pluto',
        message: 'paperino'
    }

    jest.mock('nodemailer', () => ({
        createTransport: jest.fn().mockReturnValue({
            sendMail: jest.fn().mockReturnValue({ message: 'Email sent successfully' })
        })
    }));

    //correct email sending
    test('Should succesfully send an email to notify a student when his or her application has been accepted or rejected', async () => {
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });

        const response = await request(app).post('/api/send_email').send(params);
        expect(response.status).toBe(200);
        expect(response.text).toEqual('Email sent successfully');
    });

    //internal server error 500
    test('Should throw an error with 500 status code when a database error occurs', async () => {
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });

        const response = await request(app).post('/api/send_email').send(params2);
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "No recipients defined" });
    })
});

//retrieve cosupervisors group from email

afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks();
});

describe('POST /api/teacher/retrieveCosupGroup', () => {
    test('Should throw an error with 503 status code when a database error occurs', async () => {
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });

        jest.spyOn(teacherTable, 'getGroupByMail').mockImplementationOnce(() => { throw new Error('Database error') });
        const response = await request(app).post('/api/teacher/retrieveCosupGroup');
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: "Database error during retrieving cosupervisor groups TypeError: req.body.cosup_mails is not iterable" });
    });

    test('Should succesfully return the groups of the cosupervisors', async () => {
        const mock_req = {
            cosup_mails: ['mail1', 'mail2', 'mail3']
        }

        const mock_group = [
            { name: 'Group1' }
        ];

        const mock_groups = ['Group1', 'Group1', 'Group1'];

        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });

        jest.spyOn(teacherTable, 'getGroupByMail').mockImplementation(() => mock_group);
        const response = await request(app).post('/api/teacher/retrieveCosupGroup').send(mock_req);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mock_groups);
    });
})