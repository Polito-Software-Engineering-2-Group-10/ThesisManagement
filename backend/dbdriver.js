'use strict';
import pkg from 'pg';
const { Client } = pkg;

const basePgConfig = {
    user: 'thesismanager',
    password: 'thesismanager',
    host: 'db',
    port: 5432,
}

class PsqlDb {
    constructor(dbName, dbObject) {
        this.dbName = dbName;
        this.dbObject = dbObject;
    }

    /// Executes a query and returns the result
    /// Shouldn't be used directly, use the other executeQuery methods instead
    async executeQuery(text, ...params) {
        const query = {
            text: text,
            values: [...params]
        }
        return await this.dbObject.query(query);
    }

    /// Executes a query and expects exactly one row to be returned
    /// If the number of rows returned is not one, an error is thrown
    /// The last parameter is the error message to be thrown
    async executeQueryExpectOne(query, ...params) {
        if (params.length < 1) throw new Error("Invalid number of parameters");
        const errorMessage = params.pop();
        const result = await this.executeQuery(query, ...params);
        if (result.rowCount !== 1) throw new Error(errorMessage);
        return result.rows[0];
    }

    /// Executes a query and expects at least one row to be returned
    /// If the number of rows returned is zero, an error is thrown
    /// The last parameter is the error message to be thrown
    async executeQueryExpectMany(query, ...params) {
        if (params.length < 1) throw new Error("Invalid number of parameters");
        const errorMessage = params.pop();
        const result = await this.executeQuery(query, ...params);
        if (result.rowCount === 0) throw new Error(errorMessage);
        return result.rows;
    }

    /// Executes a query and expects any number of rows to be returned
    /// This function does not expect the last parameter to be an error message
    async executeQueryExpectAny(query, ...params) {
       // if (params.length < 1) throw new Error("Invalid number of parameters");
        const result = await this.executeQuery(query, ...params);
        return result.rows;
    }

    /// Just returns the inner Client object, shouldn't be used directly
    db() {
        return this.dbObject;
    }

    async connect() {
        await this.dbObject.connect();
    }
    async close() {
        await this.dbObject.end();
    }
}

class PsqlDriver {
    constructor() {
        this.openDatabases = {};
    }

    /// Opens a database with the given name
    /// If the database is already open, it is returned from the cache
    /// Otherwise, a new database is created and returned
    async openDatabase(dbName) {
        if (dbName in this.openDatabases)
            return this.openDatabases[dbName];

        const db = new PsqlDb(dbName, new Client({ 
            ...basePgConfig,
            database: dbName
        }));
        await db.connect();
        this.openDatabases[dbName] = db;
        return db;
    }
    async closeAll() {
        for (const dbName in this.openDatabases) {
            await this.openDatabases[dbName].close();
        }
    }
}

/// Either way these objects and classes shouldn't be used directly in index.js
/// They should be used by the various entities in entities/ to access the database
/// Method calls on the entities are then used in index.js
const psqlDriver = new PsqlDriver();
export { psqlDriver, PsqlDb };