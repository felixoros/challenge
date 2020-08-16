const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const status = require('./routes/status');
const users = require('./routes/users');

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

app.use('/status', status);
app.use('/users', users);

app.listen(process.env.EXPRESS_DEFAULT_PORT || 8080, '0.0.0.0',
() => {
    console.log(`Server listening`)
});