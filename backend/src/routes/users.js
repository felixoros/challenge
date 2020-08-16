const express = require('express');
const {pool} = require('../db/config')

let router = express.Router();

router
    .route('')
    .get((req, resp) => {
        pool.query('SELECT * FROM users', (error, results) => {
            if (error) {
                throw error
            }
            resp.status(200).json(results.rows);
        });
    });

module.exports = router;