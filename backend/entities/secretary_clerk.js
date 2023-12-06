'use strict';
import { psqlDriver } from '../dbdriver.js';
import { getNum } from './utils.js';

class SecretaryClerk {
    constructor(id, surname, name, email) {
        this.id = id;
        this.surname = surname;
        this.name = name;
        this.email = email;
    }
    toString() {
        return `SecretaryClerk (${this.id} - ${this.surname} - ${this.name} - ${this.email})`;
    }
    static fromRow(row) {
        return new SecretaryClerk(row.id, row.surname, row.name, row.email);
    }
}

class SecretaryClerkTable {
    constructor(dbName) {
        this.dbName = dbName;
    }
    static async initialize() {
        const teacherTable = new SecretaryClerkTable('thesismanagement');
        teacherTable.db = await psqlDriver.openDatabase('thesismanagement');
        return teacherTable;
    }
    async getAll() {
        const query = `SELECT * FROM secretary_clerk ORDER BY surname ASC, name ASC`;
        const result = await this.db.executeQueryExpectAny(query);
        return result.map(SecretaryClerk.fromRow);
    }
    async getByAuthInfo(email, id) {
        const query = `SELECT * FROM secretary_clerk WHERE email = $1 AND id = $2`;
        const result = await this.db.executeQueryExpectAny(query, email, getNum(id));
        return result.map(SecretaryClerk.fromRow);
    }
    async getById(id) {
        const query = `SELECT * FROM secretary_clerk WHERE id = $1`;
        const result = await this.db.executeQueryExpectOne(query, getNum(id), `Secretary clerk with id ${id} not found`);
        return SecretaryClerk.fromRow(result);
    }
    async getByEmail(email) {
        const query = `SELECT * FROM secretary_clerk WHERE email = $1`;
        const result = await this.db.executeQueryExpectAny(query, email);
        return result.map(SecretaryClerk.fromRow);
    }
    async getByNameSurname(name, surname) {
        const query = `SELECT * FROM secretary_clerk WHERE name = $1 AND surname = $2`;
        const result = await this.db.executeQueryExpectAny(query, name, surname);
        return result.map(SecretaryClerk.fromRow);
    }
}

export { SecretaryClerk, SecretaryClerkTable };