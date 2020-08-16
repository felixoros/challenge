require('dotenv').config()

const {Pool} = require('pg')
const isProduction = process.env.NODE_ENV === 'production'

const connectionString = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@127.0.0.1:${process.env.POSTGRES_DEFAULT_PORT}/${process.env.POSTGRES_DB}`

const pool = new Pool({
    connectionString: isProduction ? process.env.POSTGRES_PRODUCTION_URL : connectionString,
    ssl: isProduction,
})

module.exports = {pool}