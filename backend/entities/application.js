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

    async getTeacherAppDetailById(id) {
        const query= `SELECT student.*, degree.title_degree,thesis_proposal.title,application.apply_date from student, degree, application,thesis_proposal 
        where student.cod_degree=degree.cod_degree 
        and student.id=application.student_id 
        and application.id=$1
        and application.proposal_id=thesis_proposal.id`;
        /// I use executeQueryExpectOne because I expect only one row to be returned if we get an application by id (the id is the primary key)
        const result = await this.db.executeQueryExpectOne(query, getNum(id), `Application with id ${id} not found`);
        return result;
    }
    async getTeacherAppStatusById(id) {
        const query= `SELECT application.status from application
        where application.id=$1`;
        const result = await this.db.executeQueryExpectOne(query, getNum(id), `Application with id ${id} not found`);
        return result;
    }
    async getByStudentId(student_id) {
        const query = `SELECT application.*, tp.title as thesis_title, teacher.name as teacher_name, teacher.surname as teacher_surname, teacher.email as teacher_email FROM application, thesis_proposal as tp, teacher 
            WHERE student_id = $1 AND application.proposal_id = tp.id AND tp.teacher_id = teacher.id ORDER BY apply_date DESC`;
        const id = getNum(student_id);
        const result = await this.db.executeQueryExpectAny(query, id);
        return result;
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
    async getByTeacherId2(teacher_id) {
        const query = `SELECT application.*, 
        thesis_proposal.id AS proposal_id, 
        thesis_proposal.title AS thesis_title, 
        student.id as student_id,
        student.name as student_name, 
        student.surname as student_surname, 
        student.gender as student_gender, 
        student.nationality as student_nationality,
        student.email as student_email,
        student.cod_degree as student_degree,
        student.enrollment_year as student_ey
        FROM application, thesis_proposal, student WHERE 
                                proposal_id IN (select id FROM thesis_proposal WHERE teacher_id = $1)
                                AND thesis_proposal.id = application.proposal_id AND application.student_id=student.id 
                                ORDER BY application.apply_date, status DESC, application.id;`;
        const id = getNum(teacher_id);
        const result = await this.db.executeQueryExpectAny(query, id);
        //return result.map((r) => { return { ...Application.fromRow(r), proposal_id: r.proposal_id, thesis_title: r.thesis_title } });
        return result;
    }
    async addApplication(student_id, proposal_id) {
        const query = `INSERT INTO application (student_id, proposal_id, apply_date) VALUES ($1, $2, NOW()) RETURNING *`;
        const sid = getNum(student_id);
        const pid = getNum(proposal_id);
        const result = await this.db.executeQueryExpectOne(query, sid, pid, `Application with student_id ${student_id} and proposal_id ${proposal_id} already exists`);
        return Application.fromRow(result);
    }
    async addApplicationWithDate(student_id, proposal_id, apply_date) {
        const query = `INSERT INTO application (student_id, proposal_id, apply_date) VALUES ($1, $2, $3) RETURNING *`;
        const sid = getNum(student_id);
        const pid = getNum(proposal_id);
        const result = await this.db.executeQueryExpectOne(query, sid, pid, apply_date, `Application with student_id ${student_id} and proposal_id ${proposal_id} already exists`);
        return Application.fromRow(result);
    }
    async updateApplicationStatusById(id, status) {
        const query = `UPDATE application SET status = $2 WHERE id = $1 RETURNING *`;
        const aid = getNum(id);
        const result = await this.db.executeQueryExpectOne(query, aid, status, `Application with id ${id} not found`);
        let student_id = result.student_id;
        let proposal_id = result.proposal_id;
        if (status === true) {
            // When professor accepts application, all other pending applications for that proposal (and of the student) are automatically rejected
            const query2 = `UPDATE application SET status = false WHERE (proposal_id = $1 OR student_id = $2) AND id != $3`;
            await this.db.executeQueryExpectAny(query2, proposal_id, student_id, aid);
            // Accepted proposals are automatically archived
            const query3 = `UPDATE thesis_proposal SET archived = true WHERE id = $1`;
            await this.db.executeQueryExpectAny(query3, proposal_id);
        }
        return Application.fromRow(result);
    }
    async updateApplicationStatus(student_id, proposal_id, status) {
        const query = `UPDATE application SET status = $3 WHERE student_id = $1 AND proposal_id = $2 RETURNING *`;
        const sid = getNum(student_id);
        const pid = getNum(proposal_id);
        const result = await this.db.executeQueryExpectOne(query, sid, pid, status, `Application with student_id ${student_id} and proposal_id ${proposal_id} not found`);
        return Application.fromRow(result);
    }

    async countApplicationForAProposal(application_id){
        const query =`SELECT COUNT(*) FROM application WHERE proposal_id=$1 and status=true`;
        const aid = getNum(application_id);
        const result=await this.db.executeQueryExpectAny(query, application_id);
        return result[0].count;
    }
}

export { Application, ApplicationTable };