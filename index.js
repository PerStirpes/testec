const express = require('express')
const app = express()
const port = 8081
var LaunchDarkly = require('launchdarkly-node-server-sdk');
var winston = require('winston');

const redisConfig = {
    port: process.env.ELASTICACHE_PORT,
    host: process.env.ELASTICACHE_ENDPOINT
};

const store = new LaunchDarkly.RedisFeatureStore(redisConfig);

logger =
  new winston.Logger({
    level: "debug",
    transports: [
      new(winston.transports.Console)(),
    ]
  }
);

const ldConfig = {
    feature_store: store,
    useLdd: true,
    logger: winston
};

var ldClient = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY, ldConfig);

var customerLoginEnabled = false;
var customerFeatureHtml = '';

ldClient.once('ready', () => {

    ldClient.variation("customer-login-enabled", {}, false, function(err, customerLoginEnabled) {
        customerFeatureHtml = `customerLoginEnabled: ${customerLoginEnabled}`

        var html = `<html>
        <body>
            <div>Elasticache Endpoint: ${process.env.ELASTICACHE_ENDPOINT}</div>
            <div>Elasticache Port: ${process.env.ELASTICACHE_PORT}</div>
            <div>${customerFeatureHtml}</div>
        </body>`

        app.get('/', (req, res) => res.send(html))

    });

    ldClient.close();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

