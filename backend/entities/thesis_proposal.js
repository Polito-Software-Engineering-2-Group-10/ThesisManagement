'use strict';
import { psqlDriver } from '../dbdriver.js';
import { getNum } from './utils.js';
import virtualClock from '../VirtualClock.js'

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

    /*async getAll(include_expired) {
        if (typeof include_expired === 'undefined') {
            include_expired = true;
        }

        
        if (include_expired) {
            const query = `SELECT tp.*, t.name as teacher_name, t.surname as teacher_surname FROM thesis_proposal as tp, teacher as t WHERE tp.teacher_id = t.id
            ORDER BY tp.level, tp.expiration ASC, tp.type ASC`;
            
            const result = await this.db.executeQueryExpectAny(query);
            return result;
        } else {
            const query = `SELECT tp.*, t.name as teacher_name, t.surname as teacher_surname FROM thesis_proposal as tp, teacher as t WHERE tp.teacher_id = t.id and expiration > NOW()
            ORDER BY tp.level, tp.expiration ASC, tp.type ASC`;
            const result = await this.db.executeQueryExpectAny(query);
            return result;
        }
    }*/

    async getAll() {
        const current_date_string = virtualClock.getSqlDate();
        const active = await this.db.executeQueryExpectAny(
            `SELECT tp.*, t.name as teacher_name, t.surname as teacher_surname FROM thesis_proposal as tp, teacher as t WHERE tp.teacher_id = t.id
            AND tp.archived = false AND tp.expiration > $1
            ORDER BY tp.level, tp.expiration ASC, tp.type ASC`,
            current_date_string
        )
        return active.map(ThesisProposal.fromRow);
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
            const current_date_string = virtualClock.getSqlDate();
            const query = `SELECT * FROM thesis_proposal WHERE id = $1 AND expiration > $2`;
            const result = await this.db.executeQueryExpectOne(query, getNum(id), current_date_string, `ThesisProposal with id ${id} not found`);
            return ThesisProposal.fromRow(result);
        }
    }
    async getByTeacherId(teacher_id, include_expired) {
        if (typeof include_expired === 'undefined') {
            include_expired = true;
        }
        const current_date_string = virtualClock.getSqlDate();
        const archived = await this.db.executeQueryExpectAny(
            `SELECT * FROM thesis_proposal WHERE teacher_id = $1 AND (archived = true OR expiration < $2)`,
            getNum(teacher_id), current_date_string
        )
        
        const active = await this.db.executeQueryExpectAny(
            `SELECT * FROM thesis_proposal WHERE teacher_id = $1 AND archived = false AND expiration > $2`
            , getNum(teacher_id), current_date_string
        )
        return {
            archived: archived.map(ThesisProposal.fromRow),
            active: active.map(ThesisProposal.fromRow)
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
            const current_date_string = virtualClock.getSqlDate();
            const query = `SELECT thesis_proposal.* FROM thesis_proposal, unnest(keywords) ks WHERE lower(ks) LIKE lower($1) AND expiration > $2`;
            const result = await this.db.executeQueryExpectAny(query, `%${keyword}%`, current_date_string);
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
            const current_date_string = virtualClock.getSqlDate();
            const query = `SELECT thesis_proposal.* FROM thesis_proposal WHERE lower(description) LIKE lower($1) AND expiration > $2`;
            const result = await this.db.executeQueryExpectAny(query, `%${description}%`, current_date_string);
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
            const current_date_string = virtualClock.getSqlDate();
            const query = `SELECT * FROM thesis_proposal WHERE lower(type) = $1 AND expiration > $2`;
            const result = await this.db.executeQueryExpectAny(query, ltype, current_date_string);
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
            const current_date_string = virtualClock.getSqlDate();
            const query = `SELECT * FROM thesis_proposal WHERE $1 = ANY(groups) AND expiration > $2`;
            const result = await this.db.executeQueryExpectAny(query, group, current_date_string);
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
            const current_date_string = virtualClock.getSqlDate();
            const query = `SELECT * FROM thesis_proposal WHERE $1 = ANY(programmes) AND expiration > $2`;
            const result = await this.db.executeQueryExpectAny(query, programme, current_date_string);
            return result.map(ThesisProposal.fromRow);
        }
    }
    async getNotExpired() {
        const current_date_string = virtualClock.getSqlDate();
        const query = `SELECT * FROM thesis_proposal WHERE expiration > $1`;
        const result = await this.db.executeQueryExpectAny(query, current_date_string);
        return result.map(ThesisProposal.fromRow);
    }
    async getNotExpiredFromDate(date) {
        const query = `SELECT * FROM thesis_proposal WHERE expiration > $1`;
        const result = await this.db.executeQueryExpectAny(query, date);
        return result.map(ThesisProposal.fromRow);
    }
    async getActiveProposals() {
        const current_date_string = virtualClock.getSqlDate();
        const query = `SELECT * FROM thesis_proposal WHERE archived = false AND expiration > $1`;
        const result = await this.db.executeQueryExpectAny(query, current_date_string);
        return result.map(ThesisProposal.fromRow);
    }
    async getActiveProposalsStudent() {
        const current_date_string = virtualClock.getSqlDate();
        const query = `SELECT thesis_proposal.*, teacher.name as teacher_name, teacher.surname as teacher_surname
        FROM thesis_proposal,teacher WHERE thesis_proposal.teacher_id=teacher.id and archived = false 
        and thesis_proposal.expiration > $1`;
        const result = await this.db.executeQueryExpectAny(query, current_date_string);
        //return result.map(ThesisProposal.fromRow);
        return result;
    }
    //OLD: async addThesisProposal(title, teacher_id, supervisor, co_supervisor, keywords, type, groups, description, required_knowledge, notes, expiration, level, programmes)
    async addThesisProposal(proposal) {
        const query = `INSERT INTO thesis_proposal (title, teacher_id, supervisor, co_supervisor, keywords, type, groups, description, required_knowledge, notes, expiration, level, programmes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`;
        const result = await this.db.executeQueryExpectOne(query, proposal.title, getNum(proposal.teacher_id), proposal.supervisor, proposal.co_supervisor, proposal.keywords, proposal.type, proposal.groups, proposal.description, proposal.required_knowledge, proposal.notes, proposal.expiration, proposal.level, proposal.programmes, `Failed to add ThesisProposal`);
        return ThesisProposal.fromRow(result);
    }
    async archiveExpiredProposal() {
        const current_date_string = virtualClock.getSqlDate();
        const query = `UPDATE thesis_proposal SET archived = true WHERE archived = false AND expiration < $1`;
        const result = await this.db.executeQueryExpectAny(query, current_date_string);
        return ThesisProposal.fromRow(result);
    }
    async archiveThesisProposal(id) {
        const query = `UPDATE thesis_proposal SET archived = true WHERE id = $1 RETURNING *`;
        const result = await this.db.executeQueryExpectOne(query, getNum(id), `ThesisProposal with id ${id} not found`);
        return ThesisProposal.fromRow(result);
    }
    async getTypes() {
        const query = `SELECT DISTINCT type FROM thesis_proposal ORDER BY type ASC`;
        const result = await this.db.executeQueryExpectAny(query);
        return result.map(row => row.type);
    }
    async getKeywords() {
        const query = `SELECT DISTINCT unnest(keywords) as keyword FROM thesis_proposal ORDER BY keyword ASC`;
        const result = await this.db.executeQueryExpectAny(query);
        return result.map(row => row.keyword);
    }
    async getGroups() {
        const query = `SELECT DISTINCT unnest(groups) as group FROM thesis_proposal ORDER BY "group" ASC`;
        const result = await this.db.executeQueryExpectAny(query);
        return result.map(row => row.group);
    }
    async getFilteredProposals(filterObject) {
        let query = `SELECT thesis_proposal.*, teacher.name as teacher_name, teacher.surname as teacher_surname FROM thesis_proposal, teacher WHERE thesis_proposal.teacher_id = teacher.id`;
        let params = [];
        let i = 1;
        if (filterObject.title !== null) {
            query += ` AND title ILIKE $${i}`;
            params.push(`%${filterObject.title}%`);
            i++;
        }
        if (filterObject.teacher_id !== null) {
            query += ` AND teacher_id = $${i}`;
            params.push(getNum(filterObject.teacher_id));
            i++;
        }
        if (filterObject.date !== null) {
            query += ` AND expiration > $${i}`;
            params.push(filterObject.date);
            i++;
        }
        if (filterObject.type !== null && filterObject.type.length > 0) {
            query += ` AND type ILIKE ANY($${i}) `;
            params.push(filterObject.type);
            i++;
        }
        if (filterObject.keywords !== null && filterObject.keywords.length > 0) {
            query += ` AND NOT EXISTS (
SELECT FROM unnest($${i}::text[]) as p(pattern)
WHERE NOT EXISTS (
    SELECT FROM unnest(thesis_proposal.keywords) as a(elem)
    WHERE a.elem ILIKE p.pattern
    )
)`
            const keywords = filterObject.keywords.map(keyword => `%${keyword}%`);
            params.push(keywords);
            i++;
        }
        if (filterObject.level !== null) {
            query += ` AND level = $${i}`;
            params.push(getNum(filterObject.level));
            i++;
        }
        if (filterObject.groups !== null && filterObject.groups.length > 0) {
            query += ` AND NOT EXISTS (
SELECT FROM unnest($${i}::text[]) as p(pattern)
WHERE NOT EXISTS (
    SELECT FROM unnest(thesis_proposal.groups) as a(elem)
    WHERE a.elem ILIKE p.pattern
    )
)`
            const groups = filterObject.groups.map(group => `%${group}%`);
            params.push(groups);
            i++;
        }
        query += ` AND archived = false AND expiration > ${i}`
        query += ' ORDER BY thesis_proposal.level, thesis_proposal.expiration ASC, thesis_proposal.type ASC'
        const result = await this.db.executeQueryExpectAny(query, ...params, virtualClock.getSqlDate());
        return result;
    }

    async deleteById(id) {
        const query = `DELETE FROM thesis_proposal WHERE id = $1`;
        const result = await this.db.executeQueryExpectMany(query, getNum(id), `ThesisProposal with id ${id} not found`);
        return ThesisProposal.fromRow(result);
    }

    async updateThesisProposal(proposal,id) {
        const query = `UPDATE thesis_proposal SET title=$2 ,co_supervisor=$3, keywords=$4, type=$5, groups=$6, description=$7, required_knowledge=$8, notes=$9, expiration=$10, level=$11, programmes=$12 WHERE id=$1 RETURNING *`;
        const result = await this.db.executeQueryExpectOne(query, id, proposal.title, proposal.co_supervisor, proposal.keywords, proposal.type, proposal.groups, proposal.description, proposal.required_knowledge, proposal.notes, proposal.expiration, proposal.level, proposal.programmes, `Failed to update ThesisProposal`);
        return ThesisProposal.fromRow(result);
    }

}



export { ThesisProposal, ThesisProposalTable };
