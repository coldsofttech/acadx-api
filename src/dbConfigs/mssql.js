require('dotenv').config();

const sql = require('mssql');

class MsSqlDbConfig {
    constructor() {
        this.config = {
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            server: process.env.DATABASE_SERVER,
            database: process.env.DATABASE_NAME,
            options: {
                encrypt: process.env.DATABASE_ENCRYPT === 'true',
                trustServerCertificate: process.env.DATABASE_TRUST_SERVER_CERTIFICATE === 'true'
            }
        };
    }

    async connect() {
        try {
            return sql.connect(this.config);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = MsSqlDbConfig;
