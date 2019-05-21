const express = require('express')
const app = express()
const port = 8081
const LaunchDarkly = require('launchdarkly-node-server-sdk');

const redisConfig = {
    port: process.env.ELASTICACHE_PORT,
    host: process.env.ELASTICACHE_ENDPOINT
};

const store = new LaunchDarkly.RedisFeatureStore(redisConfig);

const ldConfig = {
    feature_store: store,
    useLdd: true
};
var ldClient = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY, ldConfig);

var customerLoginEnabled = false;
var customerFeatureHtml = '';

ldClient.once('ready', () => {

    ldClient.variation("customer-login-enabled", {}, false, function(err, customerLoginEnabled) {
        if (err)
        {
            customerFeatureHtml = `Error getting customerLoginEnabled: ${err.message}`
        }
        else
        {
            customerFeatureHtml = `customerLoginEnabled: ${customerLoginEnabled}`
        }
    });

    ldClient.close();
});


var html = `<html>
            <body>
                <div>Elasticache Endpoint: ${process.env.ELASTICACHE_ENDPOINT}</div>
                <div>Elasticache Port: ${process.env.ELASTICACHE_PORT}</div>
                <div>${customerFeatureHtml}</div>
            </body>`

app.get('/', (req, res) => res.send(html))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

