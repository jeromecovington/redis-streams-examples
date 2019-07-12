const { client, key } = require('./utils')
const date = new Date()

function main () {
  async function del () {
    await client.delAsync(key)

    console.log(`${date.getTime()}: Streams key "${key}" deleted.`)
    process.exit()
  }

  del()
}

main()
