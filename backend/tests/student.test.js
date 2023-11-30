import request from 'supertest';
import { psqlDriver, app, isLoggedInAsStudent } from '../index.js';
import {applicationTable, studentTable, thesisProposalTable} from '../dbentities.js';
import { jest } from '@jest/globals';

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

describe('isLoggedInAsStudent middleware', () => {
    test('Should allow the user authenticated as a student to proceed', async () => {
        const isAuthenticatedMock = jest.fn(() => true);
        const req = { isAuthenticated: isAuthenticatedMock, user: { id: '1', role: 'student' } };
        const res = {};
        const next = jest.fn();
        await isLoggedInAsStudent(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    test('Should throw an error with 401 error code when the user is not authenticated as a student', async () => {
        // Mocking isAuthenticated and user role
        const isAuthenticatedMock = jest.fn(() => true);
        const req = {
            isAuthenticated: isAuthenticatedMock,
            user: { id: 1, role: 'teacher' }
        };
        const res = { status: jest.fn(() => ({ json: jest.fn() })) };
        const next = jest.fn();
        await isLoggedInAsStudent(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });
});
describe('GET /api/student/details', () => {
    test('Should successfully return the details of the logged student', async () => {
        const studentDetails = {
            id: 1,
            surname: 'surname1',
            name: 'name1',
            gender: 'M',
            nationality: 'Italian',
            email: 'email1',
            cod_degree: '1',
            enrollment_year: '2023/01/01',
        };
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'student' };
            next();
        })
        jest.spyOn(studentTable, 'getDetailsById').mockImplementationOnce(() => studentDetails);
        const response = await request(app).get('/api/student/details');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(studentDetails);
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'student' };
            next();
        })
        jest.spyOn(studentTable, 'getDetailsById').mockImplementationOnce(() => {
            throw new Error("Database error")
        });
        const response = await request(app).get('/api/student/details');
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during retrieving student details Error: Database error' });
    });
});

describe('GET /api/student/ApplicationsList', () => {
    test('Should successfully return the list of applications issued by the logged student', async () => {
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
                student_id: 1,
                proposal_id: 2,
                apply_date: '2023/01/01',
                status: false,
                thesis_title: 'Title2',
            },
        ];
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'student' };
            next();
        })
        jest.spyOn(applicationTable, 'getByStudentId').mockImplementationOnce(() => applications);
        const response = await request(app).get('/api/student/ApplicationsList');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(applications);
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'student' };
            next();
        })
        jest.spyOn(applicationTable, 'getByStudentId').mockImplementationOnce(() => {
            throw new Error('Database error');
        });
        const response = await request(app).get('/api/student/ApplicationsList');
        expect(response.status).toBe(503);
        expect(response.body).toEqual({error: 'Database error during retrieving application List'});
    });
});

describe('POST /api/student/applyProposal', () => {
    test('Should successfully apply for a thesis proposal', async () => {
        const valid_id = "validID"
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'student' };
            next();
        })
        const countMock = {
            count: 0
        };
        jest.spyOn(applicationTable, 'getCountByFK').mockImplementationOnce(() => countMock);
        jest.spyOn(applicationTable, 'addApplicationWithDate').mockImplementationOnce(() => valid_id);
        const response = await request(app).post('/api/student/applyProposal')
            .send({proposal_id: 1, apply_date: '2023-12-31'});
        expect(response.status).toBe(200);
        expect(response.body).toEqual(valid_id);
    });

    test('Should throw an error with 422 status code when the format of the parameters is invalid', async () => {
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'student' };
            next();
        })
        const countMock = {
            count: 0
        };
        jest.spyOn(applicationTable, 'getCountByFK').mockImplementationOnce(() => countMock);
        const response = await request(app).post('/api/student/applyProposal')
            .send({proposal_id: 1, apply_date: 'invalid_date'});
        expect(response.status).toBe(422);
        expect(response.body).toBeTruthy();
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'student' };
            next();
        })
        const countMock = {
            count: 0
        };
        jest.spyOn(applicationTable, 'getCountByFK').mockImplementationOnce(() => countMock);
        jest.spyOn(applicationTable, 'addApplicationWithDate').mockImplementationOnce(() => {
            throw new Error("Database error")
        });
        const response = await request(app).post('/api/student/applyProposal')
            .send({proposal_id: 1, apply_date: '2023-12-31'});
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during the insert of the application: Error: Database error' });
    });
});

describe('POST /api/student/ProposalsList', () => {
    test('Should successfully return the list of applications issued by the logged student', async () => {
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
            req.user = { id: 1, role: 'student' };
            next();
        })
        jest.spyOn(thesisProposalTable, 'getAll').mockImplementationOnce(() => proposals);
        const response = await request(app).post('/api/student/ProposalsList').send({});
        expect(response.status).toBe(200);
        expect(response.body).toEqual(proposals);
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'student' };
            next();
        })
        jest.spyOn(thesisProposalTable, 'getAll').mockImplementationOnce(() => {
            throw new Error('Database error');
        });
        const response = await request(app).post('/api/student/ProposalsList').send({});
        expect(response.status).toBe(503);
        expect(response.body).toEqual({error: 'Database error during retrieving application List Error: Database error'});
    });
});