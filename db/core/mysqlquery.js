const { pool } = require('./mysqlpool');

const query = (queryText, ...params) => {
    return new Promise((resolve, reject) => {
        pool.query(queryText, params, (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        });
    });
};

module.exports = { query };