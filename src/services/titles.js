const MsSqlDbConfig = require('../dbConfigs/mssql');
const SqlString = require('sqlstring');

const dbConfig = new MsSqlDbConfig();

class TitleService {
    constructor() {
        this.dbPool = null;
    }

    async init() {
        if (!this.dbPool) {
            this.dbPool = await dbConfig.connect();
        }
    }

    async getTitles(include_archive = false, include_audit = false) {
        await this.init();

        let selectFields = 'id, title';
        if (include_archive) {
            selectFields += ', is_active';
        }
        if (include_audit) {
            selectFields += ', created_by, created_on, updated_by, updated_on';
        }

        let query = `SELECT ${selectFields} FROM dbo.titles`;
        if (!include_archive) {
            query += ' WHERE is_active = 1';
        }

        const result = await this.dbPool.request().query(query);
        return result.recordset;
    }

    async getTitleById(id, include_audit = false) {
        await this.init();

        let selectFields = 'id, title, is_active';
        if (include_audit) {
            selectFields += ', created_by, created_on, updated_by, updated_on';
        }

        let query = `SELECT ${selectFields} FROM dbo.titles WHERE id = ${SqlString.escape(id)}`;
        const result = await this.dbPool.request().query(query);
        if (!result.recordset || result.recordset.length === 0) {
            throw new Error(`No data found for ID: ${id}`);
        }

        return result.recordset[0];
    }
}

module.exports = TitleService;
