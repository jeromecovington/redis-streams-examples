const { client, delay, key } = require('./utils')
const date = new Date()

function main () {
  let n = 0

  async function produce () {
    const c = client()

    /**
     * https://redis.io/commands/xlen
     * Returns the number of entries inside a stream.
     **/
    const length = await c.xlenAsync(key)

    // Log informational stream growth statistics.
    console.log(`${date.getTime()}: Stream ${key} has ${length} messages.`)

    /**
     * https://redis.io/commands/xadd
     * Appends the next message.
     *
     * Arguments:
     * key - The name of our stream.
     * '*' - Autogenerate id for the stream.
     * 'n' - The name of the field entry.
     * n - The value for the field entry.
     * (Any number of field entry name/value pairs may be added.
     **/
    const id = await c.xaddAsync(key, '*', 'n', n)
    console.log(`${date.getTime()}: Produced the number ${n} as message id ${id}`)

    n += 1

    await delay(1000)
    produce()
  }

  produce()
}

main()
