const util = require('util')
const { client, key, group } = require('./utils')

main()

function main () {
  const c = client()
  const members = 3

  consume()

  async function consume () {
    await c.xgroupAsync('CREATE', key, group, '0')

    for (let i = 0; i < members; i++) {
      createConsumer(`consumer-${i}`)
    }
  }

  async function createConsumer (name) {
    console.log(`${name} created.`)

    let timeout = 100
    let retries = 0
    const maxRetries = 5
    let recovery = true
    let from = '0'

    while (true) {
      const reply = await c.xreadgroupAsync(
        'GROUP', group, name,
        'BLOCK', timeout,
        'STREAMS', key,
        from
      )

      if (!reply) {
        if (retries === maxRetries) {
          console.log(`${name}: Waited long enough, bye!`)
          break
        }

        retries++
        timeout *= 2
        continue
      }

      retries = 0
      timeout = 100

      if (recovery) {
        if (Array.isArray(reply) && reply.length && reply[0].length && reply[0][1].length) {
          console.log(`${name}: Recovering pending messages...`)
        } else {
          recovery = false
          from = '>'
          continue
        }
      }

      Array.isArray(reply) && reply.forEach(messages => {
        messages[1].forEach(async message => {
          console.log('message')
          console.log(util.inspect(message, false, null))
          if (message[1] && message[1][1]) {
            const n = parseInt(message[1][1])
            if (isPrime(n)) {
              console.log(`${name}: ${n} is so prime!`)
            }
            await c.xackAsync(key, group, message[0])
          }
        })
      })
    }
  }
}

function isPrime (n) {
  for (let i = 2, s = Math.sqrt(n); i <= s; i++) {
    if (n % i === 0) {
      return false
    }
  }
  return n > 1
}
