const express = require('express');
let router = express.Router();

const health = require('@cloudnative/health-connect');

const livePromise = () => new Promise((resolve, _reject) => {
    const appFunctioning = true;

    // You should change the above to a task to determine if your app is functioning correctly
    if (appFunctioning) {
        resolve();
    } else {
        reject(new Error("App is not functioning correctly"));
    }
});

let healthCheck = new health.HealthChecker();

let liveCheck = new health.LivenessCheck("LivenessCheck", livePromise);
healthCheck.registerLivenessCheck(liveCheck);

let readyCheck = new health.PingCheck("postgres:" + process.env.POSTGRES_DEFAULT_PORT);
healthCheck.registerReadinessCheck(readyCheck);

router
    .route('/live')
    .get(health.LivenessEndpoint(healthCheck));

// router
//     .route('/ready')
//     .get(health.ReadinessEndpoint(healthCheck));

router
    .route('/health')
    .get(health.HealthEndpoint(healthCheck));

module.exports = router;