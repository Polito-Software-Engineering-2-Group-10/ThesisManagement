'use strict';
import { psqlDriver } from '../dbdriver.js';

class Career {
    constructor(id, cod_course, title_course, cfu, grade, exam_date) {
        this.id = id;
        this.cod_course = cod_course;
        this.title_course = title_course;
        this.cfu = cfu;
        this.grade = grade;
        this.exam_date = exam_date;
    }
    toString() {
        return `Career (${this.id} - ${this.cod_course} - ${this.title_course} - ${this.cfu} - ${this.grade} - ${this.exam_date})`;
    }
    static fromRow(row) {
        return new Career(row.id, row.cod_course, row.title_course, row.cfu, row.grade, row.exam_date);
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

}

export { Career, CareerTable };