'use strict';
import { psqlDriver } from '../dbdriver.js';

class Student {
    constructor(id, surname, name, gender, nationality, email, cod_degree, enrollment_year) {
        this.id = id;
        this.surname = surname;
        this.name = name;
        this.gender = gender;
        this.nationality = nationality;
        this.email = email;
        this.cod_degree = cod_degree;
        this.enrollment_year = enrollment_year;
    }
    toString() {
        return `Student (${this.id} - ${this.surname} - ${this.name} - ${this.gender} - ${this.nationality} - ${this.email} - ${this.cod_degree} - ${this.enrollment_year})`;
    }
    static fromRow(row) {
        return new Student(row.id, row.surname, row.name, row.gender, row.nationality, row.email, row.cod_degree, row.enrollment_year);
    }
}

class StudentTable {
    constructor(dbName) {
        this.dbName = dbName;
    }
    static async initialize() {
        const studentTable = new StudentTable('thesismanagement');
        studentTable.db = await psqlDriver.openDatabase('thesismanagement');
        return studentTable;
    }
    async getByAuthInfo(email, id) {
        const query = `SELECT * FROM student WHERE email = $1 AND id = $2`;
        const result = await this.db.executeQueryExpectAny(query, email, Number.parseInt(id));
        return result.map(Student.fromRow);
    }
    async getById(id) {
        const query = `SELECT * FROM student WHERE id = $1`;
        const result = await this.db.executeQueryExpectOne(query, Number.parseInt(id), `Student with id ${id} not found`);
        return Student.fromRow(result);
    }
}

export { Student, StudentTable };