
const { RateLimiterRedis } = require('rate-limiter-flexible');
const browser = require('browser-detect');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const maxWrongAttemptsByIPperDay = 100;
const maxConsecutiveFailsByUsernameAndIP = 5;

if (process.env.REDISTOGO_URL) {
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  var redis = require("redis");
  var redisClient = redis.createClient(rtg.port, rtg.hostname);
  redisClient.auth(rtg.auth.split(":")[1]);
} else {
  var redis = require("redis");
  var redisClient = redis.createClient({
    enable_offline_queue: false,
  });
}

const limiterSlowBruteByIP = new RateLimiterRedis({
  redis: redisClient,
  keyPrefix: 'login_fail_ip_per_day',
  points: maxWrongAttemptsByIPperDay,
  duration: 60 * 60 * 24,
  blockDuration: 5, 
});

const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterRedis({
  redis: redisClient,
  keyPrefix: 'login_fail_consecutive_username_and_ip',
  points: maxConsecutiveFailsByUsernameAndIP,
  duration: 60*2, 
  blockDuration: 60, });

const getUsernameIPkey = (username, ip) => `${username}_${ip}`;


exports.loginRoute = async function (req, res, user) {
  const ipAddr = req.connection.remoteAddress;
  const result = browser(req.headers['user-agent']);
  const usernameIPkey = (result.name == 'firefox') ? req.body.username : getUsernameIPkey(req.body.username, ipAddr);

  const [resUsernameAndIP, resSlowByIP] = await Promise.all([
    limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey),
    limiterSlowBruteByIP.get(ipAddr),
  ]);
  let retrySecs = 0;

  // Check if IP or Username + IP is already blocked
  if (resSlowByIP !== null && resSlowByIP.remainingPoints <= 0) {
    retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
  } else if (resUsernameAndIP !== null && resUsernameAndIP.remainingPoints <= 0) {
    retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
  }
  if (retrySecs > 0) {
    res.set('Retry-After', String(retrySecs));
    res.status(429).send({error:'Too Many Requests',rol:'nan'});
  } else {
		bcrypt.compare(req.body.password, user.password, async function(err, resp) {
			if(resp){
				var tokenData = {
					username: user.username
					// ANY DATA
				}
				
				var token = jwt.sign(tokenData, 'Secret Password', {
					expiresIn: 60 * 60 * 24 // expires in 24 hours
				})
				user.token = token;
				user.isLoggedIn=true;
				if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > 0) {
					// Reset on successful authorisation
					await limiterConsecutiveFailsByUsernameAndIP.delete(usernameIPkey);
				}
				res.send(user);
			}else{
				user.isLoggedIn=true;
				user.exists = true;
				// Consume 1 point from limiters on wrong attempt and block if limits reached
				try {
					const promises = [limiterSlowBruteByIP.consume(ipAddr)];
					if (user.exists) {
						// Count failed attempts by Username + IP only for registered users
						promises.push(limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey));
					}
	
					await promises;
					res.status(400).send({error:'email or password is wrong',rol:'nan'});
				} catch (rlRejected) {
					if (rlRejected instanceof Error) {
						throw rlRejected;
					} else {
						res.set('Retry-After', String(Math.round(rlRejected.msBeforeNext / 1000)) || 1);
						res.status(429).send({error:'Too Many Requests',rol:'nan'});
					}
				}
			}
	});
		
  }
}