'use strict';
import { psqlDriver } from '../dbdriver.js';

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
    async getByAuthInfo(email, id) {
        const query = `SELECT * FROM teacher WHERE email = $1 AND id = $2`;
        const result = await this.db.executeQueryExpectAny(query, email, Number.parseInt(id));
        return result.map(Teacher.fromRow);
    }
    async getById(id) {
        const query = `SELECT * FROM teacher WHERE id = $1`;
        const result = await this.db.executeQueryExpectOne(query, Number.parseInt(id), `Teacher with id ${id} not found`);
        return Teacher.fromRow(result);
    }
}

export { Teacher, TeacherTable };