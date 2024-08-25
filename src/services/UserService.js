const sql = require('mssql');
const MsSqlDbConfig = require('../dbConfigs/mssql');
const SqlString = require('sqlstring');
const TitleService = require('./TitleService');
const SsoIntegrationService = require('./SsoIntegrationService');
const UserValidator = require('../validators/UserValidator');

const dbConfig = new MsSqlDbConfig();

class UserService {
    constructor() {
        this.dbPool = null;
        this.titleService = new TitleService();
        this.ssoIntegrationService = new SsoIntegrationService();
        this.userValidator = new UserValidator(this.titleService, this.ssoIntegrationService);
    }

    async init() {
        if (!this.dbPool) {
            this.dbPool = await dbConfig.connect();
        }
    }

    async createUser(title = null, first_name, middle_name = null, last_name, dob = null, email, password = null, sso_integrator = null) {
        await this.userValidator.validateUserInput({
            title, first_name, middle_name, last_name, dob, email, password, sso_integrator
        });

        await this.init();
        try {
            const columns = [];
            const values = [];
            const inputs = {};

            const addColumnValue = (column, paramName, type, value) => {
                columns.push(column);
                values.push(paramName);
                inputs[paramName.slice(1)] = { type, value };
            };

            if (title !== null) addColumnValue('title', '@title', sql.Int, title);
            addColumnValue('first_name', '@first_name', sql.NVarChar, first_name);
            if (middle_name !== null) addColumnValue('middle_name', '@middle_name', sql.NVarChar, middle_name);
            addColumnValue('last_name', '@last_name', sql.NVarChar, last_name);
            if (dob != null) addColumnValue('dob', '@dob', sql.Date, dob);
            addColumnValue('email', '@email', sql.NVarChar, email);
            if (password !== null) addColumnValue('password', '@password', sql.NVarChar, password);
            if (sso_integrator !== null) addColumnValue('sso_integrator', '@sso_integrator', sql.Int, sso_integrator);
            addColumnValue('is_active', '@is_active', sql.Bit, true);
            addColumnValue('created_by', '@created_by', sql.Int, 1);

            const query = `INSERT INTO dbo.users (${columns.join(', ')}) OUTPUT INSERTED.* VALUES (${values.join(', ')})`;
            const request = this.dbPool.request();
            for (const [key, { type, value }] of Object.entries(inputs)) {
                request.input(key, type, value);
            }
            const result = await request.query(query);
            return await this.getUserById(result.recordset[0].id);
        } catch (error) {
            throw new Error(error);
        }
    }

    async getUsers(page = 1, pageSize = 10, includeArchive = false, includeAudit = false) {
        await this.init();

        let selectFields = 'id, title, first_name, middle_name, last_name, dob, email, sso_integrator';
        if (includeArchive) {
            selectFields += ', is_active';
        }
        if (includeAudit) {
            selectFields += ', created_by, created_on, updated_by, updated_on';
        }

        let countQuery = 'SELECT COUNT(*) AS totalRecords FROM dbo.users';
        if (!includeArchive) {
            countQuery += ' WHERE is_active = 1';
        }

        const totalResult = await this.dbPool.request().query(countQuery);
        const totalRecords = totalResult.recordset[0].totalRecords;

        const offset = (page - 1) * pageSize;
        let query = `SELECT ${selectFields} FROM dbo.users`;
        if (!includeArchive) {
            query += ' WHERE is_active = 1';
        }
        query += ` ORDER BY id OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`;
        const result = await this.dbPool.request().query(query);
        const users = result.recordset;

        return { users, totalRecords };
    }

    async getUserById(id, includeAudit = false) {
        await this.init();

        let selectFields = 'id, title, first_name, middle_name, last_name, dob, email, sso_integrator, is_active';
        if (includeAudit) {
            selectFields += ', created_by, created_on, updated_by, updated_on';
        }

        let query = `SELECT ${selectFields} FROM dbo.users WHERE id = ${SqlString.escape(id)}`;
        const result = await this.dbPool.request().query(query);
        if (!result.recordset || result.recordset.length === 0) {
            throw new Error(`No data found for ID: ${id}`);
        }

        return result.recordset[0];
    }

    async getUserByEmail(email, includeAudit = false) {
        await this.init();

        let selectFields = 'id, title, first_name, middle_name, last_name, dob, email, sso_integrator, is_active';
        if (includeAudit) {
            selectFields += ', created_by, created_on, updated_by, updated_on';
        }

        let query = `SELECT ${selectFields} FROM dbo.users WHERE email = ${SqlString.escape(email)}`;
        const result = await this.dbPool.request().query(query);
        if (!result.recordset || result.recordset.length === 0) {
            throw new Error(`No data found for ID: ${id}`);
        }

        return result.recordset[0];
    }
}

module.exports = UserService;
