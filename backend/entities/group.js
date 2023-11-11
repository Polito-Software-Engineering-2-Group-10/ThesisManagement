'use strict';
import { psqlDriver } from '../dbdriver.js';

class Group {
    constructor(cod_group, cod_department, name) {
        this.cod_group = cod_group;
        this.cod_department = cod_department;
        this.name = name;
    }
    toString() {
        return `Group (${this.cod_group} - ${this.cod_department} - ${this.name})`;
    }
    static fromRow(row) {
        return new Group(row.cod_group, row.cod_department, row.name);
    }
}

class GroupTable {
    constructor(dbName) {
        this.dbName = dbName;
    }
    static async initialize() {
        const groupTable = new GroupTable('thesismanagement');
        groupTable.db = await psqlDriver.openDatabase('thesismanagement');
        return groupTable;
    }
    async getAllGroups() {
        const query = `SELECT * FROM group`;
        const rows = await this.db.executeQueryExpectAny(query);
        return rows.map(Group.fromRow);
    }
    async getGroupByCode(cod_group) {
        const query = `SELECT * FROM group WHERE cod_group = $1`;
        const row = await this.db.executeQueryExpectOne(query, cod_group, `Group with cod_group ${cod_group} not found`);
        return Group.fromRow(row);
    }
    async getGroupByName(name) {
        const query = `SELECT * FROM group WHERE name = $1`;
        const rows = await this.db.executeQueryExpectAny(query, name);
        return rows.map(Group.fromRow);
    }
    async getGroupsByDepartment(cod_department) {
        const query = `SELECT * FROM group WHERE cod_department = $1`;
        const rows = await this.db.executeQueryExpectAny(query, cod_department);
        return rows.map(Group.fromRow);
    }
}

export { Group, GroupTable };