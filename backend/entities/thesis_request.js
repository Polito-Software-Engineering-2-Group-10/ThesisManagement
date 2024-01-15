'use strict';
import { psqlDriver } from '../dbdriver.js';
import { getNum } from './utils.js';
import virtualClock from '../VirtualClock.js'

class ThesisRequest {
    constructor(id, student_id, proposal_id, title, description, supervisor, co_supervisor, apply_date, status_clerk, status_teacher, comment, approval_date) {
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
        this.comment = comment;
        this.approval_date = approval_date;
    }
    toString() {
        return `ThesisRequest (${this.id} - ${this.student_id} - ${this.proposal_id} - ${this.title} - ${this.description} - ${this.supervisor} - ${this.co_supervisor} - ${this.apply_date} - ${this.status_clerk} - ${this.status_teacher} - ${this.comment} - ${this.approval_date})`;
    }
    static fromRow(row) {
        return new ThesisRequest(row.id, row.student_id, row.proposal_id, row.title, row.description, row.supervisor, row.co_supervisor, row.apply_date, row.status_clerk, row.status_teacher, row.comment, row.approval_date);
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

    async getAllNotApprovedRequestByTeacher(id) {
        const query = `SELECT tr.* FROM thesis_request tr, thesis_proposal tp WHERE tr.proposal_id = tp.id AND tp.teacher_id = $1 
        AND (status_clerk IS true AND (status_teacher IS null OR status_teacher=0))`;
            const result = await this.db.executeQueryExpectAny(query, getNum(id));
        return result.map(ThesisRequest.fromRow);
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

    async updateThesisRequest(student_id, request_id, new_request) {
        // set comment to NULL when updating request because this means that allegedly the student has satisfied the teacher's comment
        const PENDING_STATUS = 0; // if this is changed, also change the corresponding value in the frontend
        const CHANGE_REQUESTED = 2;
        /// ASSUMED STATUSES: 0 = pending, 1 = approved, 2 = request for change, 3 = rejected
        const query = `UPDATE thesis_request SET title = $3, description = $4, co_supervisor = $5, comment = NULL, status_teacher = ${PENDING_STATUS} WHERE student_id = $1 AND id = $2 AND status_teacher = ${CHANGE_REQUESTED} RETURNING *`;
        const sid = getNum(student_id);
        const rid = getNum(request_id);
        const result = await this.db.executeQueryExpectOne(query, sid, rid, new_request.title, new_request.description, new_request.co_supervisor, `No request found to be updated`);
        return ThesisRequest.fromRow(result);
    }

    async getCountByFK(student_id, proposal_id) {
        const query = `SELECT COUNT(*) as count FROM thesis_request WHERE student_id = $1 AND proposal_id = $2`;
        const sid = getNum(student_id);
        const pid = getNum(proposal_id);
        const result = await this.db.executeQueryExpectOne(query, sid, pid, `Request with student_id ${student_id} and proposal_id ${proposal_id} not found`);
        return result;
    }

     //Function for if Student can not request two different thesis at the same time
     async getCountByStudentID(student_id) {
        const query = `SELECT COUNT(*) as count FROM thesis_request WHERE student_id = $1`;
        const sid = getNum(student_id);
        const result = await this.db.executeQueryExpectOne(query, sid, `Request with student_id ${student_id} not found`);
        return result;
    }

    //check amount of failed requests
    async getCountFailedRequestByStudentID(student_id) {
        const query = `SELECT COUNT(*) as count FROM thesis_request WHERE student_id = $1 AND (status_clerk IS false OR (status_clerk IS true AND status_teacher =3))`;
        const sid = getNum(student_id);
        const result = await this.db.executeQueryExpectOne(query, sid, `Request with student_id ${student_id} not found`);
        return result;
    }

    //End

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

    /*async updateRequestTeacherStatusById(id, status, comment) {
        const query = `UPDATE thesis_request SET status_teacher = $2, comment = $3 WHERE id = $1 RETURNING *`;
        const aid = getNum(id);
        const result = await this.db.executeQueryExpectOne(query, aid, status, comment, `Request with id ${id} not found`);
        return ThesisRequest.fromRow(result);
    }*/
    async updateRequestTeacherStatusById(id, status) {
        const query = `UPDATE thesis_request SET status_teacher = $2 WHERE id = $1 RETURNING *`;
        const aid = getNum(id);
        const result = await this.db.executeQueryExpectOne(query, aid, status, `Request with id ${id} not found`);
        return ThesisRequest.fromRow(result);
    }

    async updateRequestCommentById(id, comment) {
        const query = `UPDATE thesis_request SET comment = $2 WHERE id = $1 RETURNING *`;
        const aid = getNum(id);
        const result = await this.db.executeQueryExpectOne(query, aid, comment, `Request with id ${id} not found`);
        return ThesisRequest.fromRow(result);
    }

    async getAllRequestByStudent(student_id) {
        const query = `SELECT * FROM thesis_request WHERE student_id = $1`;
        const sid = getNum(student_id);
        const result = await this.db.executeQueryExpectAny(query, sid);
        return result.map(ThesisRequest.fromRow);
    }

}



export { ThesisRequest, ThesisRequestTable };
