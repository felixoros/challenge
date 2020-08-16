const config = require('../config.json');
const jwt = require('jsonwebtoken')

const checkJwt = (req, res, next) => {
    //Get the jwt token from the head
    const token = req.headers["AccessToken"];
    let jwtPayload;

    try {
        jwtPayload = jwt.verify(token, config.SECRET_JWT_KEY);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        //If token is not valid, respond with 401 (unauthorized)
        res
            .status(401)
            .send();
        return;
    }

    //The token is valid for 1 hour
    //We want to send a new token on every request
    const { username, role } = jwtPayload;

    const newToken = jwt.sign({ username: username, role: role }, config.SECRET_JWT_KEY, { expiresIn: '1h' });
    res.setHeader("AccessToken", newToken);
    next();
};

module.exports = checkJwt;