var LaunchDarkly = require('launchdarkly-node-server-sdk');
var redisOptions = {port: process.env.ELASTICACHE_PORT, host: process.env.ELASTICACHE_ENDPOINT}
var store = new LaunchDarkly.RedisFeatureStore(redisOptions)
var config = {feature_store: store, offline: true}

// SDK key is not required when in offline mode
var ldClient = LaunchDarkly.init(null, {config});

ldClient.on('ready', function() {
 console.log("The LaunchDarkly SDK is now initialized with flag configurations stored in redis.");

  ldClient.variation("customer-login-enabled", {}, false, function(err, customerLoginEnabled) {
    console.log(`customerLoginEnabled = ${customerLoginEnabled}`);
  });

 ldClient.close();
})