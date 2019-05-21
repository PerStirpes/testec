const express = require('express')
const app = express()
const port = 8180

var html = `<html>
            <body>
                <div>Elasticache Endpoint: ${process.env.ELASTICACHE_ENDPOINT}</div>
                <div>Elasticache Port: ${process.env.ELASTICACHE_PORT}</div>
            </body>`

app.get('/', (req, res) => res.send(html))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

/*
var redisConfig = {
    port: process.env.ELASTICACHE_PORT,
    host: process.env.ELASTICACHE_ENDPOINT
};

var store = new LaunchDarkly.RedisFeatureStore(redisConfig);



var ldConfig = {
    feature_store: store
};
var ldClient = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY, ldConfig);

ldClient.once('ready', () => {
    ldClient.close();
});
*/
