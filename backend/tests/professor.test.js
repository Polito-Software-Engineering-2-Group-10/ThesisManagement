import request from 'supertest';
import { server, psqlDriver, app, isLoggedInAsTeacher } from '../index.js';
import { thesisProposalTable, applicationTable, teacherTable } from '../dbentities.js';
import { jest } from '@jest/globals';

afterAll(async () => {
    await psqlDriver.closeAll();
});

afterEach(async() => {
    await server.close();
})

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
        expect(response.body).toEqual({error: 'Database error during retrieving application List' });
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
        jest.spyOn(applicationTable, 'getTeacherAppStatusById').mockResolvedValueOnce({status: true});
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        const response = await request(app).get('/api/teacher/applicationDetail/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({detail:application, status: {status: true}});
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
        expect(response.body).toEqual({error :'Database error during retrieving application List'});
    });
});

describe('PATCH /api/teacher/applicationDetail/:applicationid', () => {
    test('Should successfully update the status of the application with the specified ID', async () => {
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
        jest.spyOn(applicationTable, 'updateApplicationStatusById').mockResolvedValueOnce(true);
        const response = await request(app).patch('/api/teacher/applicationDetail/1').send({status: true})
        expect(response.status).toBe(200);
        expect(response.body).toBeTruthy();
    });

    test('Should throw an error with 422 status code when the format of the request is not valid', async () => {
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        const response = await request(app).patch('/api/teacher/applicationDetail/1').send({status: 'invalid'})
        expect(response.status).toBe(422);
        expect(response.body).toBeTruthy();
    });

    test('Should throw an error with 400 status code if the application does not exist', async () => {
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        jest.spyOn(applicationTable, 'getTeacherAppDetailById').mockImplementationOnce(() => {})
        const response = await request(app).patch('/api/teacher/applicationDetail/1').send({status: true})
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'The application does not exist!'});
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
        const response = await request(app).patch('/api/teacher/applicationDetail/1').send({status: true})
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'This application has already been accepted'});
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
        const response = await request(app).patch('/api/teacher/applicationDetail/1').send({status: true})
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'This application has already been rejected'});
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
        const response = await request(app).patch('/api/teacher/applicationDetail/1').send({status: true})
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during retrieving application List Error: Database error'});
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
        expect(response.body).toEqual({error: 'Database error during retrieving application List Error: Database error'});
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
        expect(response.body).toEqual({error: 'Database error during the insert of proposal: Error: Database error'});
    });
});