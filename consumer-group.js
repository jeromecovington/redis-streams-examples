const util = require('util')
const { client, key, group } = require('./utils')

main()

function main () {
  const c = client()
  const members = 3

  consume()

  async function consume () {
    /**
     * https://redis.io/commands/xgroup
     * Manages the consumer groups associated with a stream data structure.
     *
     * Arguments:
     * 'CREATE' - We are creating a consumber group, there are other commands
     *            you can pass, such as 'DESTROY' or 'DELCONSUMER'.
     * key - The stream we are managing consumers for.
     * group - The name of the group we are managing.
     * '0' - Fetch the whole stream history. If we passed '$', we would fetch
     *       starting from the last ID currently on the stream.
     **/
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
      /**
       * https://redis.io/commands/xreadgroup
       * A special version of xread with support for consumer groups.
       *
       * Arguments:
       * 'GROUP', group, name - The named consumer within our named group.
       * 'BLOCK', timeout - The amount of time to block reading by, in order to
       *                    manage polling.
       *                    See - https://redis.io/commands/xread#blocking-for-data
       * 'STREAMS', key - The stream our consumers are reading from.
       * from - '0': from the beginning of the stream.
       *        '>': from the tip of the stream.
       **/
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
          console.log(`message: ${util.inspect(message, false, null)}`)
          if (message[1] && message[1][1]) {
            const n = parseInt(message[1][1])
            if (isPrime(n)) {
              console.log(`${name}: ${n} is so prime!`)
            }
            /**
             * https://redis.io/commands/xack
             * Removes one or multiple messages from the pending entries list
             * of a stream consumer group.
             *
             * Arguments:
             * key - The stream we are removing the message(s) from.
             * group - Our consumer group.
             * message[0] - The id of the message we are removing from pending.
             **/
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
