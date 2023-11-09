'use strict';
import { psqlDriver } from '../dbdriver.js';

class ThesisProposal {
    constructor(id, title, teacher_id, supervisor, co_supervisor, keywords, type, groups, description, required_knowledge, notes, expiration, level, programmes) {
        this.id = id;
        this.title = title;
        this.teacher_id = teacher_id;
        this.supervisor = supervisor;
        this.co_supervisor = co_supervisor;
        this.keywords = keywords;
        this.type = type;
        this.groups = groups;
        this.description = description;
        this.required_knowledge = required_knowledge;
        this.notes = notes;
        this.expiration = expiration;
        this.level = level;
        this.programmes = programmes;
    }
    toString() {
        return `ThesisProposal (${this.id} - ${this.title} - ${this.teacher_id} - ${this.supervisor} - ${this.co_supervisor} - ${this.keywords} - ${this.type} - ${this.groups} - ${this.description} - ${this.required_knowledge} - ${this.notes} - ${this.expiration} - ${this.level} - ${this.programmes})`;
    }
    static fromRow(row) {
        return new ThesisProposal(row.id, row.title, row.teacher_id, row.supervisor, row.co_supervisor, row.keywords, row.type, row.groups, row.description, row.required_knowledge, row.notes, row.expiration, row.level, row.programmes);
    }
}

class ThesisProposalTable {
    constructor(dbName) {
        this.dbName = dbName;
    }
    static async initialize() {
        const thesisProposalTable = new ThesisProposalTable('thesismanagement');
        thesisProposalTable.db = await psqlDriver.openDatabase('thesismanagement');
        return thesisProposalTable;
    }

}

export { ThesisProposal, ThesisProposalTable };