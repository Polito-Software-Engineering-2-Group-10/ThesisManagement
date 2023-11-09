'use strict';
import { psqlDriver } from '../dbdriver.js';

class Department {
    constructor(cod_department, nick_name, full_name) {
        this.cod_department = cod_department;
        this.nick_name = nick_name;
        this.full_name = full_name;
    }
    toString() {
        return `Department (${this.cod_department} - ${this.nick_name} - ${this.full_name})`;
    }
    static fromRow(row) {
        return new Department(row.cod_department, row.nick_name, row.full_name);
    }
}

class DepartmentTable {
    constructor(dbName) {
        this.dbName = dbName;
    }
    static async initialize() {
        const departmentTable = new DepartmentTable('thesismanagement');
        departmentTable.db = await psqlDriver.openDatabase('thesismanagement');
        return departmentTable;
    }
    async getAllDepartments() {
        const query = `SELECT * FROM department`;
        const rows = await this.db.executeQueryExpectAny(query);
        return rows.map(Department.fromRow);
    }
    async getDepartmentByCode(cod_department) {
        const query = `SELECT * FROM department WHERE cod_department = $1`;
        const row = await this.db.executeQueryExpectOne(query, cod_department, `Department with cod_department ${cod_department} not found`);
        return Department.fromRow(row);
    }
    async getDepartmentByNickname(nick_name) {
        const query = `SELECT * FROM department WHERE nick_name = $1`;
        const rows = await this.db.executeQueryExpectAny(query, nick_name);
        return rows.map(Department.fromRow);
    }
    async getDepartmentByFullName(full_name) {
        const query = `SELECT * FROM department WHERE full_name = $1`;
        const rows = await this.db.executeQueryExpectAny(query, full_name);
        return rows.map(Department.fromRow);
    }
}

export { Department, DepartmentTable };