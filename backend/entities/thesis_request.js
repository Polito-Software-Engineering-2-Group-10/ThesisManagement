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

}



export { ThesisRequest, ThesisRequestTable };
