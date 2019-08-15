const redis = require('redis')
const bluebird = require('bluebird')

bluebird.promisifyAll(redis)

const client = () => redis.createClient()
const key = 'numbers'
const group = 'primes'

module.exports = {
  client,
  delay: duration => new Promise(resolve => setTimeout(resolve, duration)),
  key,
  group
}
