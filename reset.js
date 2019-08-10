const { client, key, group } = require('./utils')
const date = new Date()

function main () {
  async function del () {
    const c = client()

    await c.xgroupAsync('DESTROY', key, group)
    console.log(`${date.getTime()}: Streams group "${group}" destroyed.`)

    await c.delAsync(key)
    console.log(`${date.getTime()}: Streams key "${key}" deleted.`)

    process.exit()
  }

  del()
}

main()
