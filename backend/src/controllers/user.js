const { client, shouldAbort } = require('../db/client')
const config = require('../config.json');
const role = require('../enums/roles');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

const getOne = async (username) => {
    const queryText = `SELECT data FROM users WHERE data @>'{"username": "${username}"}'`;
    return client.query(queryText);
}

const isUsernameAndPasswordValid = (username, password) => {
    return username && password;
}

class user {
    static getAll = async (req, resp) => {
        client.query('SELECT * FROM users', async (error, results) => {
            if (error) {
                throw error;
            }
            resp.status(200).json({ success: true, data: results.rows });
        });
    };

    static login = async (req, resp) => {
        let { username, password } = req.body;

        if (!isUsernameAndPasswordValid(username, password)) {
            resp
                .status(400)
                .json({
                    success: false,
                    error: 'Invalid username and password'
                });
        }

        await getOne(username)
            .then(userResp => {
                if (userResp && userResp.rows && userResp.rows.length > 0) {
                    const user = userResp.rows[0].data;
                    const passwordHash = user.password;

                    if (bcrypt.compareSync(password, passwordHash)) {
                        resp.setHeader("AccessToken", user.token);

                        resp
                            .status(200)
                            .json({
                                success: true,
                                data: { id: user.id, username: user.username, token: user.token }
                            });
                    } else {
                        resp
                            .status(400)
                            .json({
                                success: false,
                                error: 'Invalid username and password'
                            });
                    }
                }
            })
            .catch((err) => {
                resp
                    .status(400)
                    .json({
                        success: false,
                        error: err.message
                    });
            });
    }

    static create = async (req, resp) => {
        let { username, password } = req.body;

        if (!isUsernameAndPasswordValid(username, password)) {
            resp
                .status(400)
                .json({
                    success: false,
                    error: 'Invalid username and password'
                });
        }

        await getOne(username)
            .then(userResp => {
                if (userResp && userResp.rows && userResp.rows.length > 0) {
                    resp
                        .status(400)
                        .json({
                            success: false,
                            error: 'Invalid username already exists'
                        });
                } else {
                    client.query('BEGIN', err => {
                        if (shouldAbort(err)) return

                        const token = jwt.sign({ username: username, role: role.User }, config.SECRET_JWT_KEY, { expiresIn: '1h' });
                        const salt = bcrypt.genSaltSync(10);
                        const passwordHash = bcrypt.hashSync(password, salt);

                        const user = {
                            username: username,
                            token: token,
                            role: role.User,
                            password: passwordHash
                        };

                        const queryText = "INSERT INTO users(data) VALUES($1) returning id";
                        client.query(queryText, [user], (err, res) => {
                            client.query('COMMIT', err => {
                                if (err) {
                                    console.error('Error committing transaction', err.stack)
                                    resp
                                        .status(500)
                                        .json({
                                            success: false,
                                            error: err.message
                                        });
                                    return;
                                }

                                resp.setHeader("AccessToken", token);

                                resp
                                    .status(200)
                                    .json({
                                        success: true,
                                        data: { id: res.rows[0].id, username: username, token: token }
                                    });
                            })
                        })
                    });
                }
            })
            .catch((err) => {
                resp
                    .status(400)
                    .json({
                        success: false,
                        error: err.message
                    });
            })
    };
}

module.exports = user;