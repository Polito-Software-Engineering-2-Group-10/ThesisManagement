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
    async getAll() {
        const query = `SELECT * FROM degree`;
        const result = await this.db.executeQueryExpectAny(query);
        return result.map(Degree.fromRow);
    }
    async getByCode(cod_degree) {
        const query = `SELECT * FROM degree WHERE cod_degree = $1`;
        const result = await this.db.executeQueryExpectOne(query, cod_degree, `Degree with cod_degree ${cod_degree} not found`);
        return Degree.fromRow(result);
    }
    async getByTitle(title_degree) {
        const query = `SELECT * FROM degree WHERE title_degree = $1`;
        const result = await this.db.executeQueryExpectAny(query, title_degree);
        return result.map(Degree.fromRow);
    }
    async getBachelorDegrees() {
        const query = `SELECT * FROM degree WHERE cod_degree LIKE 'L-%'`;
        const result = await this.db.executeQueryExpectAny(query);
        return result.map(Degree.fromRow);
    }
    async getMasterDegrees() {
        const query = `SELECT * FROM degree WHERE cod_degree LIKE 'LM-%'`;
        const result = await this.db.executeQueryExpectAny(query);
        return result.map(Degree.fromRow);
    }

}

export { Degree, DegreeTable };