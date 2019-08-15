const { client, key } = require('./utils')
const date = new Date()

function main () {
  let n = 0
  const max = 100

  async function produce () {
    const c = client()

    if (n > max) {
      /**
       * https://redis.io/commands/xlen
       * Returns the number of entries inside a stream.
       **/
      const length = await c.xlenAsync(key)

      // log informational stream growth statistics.
      console.log(`${date.getTime()}: Stream "${key}" has ${length} messages.`)

      process.exit()
    }

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

    produce()
  }

  produce()
}

main()
