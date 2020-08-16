require('dotenv').config()

const { Client } = require('pg')
const isProduction = process.env.NODE_ENV === 'production';

const postgresUser = process.env.POSTGRES_USER ? process.env.POSTGRES_USER : 'admin';
const postgresPassword = process.env.POSTGRES_PASSWORD ? process.env.POSTGRES_PASSWORD : 'felix';
const postgresDatabase = process.env.POSTGRES_DB ? process.env.POSTGRES_DB : 'internal';
const postgresAddress = process.env.NODE_ENV === 'docker' ? "postgres" : "127.0.0.1";
const postgresPort = process.env.POSTGRES_DEFAULT_PORT ? process.env.POSTGRES_DEFAULT_PORT : '5432';

const connectionString = `postgresql://${postgresUser}:${postgresPassword}@${postgresAddress}:${postgresPort}/${postgresDatabase}`;

const client = new Client({
    connectionString: isProduction ? process.env.POSTGRES_PRODUCTION_URL : connectionString,
});

client.connect();

const shouldAbort = err => {
    if (err) {
        console.error('Error in transaction', err.stack)
        client.query('ROLLBACK', err => {
            if (err) {
                console.error('Error rolling back client', err.stack)
            }
            // release the client back to the pool
            done();
        })
    }
    return !!err
}

module.exports = { client, shouldAbort }