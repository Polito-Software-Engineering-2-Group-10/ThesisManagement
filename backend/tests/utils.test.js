import request from 'supertest';
import dayjs from 'dayjs';
import { psqlDriver, app, isLoggedIn } from '../index.js';
import {thesisProposalTable, teacherTable, studentTable} from '../dbentities.js';
import { jest } from '@jest/globals';
import virtualClock from "../VirtualClock.js";

afterAll(async () => {
    await psqlDriver.closeAll();
});

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

describe('GET /api/student/list', () => {
    test('Should successfully retrieve the list of students', async () => {
        const studentsList = [
            {
                id: 1,
                surname: 'surname1',
                name: 'name1',
                email: 'email1@test.it',
            },
            {
                id: 2,
                name: 'surname2',
                surname: 'name2',
                email: 'email2@test.it',
            },
        ];
        jest.spyOn(studentTable, 'getAllStudents').mockImplementationOnce(() => studentsList);
        const response = await request(app).get('/api/student/list');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(studentsList.map((p) => (
            {
                name: p.name,
                surname: p.surname,
                id: p.id,
                email: p.email,
            }
        )));
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        jest.spyOn(studentTable, 'getAllStudents').mockImplementationOnce(() => {
            throw new Error('Database error')
        });
        const response = await request(app).get('/api/student/list');
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during retrieving students list Error: Database error' });
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

describe('GET /api/proposal/:proposalid', () => {
    test('Should successfully retrieve the proposal given the ID', async () => {
        const proposal = {
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
        jest.spyOn(thesisProposalTable, 'getById').mockImplementationOnce(() => proposal);
        const response = await request(app).get('/api/proposal/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(proposal);
    });

    test('Should throw an error with 503 status code when a database error occurs', async () => {
        jest.spyOn(thesisProposalTable, 'getById').mockImplementationOnce(() => {
            throw new Error('Database error')
        });
        const response = await request(app).get('/api/proposal/1');
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: 'Database error during retrieving proposal Error: Database error' });
    });
});

describe('GET /api/virtualclock', () => {
    test('Should successfully get the value of virtual clock', async () => {
        const date = '2023-12-12';
        jest.spyOn(virtualClock, 'getSqlDate').mockImplementationOnce(() => date);
        const response = await request(app).get('/api/virtualclock')
        expect(response.status).toBe(200);
        expect(response.body).toEqual({date: date});
    });
});

describe('POST /api/virtualclock', () => {
    test('Should successfully modify the virtual clock', async () => {
        const date = '2023-12-12'
        jest.spyOn(virtualClock, 'setOffset').mockImplementationOnce(() => true);
        const response = await request(app).post('/api/virtualclock')
            .send({date});
        expect(response.status).toBe(200);
        expect(response.body).toEqual({date: dayjs(date).toISOString()});
    });

    test('Should throw an error with 422 status code when the date passed is not in a valid format', async () => {
        const invalid_date = 'invalid_date'
        const response = await request(app).post('/api/virtualclock')
            .send({invalid_date});
        expect(response.status).toBe(422);
        expect(response.body).toBeTruthy();
    });
});

describe('DELETE /api/virtualclock', () => {
    test('Should successfully reset the virtual clock', async () => {
        jest.spyOn(virtualClock, 'resetOffset').mockImplementationOnce(() => true);
        const response = await request(app).delete('/api/virtualclock')
        expect(response.status).toBe(200);
        expect(response.body).toBeTruthy();
    });
});

describe('POST /upload', () => {
    test('Should successfully upload a file in the DB', async () => {
        const response = await request(app).post('/upload')
        expect(response.status).toBe(200);
        expect(response.body).toBeTruthy();
    });
});

describe('Notify Expiration', () => {
    test('Should succesfully notify the supervisor a week before his or her proposal expires', async () => {
        await psqlDriver.listen('thesismanagement', 'notify_professors', async (msg) =>  {
            console.log(msg.channel);
        })
    })
})