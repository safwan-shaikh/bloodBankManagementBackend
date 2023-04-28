const { Client } = require('pg');

const client = new Client({
    user: 'blood_bank_mgmt_role',
    host: 'localhost',
    database: 'blood_bank_mgmt_system',
    password: 'bbm_pass',
    port: 5432,
});

client.connect((err, client, done) => {
    if (err) throw err;
    console.log('Connected to database');
});

const db = {}
db.client = client;

module.exports = db;
