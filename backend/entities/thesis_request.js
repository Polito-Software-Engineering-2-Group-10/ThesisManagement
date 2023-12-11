'use strict';
import { psqlDriver } from '../dbdriver.js';
import { getNum } from './utils.js';
import virtualClock from '../VirtualClock.js'

class ThesisRequest {
    constructor(id, student_id, proposal_id, title, description, supervisor, co_supervisor, apply_date, status_clerk, status_teacher, approval_date) {
        this.id = id;
        this.student_id = student_id;
        this.proposal_id = proposal_id;
        this.title = title;
        this.description = description;
        this.supervisor = supervisor;
        this.co_supervisor = co_supervisor;
        this.apply_date = apply_date;
        this.status_clerk = status_clerk;
        this.status_teacher = status_teacher;
        this.approval_date = approval_date;
    }
    toString() {
        return `ThesisRequest (${this.id} - ${this.student_id} - ${this.proposal_id} - ${this.title} - ${this.description} - ${this.supervisor} - ${this.co_supervisor} - ${this.apply_date} - ${this.status_clerk} - ${this.status_teacher} - ${this.approval_date})`;
    }
    static fromRow(row) {
        return new ThesisRequest(row.id, row.student_id, row.proposal_id, row.title, row.description, row.supervisor, row.co_supervisor, row.apply_date, row.status_clerk, row.status_teacher, row.approval_date);
    }
}

class ThesisRequestTable {
    constructor(dbName) {
        this.dbName = dbName;
    }
    static async initialize() {
        const thesisRequestTable = new ThesisRequestTable('thesismanagement');
        thesisRequestTable.db = await psqlDriver.openDatabase('thesismanagement');
        return thesisRequestTable;
    }

    async getAll() {
        const query = `SELECT * FROM thesis_request`;
        const result = await this.db.executeQueryExpectAny(query);
        return result.map(ThesisRequest.fromRow);
    }

    async getAllNotApprovedByClerkRequest() {
        const query= `SELECT * FROM thesis_request WHERE status_clerk IS null`;
        const result = await this.db.executeQueryExpectAny(query);
        return result.map(ThesisRequest.fromRow);
       // return result;
    }

    async getRequestDetailById(id) {
        const query= `SELECT * FROM thesis_request WHERE id=$1`;
        const result = await this.db.executeQueryExpectOne(query, getNum(id), `Request with id ${id} not found`);
        return result;
    }

    async getRequestDetailByFK(student_id, proposal_id) {
        const query = `SELECT * FROM thesis_request WHERE student_id = $1 AND proposal_id = $2`;
        const sid = getNum(student_id);
        const pid = getNum(proposal_id);
        const result = await this.db.executeQueryExpectOne(query, sid, pid, `Request with student_id ${student_id} and proposal_id ${proposal_id} not found`);
        return result;
    }

    async addThesisRequestNoDate(student_id, proposal_id, request) {
        const query = `INSERT INTO thesis_request (student_id, proposal_id, title, description, supervisor, co_supervisor, apply_date) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`;
        const sid = getNum(student_id);
        const pid = getNum(proposal_id);
        const result = await this.db.executeQueryExpectOne(query, sid, pid, request.title, request.description, request.supervisor, request.co_supervisor, `Failed to add ThesisRequest`);
        return ThesisRequest.fromRow(result);
    }

    async addThesisRequestWithDate(student_id, proposal_id, request) {
        const query = `INSERT INTO thesis_request (student_id, proposal_id, title, description, supervisor, co_supervisor, apply_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
        const sid = getNum(student_id);
        const pid = getNum(proposal_id);
        const result = await this.db.executeQueryExpectOne(query, sid, pid, request.title, request.description, request.supervisor, request.co_supervisor, request.apply_date, `Failed to add Request`);
        return ThesisRequest.fromRow(result);
    }

    async getCountByFK(student_id, proposal_id) {
        const query = `SELECT COUNT(*) as count FROM thesis_request WHERE student_id = $1 AND proposal_id = $2`;
        const sid = getNum(student_id);
        const pid = getNum(proposal_id);
        const result = await this.db.executeQueryExpectOne(query, sid, pid, `Request with student_id ${student_id} and proposal_id ${proposal_id} not found`);
        return result;
    }

    async updateRequestClerkStatusById(id, status) {
        const query = `UPDATE thesis_request SET status_clerk = $2 WHERE id = $1 RETURNING *`;
        const aid = getNum(id);
        const result = await this.db.executeQueryExpectOne(query, aid, status, `Request with id ${id} not found`);
        return ThesisRequest.fromRow(result);
    }

    async updateRequestClerkStatusByFK(student_id, proposal_id, status) {
        const query = `UPDATE thesis_request SET status_clerk = $3 WHERE student_id = $1 AND proposal_id = $2 RETURNING *`;
        const sid = getNum(student_id);
        const pid = getNum(proposal_id);
        const result = await this.db.executeQueryExpectOne(query, sid, pid, status, `Request with student_id ${student_id} and proposal_id ${proposal_id} not found`);
        return ThesisRequest.fromRow(result);
    }

}



export { ThesisRequest, ThesisRequestTable };
