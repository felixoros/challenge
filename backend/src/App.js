const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const {pool} = require('./config')
const health = require('@cloudnative/health-connect');

let healthCheck = new health.HealthChecker();
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

const livePromise = () => new Promise((resolve, _reject) => {
    const appFunctioning = true;

    // You should change the above to a task to determine if your app is functioning correctly
    if (appFunctioning) {
        resolve();
    } else {
        reject(new Error("App is not functioning correctly"));
    }
});

let liveCheck = new health.LivenessCheck("LivenessCheck", livePromise);
healthCheck.registerLivenessCheck(liveCheck);

let readyCheck = new health.PingCheck("example.com");
healthCheck.registerReadinessCheck(readyCheck);

app.get('/', (req, res) => res.send('hello'));

app.use('/live', health.LivenessEndpoint(healthCheck))
app.use('/ready', health.ReadinessEndpoint(healthCheck))
app.use('/health', health.HealthEndpoint(healthCheck))

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

app
    .route('/users')
    .get(getUsers);

app.listen(process.env.EXPRESS_DEFAULT_PORT || 8080, '0.0.0.0',
() => {
    console.log(`Server listening`)
});