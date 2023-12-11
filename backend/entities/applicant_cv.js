'use strict';
import { psqlDriver } from '../dbdriver.js';
import { getNum } from './utils.js';

class ApplicantCv {
    constructor(id, proposal_id, student_id, teacher_id, application_id, filepath) {
        this.id = id;
        this.proposal_id = proposal_id;
        this.student_id = student_id;
        this.teacher_id = teacher_id;
        this.application_id = application_id;
        this.filepath = filepath;
    }
    toString() {
        return `ApplicantCv (${this.id} - ${this.proposal_id} - ${this.student_id} - ${this.teacher_id} - ${this.application_id} - ${this.filepath})`;
    }
    static fromRow(row) {
        return new ApplicantCv(row.id, row.proposal_id, row.student_id, row.teacher_id, row.application_id, row.filepath);
    }
}

class ApplicantCvTable {
    constructor(dbName) {
        this.dbName = dbName;
    }
    static async initialize() {
        const teacherTable = new ApplicantCvTable('thesismanagement');
        teacherTable.db = await psqlDriver.openDatabase('thesismanagement');
        return teacherTable;
    }
    async addApplicantCv(proposal_id, student_id, teacher_id, application_id, filepath) {
        const query = `INSERT INTO applicant_cv (proposal_id, student_id, teacher_id, application_id, filepath) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const result = await this.db.executeQueryExpectOne(query, getNum(proposal_id), getNum(student_id), getNum(teacher_id), getNum(application_id), filepath, `Applicant CV failed to insert`);
        return ApplicantCv.fromRow(result);
    }
    async getByApplicationId(application_id) {
        const query = `SELECT * FROM applicant_cv WHERE application_id = $1`;
        const result = await this.db.executeQueryExpectAny(query, getNum(application_id));
        return result.map(ApplicantCv.fromRow);
    }
}

export { ApplicantCv, ApplicantCvTable };