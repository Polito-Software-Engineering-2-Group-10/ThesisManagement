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

}

export { Group, GroupTable };