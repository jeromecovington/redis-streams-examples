const { client, key } = require('./utils')
const date = new Date()

function main () {
  async function del () {
    const c = client()

    await c.delAsync(key)

    console.log(`${date.getTime()}: Streams key "${key}" deleted.`)
    process.exit()
  }

  del()
}

main()
