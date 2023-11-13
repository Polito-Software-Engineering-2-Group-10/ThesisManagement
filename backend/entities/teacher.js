'use strict';
import { psqlDriver } from '../dbdriver.js';
import { getNum } from './utils.js';

class Teacher {
    constructor(id, surname, name, email, cod_group, cod_department) {
        this.id = id;
        this.surname = surname;
        this.name = name;
        this.email = email;
        this.cod_group = cod_group;
        this.cod_department = cod_department;
    }
    toString() {
        return `Teacher (${this.id} - ${this.surname} - ${this.name} - ${this.email} - ${this.cod_group} - ${this.cod_department})`;
    }
    static fromRow(row) {
        return new Teacher(row.id, row.surname, row.name, row.email, row.cod_group, row.cod_department);
    }
}

class TeacherTable {
    constructor(dbName) {
        this.dbName = dbName;
    }
    static async initialize() {
        const teacherTable = new TeacherTable('thesismanagement');
        teacherTable.db = await psqlDriver.openDatabase('thesismanagement');
        return teacherTable;
    }
    async getAll() {
        const query = `SELECT * FROM teacher`;
        const result = await this.db.executeQueryExpectAny(query);
        return result.map(Teacher.fromRow);
    }
    async getByAuthInfo(email, id) {
        const query = `SELECT * FROM teacher WHERE email = $1 AND id = $2`;
        const result = await this.db.executeQueryExpectAny(query, email, getNum(id));
        return result.map(Teacher.fromRow);
    }
    async getById(id) {
        const query = `SELECT * FROM teacher WHERE id = $1`;
        const result = await this.db.executeQueryExpectOne(query, getNum(id), `Teacher with id ${id} not found`);
        return Teacher.fromRow(result);
    }
    async getDetailsById(id) {
        const query = `SELECT t.surname, t.name, t.email, g.name as group_name, d.full_name as department_name, d.nick_name as department_short_name FROM teacher as t, department as d, public.group as g WHERE t.id = $1 AND t.cod_group = g.cod_group AND t.cod_department = d.cod_department`;
        const result = await this.db.executeQueryExpectOne(query, getNum(id), `Teacher with id ${id} not found`);
        return result;
    }
    async getByEmail(email) {
        const query = `SELECT * FROM teacher WHERE email = $1`;
        const result = await this.db.executeQueryExpectAny(query, email);
        return result.map(Teacher.fromRow);
    }
    async getByNameSurname(name, surname) {
        const query = `SELECT * FROM teacher WHERE name = $1 AND surname = $2`;
        const result = await this.db.executeQueryExpectAny(query, name, surname);
        return result.map(Teacher.fromRow);
    }
    async getByGroup(cod_group) {
        const query = `SELECT * FROM teacher WHERE cod_group = $1`;
        const result = await this.db.executeQueryExpectAny(query, cod_group);
        return result.map(Teacher.fromRow);
    }
    async getByDepartment(cod_department) {
        const query = `SELECT * FROM teacher WHERE cod_department = $1`;
        const result = await this.db.executeQueryExpectAny(query, cod_department);
        return result.map(Teacher.fromRow);
    }
}

export { Teacher, TeacherTable };