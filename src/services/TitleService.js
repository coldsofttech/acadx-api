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

    async getTitles(page = 1, pageSize = 10, includeArchive = false, includeAudit = false) {
        await this.init();

        let selectFields = 'id, title';
        if (includeArchive) {
            selectFields += ', is_active';
        }
        if (includeAudit) {
            selectFields += ', created_by, created_on, updated_by, updated_on';
        }

        let countQuery = 'SELECT COUNT(*) AS totalRecords FROM dbo.titles';
        if (!includeArchive) {
            countQuery += ' WHERE is_active = 1';
        }
        const totalResult = await this.dbPool.request().query(countQuery);
        const totalRecords = totalResult.recordset[0].totalRecords;

        const offset = (page - 1) * pageSize;
        let query = `SELECT ${selectFields} FROM dbo.titles`;
        if (!includeArchive) {
            query += ' WHERE is_active = 1';
        }
        query += ` ORDER BY id OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`;
        const result = await this.dbPool.request().query(query);
        const titles = result.recordset;

        return { titles, totalRecords };
    }

    async getTitleById(id, includeAudit = false) {
        await this.init();

        let selectFields = 'id, title, is_active';
        if (includeAudit) {
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
