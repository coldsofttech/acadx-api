const MsSqlDbConfig = require('../dbConfigs/mssql');
const SqlString = require('sqlstring');

const dbConfig = new MsSqlDbConfig();

class SsoIntegrationService {
    constructor() {
        this.dbPool = null;
    }

    async init() {
        if (!this.dbPool) {
            this.dbPool = await dbConfig.connect();
        }
    }

    async getSsoIntegrations(page = 1, pageSize = 10, includeArchive = false, includeAudit = false) {
        await this.init();

        let selectFields = 'id, name, placeholder_text, redirect_url, icon';
        if (includeArchive) {
            selectFields += ', is_active';
        }
        if (includeAudit) {
            selectFields += ', created_by, created_on, updated_by, updated_on';
        }

        let countQuery = 'SELECT COUNT(*) AS totalRecords FROM dbo.sso_integrators';
        if (!includeArchive) {
            countQuery += ' WHERE is_active = 1';
        }
        const totalResult = await this.dbPool.request().query(countQuery);
        const totalRecords = totalResult.recordset[0].totalRecords;

        const offset = (page - 1) * pageSize;
        let query = `SELECT ${selectFields} FROM dbo.sso_integrators`;
        if (!includeArchive) {
            query += ' WHERE is_active = 1';
        }
        query += ` ORDER BY id OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`;
        const result = await this.dbPool.request().query(query);
        const ssoIntegrations = result.recordset;

        return { ssoIntegrations, totalRecords };
    }

    async getSsoIntegrationById(id, includeAudit = false) {
        await this.init();

        let selectFields = 'id, name, placeholder_text, redirect_url, icon, is_active';
        if (includeAudit) {
            selectFields += ', created_by, created_on, updated_by, updated_on';
        }

        let query = `SELECT ${selectFields} FROM dbo.sso_integrators WHERE id = ${SqlString.escape(id)}`;
        const result = await this.dbPool.request().query(query);
        if (!result.recordset || result.recordset.length === 0) {
            throw new Error(`No data found for ID: ${id}`);
        }

        return result.recordset[0];
    }
}

module.exports = SsoIntegrationService;
