import request from 'supertest';
import { psqlDriver, app, isLoggedInAsClerk } from '../index.js';
import {applicationTable, thesisRequestTable} from '../dbentities.js';
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

describe('isLoggedInAsClerk middleware', () => {
    test('Should allow the user authenticated as a clerk to proceed', async () => {
        const isAuthenticatedMock = jest.fn(() => true);
        const req = { isAuthenticated: isAuthenticatedMock, user: { id: '1', role: 'clerk' } };
        const res = {};
        const next = jest.fn();
        await isLoggedInAsClerk(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    test('Should throw an error with 401 error code when the user is not authenticated as a clerk', async () => {
        const isAuthenticatedMock = jest.fn(() => true);
        const req = {
            isAuthenticated: isAuthenticatedMock,
            user: { id: 1, role: 'student' }
        };
        const res = { status: jest.fn(() => ({ json: jest.fn() })) };
        const next = jest.fn();
        await isLoggedInAsClerk(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });
});

describe('GET /api/clerk/Requestlist', () => {
    test('Should successfully return the list of thesis requests yet to be approved', async () => {
        const requestsList = [
            {
                id: 1,
                details: 'Details1'
            },
            {
                id: 2,
                details: 'Details2'
            },
        ]
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'clerk' };
            next();
        })
        jest.spyOn(thesisRequestTable, 'getAllNotApprovedByClerkRequest').mockImplementationOnce(() => requestsList);
        const response = await request(app).get('/api/clerk/Requestlist');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(requestsList);
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'clerk' };
            next();
        })
        jest.spyOn(thesisRequestTable, 'getAllNotApprovedByClerkRequest').mockImplementationOnce(() => {
            throw new Error("Database error")
        });
        const response = await request(app).get('/api/clerk/Requestlist');
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during retrieving requests list. Error: Database error' });
    });
});

describe('PATCH /api/clerk/Requestlist/:requestid', () => {
    test('Should successfully update the status of the thesis request with the specified ID', async () => {
        const thesisRequest = {
            id: 1,
            details: 'Details',
            status_clerk: null,
        }
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'clerk' };
            next();
        });
        jest.spyOn(thesisRequestTable, 'getRequestDetailById').mockImplementationOnce(() => thesisRequest)
        jest.spyOn(thesisRequestTable, 'updateRequestClerkStatusById').mockImplementationOnce(() => true);
        const response = await request(app).patch('/api/clerk/Requestlist/1').send({ status_clerk: true })
        expect(response.status).toBe(200);
        expect(response.body).toBe(true);
    });

    test('Should throw an error with 422 status code when the format of the request is not valid', async () => {
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'clerk' };
            next();
        });
        const response = await request(app).patch('/api/clerk/Requestlist/1').send({ status_clerk: 'invalid' })
        expect(response.status).toBe(422);
        expect(response.body).toBeTruthy();
    });

    test('Should throw an error with 400 status code if the thesis request does not exist', async () => {
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'clerk' };
            next();
        });
        jest.spyOn(thesisRequestTable, 'getRequestDetailById').mockImplementationOnce(() => {})
        const response = await request(app).patch('/api/clerk/Requestlist/1').send({ status_clerk: true })
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'The request does not exist!' });
    });

    test('Should throw an error with 400 status code when the thesis request has already been accepted', async () => {
        const thesisRequest = {
            id: 1,
            details: 'Details',
            status_clerk: true,
        }
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'clerk' };
            next();
        });
        jest.spyOn(thesisRequestTable, 'getRequestDetailById').mockImplementationOnce(() => thesisRequest)
        const response = await request(app).patch('/api/clerk/Requestlist/1').send({ status_clerk: true })
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'This request has already been accepted' });
    });

    test('Should throw an error with 400 status code when the thesis request has already been rejected', async () => {
        const thesisRequest = {
            id: 1,
            details: 'Details',
            status_clerk: false,
        }
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'clerk' };
            next();
        });
        jest.spyOn(thesisRequestTable, 'getRequestDetailById').mockImplementationOnce(() => thesisRequest)
        const response = await request(app).patch('/api/clerk/Requestlist/1').send({ status_clerk: true })
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'This request has already been rejected' });
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'clerk' };
            next();
        });
        jest.spyOn(thesisRequestTable, 'getRequestDetailById').mockImplementationOnce(() => {
            throw new Error('Database error');
        })
        const response = await request(app).patch('/api/clerk/Requestlist/1').send({ status_clerk: true })
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during retrieving requests list. Error: Database error' });
    });
});