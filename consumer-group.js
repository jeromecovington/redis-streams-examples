const { client, key } = require('./utils')

main()

function main () {
  const group = 'primes'
  const members = 3

  async function consume (name) {
    const c = client()
    let timeout = 100
    let retries = 0
    const maxRetries = 5
    let recovery = true
    let from = '0'

    while (true) {
      const reply = c.xreadgroupAsync(
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
        if (reply[0][1]) {
          console.log(`${name}: Recovering pending messages...`)
        } else {
          recovery = false
          from = '>'
          continue
        }
      }

      reply.forEach(messages => {
        messages.forEach(async message => {
          const n = parseInt(message[1][1])
          if (isPrime(n)) {
            console.log(`${name}: ${n} is so prime!`)
          }
          await c.xackAsync(key, group, message[0])
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
