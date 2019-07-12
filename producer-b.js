const { client, key } = require('./utils')
const date = new Date()

function main () {
  let n = 0
  const max = 100

  async function produce () {
    if (n > max) {
      // log informational stream growth statistics.
      const length = await client.xlenAsync(key)
      console.log(`${date.getTime()}: Stream ${key} has ${length} messages.`)

      process.exit()
    }

    // Append the next message.
    // https://redis.io/commands/xadd
    const id = await client.xaddAsync(key, '*', 'n', n)
    console.log(`${date.getTime()}: Produced the number ${n} as message id ${id}`)

    n += 1

    produce()
  }

  produce()
}

main()
