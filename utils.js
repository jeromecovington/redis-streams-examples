const redis = require('redis')
const bluebird = require('bluebird')

// Promisified methods get the *Async suffix.
bluebird.promisifyAll(redis)
// Expose instantiation function for a redis client.
const client = () => redis.createClient()
// Name for our stream.
const key = 'numbers'
// Name for our consumer group.
const group = 'primes'

module.exports = {
  client,
  delay: duration => new Promise(resolve => setTimeout(resolve, duration)),
  key,
  group
}
