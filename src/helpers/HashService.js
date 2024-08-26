const crypto = require('crypto');

class HashService {
    constructor() {

    }

    async hashPassword(password) {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (error, salt) => {
                if (error) return reject(error);
                salt = salt.toString('hex');

                crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (error, key) => {
                    if (error) return reject(error);
                    resolve(`${salt}:${key.toString('hex')}`);
                });
            });
        });
    }

    async verifyPassword(storedHash, password) {
        return new Promise((resolve, reject) => {
            const [salt, originalHash] = storedHash.split(':');

            crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (error, key) => {
                if (error) return reject(error);
                resolve(key.toString('hex') === originalHash);
            });
        });
    }
}

module.exports = HashService;
