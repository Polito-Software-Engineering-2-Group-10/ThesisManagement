'use strict';
import { psqlDriver } from '../dbdriver.js';
import { getNum } from './utils.js';

class ThesisProposal {
    constructor(id, title, teacher_id, supervisor, co_supervisor, keywords, type, groups, description, required_knowledge, notes, expiration, level, programmes, archived) {
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
        this.archived = archived;
    }
    toString() {
        return `ThesisProposal (${this.id} - ${this.title} - ${this.teacher_id} - ${this.supervisor} - ${this.co_supervisor} - ${this.keywords} - ${this.type} - ${this.groups} - ${this.description} - ${this.required_knowledge} - ${this.notes} - ${this.expiration} - ${this.level} - ${this.programmes} - ${this.archived})`;
    }
    static fromRow(row) {
        return new ThesisProposal(row.id, row.title, row.teacher_id, row.supervisor, row.co_supervisor, row.keywords, row.type, row.groups, row.description, row.required_knowledge, row.notes, row.expiration, row.level, row.programmes, row.archived);
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
    
    async getAll(include_expired) {
        if (typeof include_expired === 'undefined') {
            include_expired = true;
        }
        if (include_expired) {
            const query = `SELECT * FROM thesis_proposal`;
            const result = await this.db.executeQueryExpectAny(query);
            return result.map(ThesisProposal.fromRow);
        } else {
            const query = `SELECT * FROM thesis_proposal WHERE expiration > NOW()`;
            const result = await this.db.executeQueryExpectAny(query);
            return result.map(ThesisProposal.fromRow);
        }
    }

    async getById(id, include_expired) {
        if (typeof include_expired === 'undefined') {
            include_expired = true;
        }
        if (include_expired) {
            const query = `SELECT * FROM thesis_proposal WHERE id = $1`;
            const result = await this.db.executeQueryExpectOne(query, getNum(id), `ThesisProposal with id ${id} not found`);
            return ThesisProposal.fromRow(result);
        } else {
            const query = `SELECT * FROM thesis_proposal WHERE id = $1 AND expiration > NOW()`;
            const result = await this.db.executeQueryExpectOne(query, getNum(id), `ThesisProposal with id ${id} not found`);
            return ThesisProposal.fromRow(result);
        }
    }
    async getByTeacherId(teacher_id, include_expired) {
        if (typeof include_expired === 'undefined') {
            include_expired = true;
        }
        if (include_expired) {
            const query = `SELECT * FROM thesis_proposal WHERE teacher_id = $1`;
            const result = await this.db.executeQueryExpectAny(query, getNum(teacher_id));
            return result.map(ThesisProposal.fromRow);
        } else {
            const query = `SELECT * FROM thesis_proposal WHERE teacher_id = $1 AND expiration > NOW()`;
            const result = await this.db.executeQueryExpectAny(query, getNum(teacher_id));
            return result.map(ThesisProposal.fromRow);
        }
    }
    async getByKeyword(keyword, include_expired) {
        if (typeof include_expired === 'undefined') {
            include_expired = true;
        }
        if (include_expired) {
            const query = `SELECT thesis_proposal.* FROM thesis_proposal, unnest(keywords) ks WHERE lower(ks) LIKE lower($1)`;
            const result = await this.db.executeQueryExpectAny(query, `%${keyword}%`);
            return result.map(ThesisProposal.fromRow);
        } else {
            const query = `SELECT thesis_proposal.* FROM thesis_proposal, unnest(keywords) ks WHERE lower(ks) LIKE lower($1) AND expiration > NOW()`;
            const result = await this.db.executeQueryExpectAny(query, `%${keyword}%`);
            return result.map(ThesisProposal.fromRow);
        }
    }
    async getByDescription(description, include_expired) {
        if (typeof include_expired === 'undefined') {
            include_expired = true;
        }
        if (include_expired) {
            const query = `SELECT thesis_proposal.* FROM thesis_proposal WHERE lower(description) LIKE lower($1)`;
            const result = await this.db.executeQueryExpectAny(query, `%${description}%`);
            return result.map(ThesisProposal.fromRow);
        } else {
            const query = `SELECT thesis_proposal.* FROM thesis_proposal WHERE lower(description) LIKE lower($1) AND expiration > NOW()`;
            const result = await this.db.executeQueryExpectAny(query, `%${description}%`);
            return result.map(ThesisProposal.fromRow);
        }
    }
    async getByType(type, include_expired) {
        if (typeof include_expired === 'undefined') {
            include_expired = true;
        }
        const ltype = type.toLowerCase();
        if (ltype !== 'bachelor thesis' && ltype !== 'master thesis') {
            throw new Error(`Invalid type ${type}`);
        }
        if (include_expired) {
            const query = `SELECT * FROM thesis_proposal WHERE lower(type) = $1`;
            const result = await this.db.executeQueryExpectAny(query, ltype);
            return result.map(ThesisProposal.fromRow);
        } else {
            const query = `SELECT * FROM thesis_proposal WHERE lower(type) = $1 AND expiration > NOW()`;
            const result = await this.db.executeQueryExpectAny(query, ltype);
            return result.map(ThesisProposal.fromRow);
        }
    }
    async getByGroup(group, include_expired) {
        if (typeof include_expired === 'undefined') {
            include_expired = true;
        }
        if (include_expired) {
            const query = `SELECT * FROM thesis_proposal WHERE $1 = ANY(groups)`;
            const result = await this.db.executeQueryExpectAny(query, group);
            return result.map(ThesisProposal.fromRow);
        } else {
            const query = `SELECT * FROM thesis_proposal WHERE $1 = ANY(groups) AND expiration > NOW()`;
            const result = await this.db.executeQueryExpectAny(query, group);
            return result.map(ThesisProposal.fromRow);
        }
    }
    async getByProgramme(programme, include_expired) {
        if (typeof include_expired === 'undefined') {
            include_expired = true;
        }
        if (include_expired) {
            const query = `SELECT * FROM thesis_proposal WHERE $1 = ANY(programmes)`;
            const result = await this.db.executeQueryExpectAny(query, programme);
            return result.map(ThesisProposal.fromRow);
        } else {
            const query = `SELECT * FROM thesis_proposal WHERE $1 = ANY(programmes) AND expiration > NOW()`;
            const result = await this.db.executeQueryExpectAny(query, programme);
            return result.map(ThesisProposal.fromRow);
        }
    }
    async getNotExpired() {
        const query = `SELECT * FROM thesis_proposal WHERE expiration > NOW()`;
        const result = await this.db.executeQueryExpectAny(query);
        return result.map(ThesisProposal.fromRow);
    }
    async getNotExpiredFromDate(date) {
        const query = `SELECT * FROM thesis_proposal WHERE expiration > $1`;
        const result = await this.db.executeQueryExpectAny(query, date);
        return result.map(ThesisProposal.fromRow);
    }
    async getActiveProposals() {
        const query = `SELECT * FROM thesis_proposal WHERE archived = false`;
        const result = await this.db.executeQueryExpectAny(query);
        return result.map(ThesisProposal.fromRow);
    }
    //OLD: async addThesisProposal(title, teacher_id, supervisor, co_supervisor, keywords, type, groups, description, required_knowledge, notes, expiration, level, programmes)
    async addThesisProposal(proposal) {
        const query = `INSERT INTO thesis_proposal (title, teacher_id, supervisor, co_supervisor, keywords, type, groups, description, required_knowledge, notes, expiration, level, programmes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`;
        const result = await this.db.executeQueryExpectOne(query, proposal.title, getNum(proposal.teacher_id), proposal.supervisor, proposal.co_supervisor, proposal.keywords, proposal.type, proposal.groups, proposal.description, proposal.required_knowledge, proposal.notes, proposal.expiration, proposal.level, proposal.programmes, `Failed to add ThesisProposal`);
        return ThesisProposal.fromRow(result);
    }
    async archiveThesisProposal(id) {
        const query = `UPDATE thesis_proposal SET archived = true WHERE id = $1 RETURNING *`;
        const result = await this.db.executeQueryExpectOne(query, getNum(id), `ThesisProposal with id ${id} not found`);
        return ThesisProposal.fromRow(result);
    }
}

export { ThesisProposal, ThesisProposalTable };