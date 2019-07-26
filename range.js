const { client, key } = require('./utils')
const date = new Date()

function main () {
  let sum = 0

  async function sumWithRangeQuery () {
    const c = client()

    // https://redis.io/commands/xrange
    const msgs = await c.xrangeAsync(key, '-', '+')

    if (!msgs) {
      console.log(`${date.getTime()}: Stream "${key}" has no messages.`)
      process.exit()
    }

    msgs.forEach(msg => {
      sum += parseInt(msg[1][1])
    })

    console.log(`${date.getTime()}: Sum of stream "${key}" is ${sum}.`)
    process.exit()
  }

  sumWithRangeQuery()
}

main()
