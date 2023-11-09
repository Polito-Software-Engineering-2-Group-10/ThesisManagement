'use strict';
import { psqlDriver } from '../dbdriver.js';

class Degree {
    constructor(cod_degree, title_degree) {
        this.cod_degree = cod_degree;
        this.title_degree = title_degree;
    }
    toString() {
        return `Degree (${this.cod_degree} - ${this.title_degree})`;
    }
    static fromRow(row) {
        return new Degree(row.cod_degree, row.title_degree);
    }
}

class DegreeTable {
    constructor(dbName) {
        this.dbName = dbName;
    }
    static async initialize() {
        const degreeTable = new DegreeTable('thesismanagement');
        degreeTable.db = await psqlDriver.openDatabase('thesismanagement');
        return degreeTable;
    }

}

export { Degree, DegreeTable };