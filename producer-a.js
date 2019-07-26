const { client, delay, key } = require('./utils')
const date = new Date()

function main () {
  let n = 0

  async function produce () {
    const c = client()

    // Log informational stream growth statistics.
    const length = await c.xlenAsync(key)
    console.log(`${date.getTime()}: Stream ${key} has ${length} messages.`)

    // Append the next message.
    // https://redis.io/commands/xadd
    const id = await c.xaddAsync(key, '*', 'n', n)
    console.log(`${date.getTime()}: Produced the number ${n} as message id ${id}`)

    n += 1

    await delay(1000)
    produce()
  }

  produce()
}

main()
