const { query } = require('./mysqlquery');

// query("SELECT * FROM Persons")
//     .then(res => console.log(res))
//     .catch(err => {
//         throw err;
//     });

query("SELECT * FROM ?", "Persons")
    .then(res => console.log(res))
    .catch(err => {
        throw err;
    });