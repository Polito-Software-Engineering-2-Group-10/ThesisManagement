'use strict';
import { psqlDriver } from '../dbdriver.js';
import { getNum } from './utils.js';

class Career {
    constructor(id, cod_course, title_course, cfu, grade, date) {
        this.id = id;
        this.cod_course = cod_course;
        this.title_course = title_course;
        this.cfu = cfu;
        this.grade = grade;
        this.date = date;
    }
    toString() {
        return `Career (${this.id} - ${this.cod_course} - ${this.title_course} - ${this.cfu} - ${this.grade} - ${this.date})`;
    }
    static fromRow(row) {
        return new Career(row.id, row.cod_course, row.title_course, row.cfu, row.grade, row.date);
    }
}

class CareerTable {
    constructor(dbName) {
        this.dbName = dbName;
    }
    static async initialize() {
        const careerTable = new CareerTable('thesismanagement');
        careerTable.db = await psqlDriver.openDatabase('thesismanagement');
        return careerTable;
    }
    async getByStudentId(id) {
        const query = `SELECT * FROM career WHERE id = $1`;
        const result = await this.db.executeQueryExpectAny(query, getNum(id));
        return result.map(Career.fromRow);
    }
    async getByCourseCode(cod_course) {
        const query = `SELECT * FROM career WHERE cod_course = $1`;
        const result = await this.db.executeQueryExpectAny(query, cod_course);
        return result.map(Career.fromRow);
    }
    async getByPk(id, cod_course) {
        const query = `SELECT * FROM career WHERE id = $1 AND cod_course = $2`;
        const result = await this.db.executeQueryExpectOne(query, getNum(id), cod_course, `Career with id ${id} and cod_course ${cod_course} not found`);
        return result.map(Career.fromRow);
    }

}

export { Career, CareerTable };