'use strict';
import { psqlDriver } from '../dbdriver.js';

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

}

export { Application, ApplicationTable };