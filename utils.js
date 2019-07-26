const redis = require('redis')
const bluebird = require('bluebird')

bluebird.promisifyAll(redis)

const key = 'numbers'
const client = () => redis.createClient()

module.exports = {
  client,
  delay: duration => new Promise(resolve => setTimeout(resolve, duration)),
  key
}
