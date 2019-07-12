const { client, delay } = require('./utils')
const date = new Date()

function main () {
  const key = 'numbers'
  let n = 0

  async function produce () {
    // Log informational Stream growth statistics.
    const length = await client.xlenAsync(key)
    console.log(`${date.getTime()}: Stream ${key} has ${length} messages.`)

    // Append the next message.
    // https://redis.io/commands/xadd
    const id = await client.xaddAsync(key, '*', 'n', n)
    console.log(`${date.getTime()}: Produced the number ${n} as message id ${id}`)

    n += 1

    await delay(1000)
    produce()
  }

  produce()
}

main()
