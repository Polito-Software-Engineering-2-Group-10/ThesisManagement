import request from 'supertest';
import { server, psqlDriver, app, isLoggedIn, isLoggedInAsTeacher, isLoggedInAsStudent } from './index.js';
import { thesisProposalTable, applicationTable, teacherTable, studentTable } from './dbentities.js';
import { jest } from '@jest/globals';

afterAll(async () => {
    await psqlDriver.closeAll();
    server.close();
});

function registerMockMiddleware(app, index, middleware) {
    function mockWare(req, res, next) {
        middleware(req, res, next)
        app._router.stack.splice(index, 1);
    }
    app.use(mockWare)
    app._router.stack.splice(index, 0, app._router.stack.find(r => r.name === 'mockWare'));
}

describe('isLoggedIn middleware', () => {
    test('Should allow the user who is still logged in to proceed', async () => {
        const isAuthenticated = jest.fn(() => true);
        const req = {
            isAuthenticated: isAuthenticated,
        };
        const res = {};
        const next = jest.fn();
        await isLoggedIn(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    test('Should throw an error with 401 error code when the user is not authenticated', async () => {
        const isAuthenticated = jest.fn(() => false);
        const req = {
            isAuthenticated: isAuthenticated,
        };
        const res = {status: jest.fn(() => ({ json: jest.fn() })) };
        const next = jest.fn();
        await isLoggedIn(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });
});

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

describe('GET /api/student/details', () => {
    /*test('Should successfully return the details of the logged student', async () => {
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
    });*/
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

describe('GET /api/student/ApplicationsList', () => {
    test('Should successfully return the list of applications issued by the logged student', async () => {

    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {

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
        const proposalsSummary = [
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
        expect(response.body).toEqual(proposalsSummary);
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

describe('GET /api/ProposalsList', () => {
    test('Should successfully retrieve the list of thesis proposals', async () => {
        const proposalList = [
            {
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
            },
            {
                id: 2,
                title: 'Proposal2',
                teacher_id: 2,
                supervisor: 'Supervisor2',
                cosupervisor: ['Cosupervisor3', 'Cosupervisor4'],
                keywords: ['keyword3', 'keyword4'],
                type: 'Type2',
                groups: ['Group3', 'Group4'],
                description: 'Description2',
                required_knowledge: ['Knowledge3', 'Knowledge4'],
                notes: 'Notes2',
                expiration: new Date().getMilliseconds(),
                level: 2,
                programmes: ['Program3', 'Program4'],
                archived: false, }
        ];
        jest.spyOn(thesisProposalTable, 'getAll').mockImplementationOnce(() => proposalList);
        const response = await request(app).get('/api/ProposalsList');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(proposalList);
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        jest.spyOn(thesisProposalTable, 'getAll').mockImplementationOnce(() => {
            throw new Error('Database error')
        });
        const response = await request(app).get('/api/ProposalsList');
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during retrieving application List Error: Database error' });
    });
});

describe('POST /api/ProposalsList/filter', () => {
    test('Should successfully retrieve the list of filtered thesis proposals', async () => {
        const proposalList = [
            {
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
            },
        ]
        jest.spyOn(thesisProposalTable, 'getFilteredProposals').mockImplementationOnce(() => proposalList)
        const response = await request(app)
            .post('/api/ProposalsList/filter')
            .send({
                title: 'Proposal1',
                professor: 1,
                date: '2023-01-01',
                type: ['Type1'],
                keywords: ['Keyword1', 'Keyword2'],
                level: 1,
                groups: ['Group1', 'Group2']
            });
        expect(response.status).toBe(200);
        expect(response.body).toEqual(proposalList);
    });

    test('Should throw an error with 422 status code when a validation error occurs', async () => {
        const response = await request(app)
            .post('/api/ProposalsList/filter')
            .send({ date: 'invalid_date' });
        expect(response.status).toBe(422);
        expect(response.body).toBeTruthy();
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        jest.spyOn(thesisProposalTable, 'getFilteredProposals').mockImplementationOnce(() => {
            throw new Error('Database error');
        })
        const response = await request(app)
            .post('/api/ProposalsList/filter')
            .send({});
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during the getting proposals: Error: Database error' });
    });
});

describe('GET /api/teacher/list', () => {
    test('Should successfully retrieve the list of professors', async () => {
        const professorsList = [
            {
                id: 1,
                surname: 'surname1',
                name: 'name1',
                email: 'email1',
                cod_group: 1,
                cod_department: 1,
            },
            {
                id: 2,
                name: 'surname2',
                surname: 'name2',
                email: 'email2',
                cod_group: 2,
                cod_department: 2,
            },
        ];
        jest.spyOn(teacherTable, 'getAll').mockImplementationOnce(() => professorsList);
        const response = await request(app).get('/api/teacher/list');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(professorsList.map((p) => ({ name: p.name, surname: p.surname, id: p.id })));
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        jest.spyOn(teacherTable, 'getAll').mockImplementationOnce(() => {
            throw new Error('Database error')
        });
        const response = await request(app).get('/api/teacher/list');
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during retrieving teacher list Error: Database error' });
    });
});

describe('GET /api/thesis/types', () => {
    test('Should successfully retrieve the list of thesis types', async () => {
        const types = ['Type1', 'Type2'];
        jest.spyOn(thesisProposalTable, 'getTypes').mockImplementationOnce(() => types);
        const response = await request(app).get('/api/thesis/types');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(types);
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        jest.spyOn(thesisProposalTable, 'getTypes').mockImplementationOnce(() => {
            throw new Error('Database error')
        });
        const response = await request(app).get('/api/thesis/types');
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during retrieving thesis types Error: Database error' });
    });
});

describe('GET /api/thesis/keywords', () => {
    test('Should successfully retrieve the list of thesis keywords', async () => {
        const keywords = ['Keyword1', 'Keyword2', 'Keyword3'];
        jest.spyOn(thesisProposalTable, 'getKeywords').mockImplementationOnce(() => keywords);
        const response = await request(app).get('/api/thesis/keywords');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(keywords);
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        jest.spyOn(thesisProposalTable, 'getKeywords').mockImplementationOnce(() => {
            throw new Error('Database error')
        });
        const response = await request(app).get('/api/thesis/keywords');
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during retrieving thesis keywords Error: Database error' });
    });
})

describe('GET /api/thesis/groups', () => {
    test('Should successfully retrieve the list of thesis groups', async () => {
        const groups = ['Group1', 'Group2', 'Group3'];
        jest.spyOn(thesisProposalTable, 'getGroups').mockImplementationOnce(() => groups);
        const response = await request(app).get('/api/thesis/groups');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(groups);
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        jest.spyOn(thesisProposalTable, 'getGroups').mockImplementationOnce(() => {
            throw new Error('Database error')
        });
        const response = await request(app).get('/api/thesis/groups');
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during retrieving thesis groups Error: Database error' });
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
        const response = await request(app).delete('/api/teacher/deleteProposal').send({proposalId: 'invalidId'});
        expect(response.status).toBe(422);
        expect(response.body).toBeTruthy();
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        registerMockMiddleware(app, 0, (req, res, next) => {
            req.isAuthenticated = jest.fn(() => true);
            req.user = { id: 1, role: 'teacher' };
            next();
        });
        jest.spyOn(thesisProposalTable, 'deleteById').mockImplementationOnce(() => {
            throw new Error('Database error')
        });
        const response = await request(app).delete('/api/teacher/deleteProposal').send({proposalId: 1});
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during the deletion of the thesis proposal: Error: Database error' });
    });
});
