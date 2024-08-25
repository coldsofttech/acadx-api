const MsSqlDbConfig = require('../dbConfigs/mssql');
const SqlString = require('sqlstring');

const dbConfig = new MsSqlDbConfig();

class ConfigService {
    constructor() {
        this.dbPool = null;
    }

    async init() {
        if (!this.dbPool) {
            this.dbPool = await dbConfig.connect();
        }
    }

    async getConfig(includeAudit = false) {
        await this.init();

        let selectFields = 'component, category, configuration, value';
        if (includeAudit) {
            selectFields += ', created_by, created_on, updated_by, updated_on';
        }

        let query = `SELECT ${selectFields} FROM dbo.config`;
        const result = await this.dbPool.request().query(query);
        const configurations = result.recordset;

        return { configurations };
    }

    async getConfigByComponent(component, includeAudit = false) {
        await this.init();

        component = component.toUpperCase();

        let selectFields = 'component, category, configuration, value';
        if (includeAudit) {
            selectFields += ', created_by, created_on, updated_by, updated_on';
        }

        let query = `SELECT ${selectFields} FROM dbo.config WHERE UPPER(component) = ${SqlString.escape(component)}`;
        const result = await this.dbPool.request().query(query);
        const configurations = result.recordset;

        return { configurations };
    }

    async getConfigByCategory(component, category, includeAudit = false) {
        await this.init();

        component = component.toUpperCase();
        category = category.toUpperCase();

        let selectFields = 'component, category, configuration, value';
        if (includeAudit) {
            selectFields += ', created_by, created_on, updated_by, updated_on';
        }

        let query = `SELECT ${selectFields} FROM dbo.config WHERE UPPER(component) = ${SqlString.escape(component)} AND UPPER(category) = ${SqlString.escape(category)}`;
        const result = await this.dbPool.request().query(query);
        const configurations = result.recordset;

        return { configurations };
    }

    async getConfigByConfiguration(component, category, configuration, includeAudit = false) {
        await this.init();

        component = component.toUpperCase();
        category = category.toUpperCase();
        configuration = configuration.toUpperCase();

        let selectFields = 'component, category, configuration, value';
        if (includeAudit) {
            selectFields += ', created_by, created_on, updated_by, updated_on';
        }

        let query = `SELECT ${selectFields} FROM dbo.config WHERE UPPER(component) = ${SqlString.escape(component)} AND UPPER(category) = ${SqlString.escape(category)} AND UPPER(configuration) = ${SqlString.escape(configuration)}`;
        const result = await this.dbPool.request().query(query);
        if (!result.recordset || result.recordset.length === 0) {
            throw new Error(`No data found for Component: ${component}; Category: ${category}; Configuration: ${configuration}`);
        }

        return result.recordset[0];
    }
}

module.exports = ConfigService;
