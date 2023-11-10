'use strict';
import { psqlDriver } from '../dbdriver.js';
import { getNum } from './utils.js';

class Application {
    constructor(id, student_id, proposal_id, apply_date, status) {
        this.id = id;
        this.student_id = student_id;
        this.proposal_id = proposal_id;
        this.apply_date = apply_date;
        this.status = status;
    }
    toString() {
        return `Application (${this.id} - ${this.student_id} - ${this.proposal_id} - ${this.apply_date} - ${this.status})`;
    }
    static fromRow(row) {
        return new Application(row.id, row.student_id, row.proposal_id, row.apply_date, row.status);
    }
}

class ApplicationTable {
    constructor(dbName) {
        this.dbName = dbName;
    }
    static async initialize() {
        const applicationTable = new ApplicationTable('thesismanagement');
        applicationTable.db = await psqlDriver.openDatabase('thesismanagement');
        return applicationTable;
    }
    async getById(id) {
        const query = `SELECT * FROM application WHERE id = $1`;
        const aid = getNum(id);
        const result = await this.db.executeQueryExpectOne(query, aid, `Application with id ${id} not found`);
        return Application.fromRow(result);
    }

    async getDetailById(id) {
        const query= `SELECT student.*, degree.title_degree,thesis_proposal.title,application.apply_date from student, degree, application,thesis_proposal 
        where student.cod_degree=degree.cod_degree 
        and student.id=application.student_id 
        and application.id=$1
        and application.proposal_id=thesis_proposal.id`;
        const result = await this.db.executeQueryExpectAny(query, id);
        return result;

    }
    async getByStudentId(student_id) {
        const query = `SELECT * FROM application WHERE student_id = $1`;
        const id = getNum(student_id);
        const result = await this.db.executeQueryExpectAny(query, id);
        return result.map(Application.fromRow);
    }
    async getByProposalId(proposal_id) {
        const query = `SELECT * FROM application WHERE proposal_id = $1`;
        const id = getNum(proposal_id);
        const result = await this.db.executeQueryExpectAny(query, id);
        return result.map(Application.fromRow);
    }
    async getByTeacherId(teacher_id) {
        const query = `SELECT application.*, thesis_proposal.id AS proposal_id, thesis_proposal.title AS thesis_title FROM application, thesis_proposal WHERE 
	                    proposal_id IN (select id FROM thesis_proposal WHERE teacher_id = $1)
	                    AND thesis_proposal.id = application.proposal_id;`;
        const id = getNum(teacher_id);
        const result = await this.db.executeQueryExpectAny(query, id);
        return result.map((r) => { return { ...Application.fromRow(r), proposal_id: r.proposal_id, thesis_title: r.thesis_title } });
    }
    async addApplication(student_id, proposal_id) {
        const query = `INSERT INTO application (student_id, proposal_id, apply_date) VALUES ($1, $2, NOW()) RETURNING *`;
        const sid = getNum(student_id);
        const pid = getNum(proposal_id);
        const result = await this.db.executeQueryExpectOne(query, sid, pid);
        return Application.fromRow(result);
    }
    async addApplicationWithDate(student_id, proposal_id, apply_date) {
        const query = `INSERT INTO application (student_id, proposal_id, apply_date) VALUES ($1, $2, $3) RETURNING *`;
        const sid = getNum(student_id);
        const pid = getNum(proposal_id);
        const result = await this.db.executeQueryExpectOne(query, sid, pid, apply_date);
        return Application.fromRow(result);
    }
    async updateApplicationStatusById(id, status) {
        const query = `UPDATE application SET status = $2 WHERE id = $1 RETURNING *`;
        const aid = getNum(id);
        const result = await this.db.executeQueryExpectOne(query, aid, status);
        return Application.fromRow(result);
    }
    async updateApplicationStatus(student_id, proposal_id, status) {
        const query = `UPDATE application SET status = $3 WHERE student_id = $1 AND proposal_id = $2 RETURNING *`;
        const sid = getNum(student_id);
        const pid = getNum(proposal_id);
        const result = await this.db.executeQueryExpectOne(query, sid, pid, status);
        return Application.fromRow(result);
    }
}

export { Application, ApplicationTable };