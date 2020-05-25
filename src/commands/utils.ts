/* eslint-disable no-unused-vars */
import type { CommandClient, Message } from 'eris'
import fs from 'fs'
/* eslint-enable no-unused-vars */

export function loadUtilities (bot:CommandClient) {
  bot.registerCommand('yoink', async (msg, args) => {
    const total = parseInt(args[0]) || 100
    console.log('starting fetch of ' + total)
    let res: Message[] = []
    let id = msg.id
    for (let rest = total; rest > 0; rest -= 100) {
      res = [...res, ...await msg.channel.getMessages(rest > 100 ? 100 : rest, id)]
      id = res[res.length - 1].id
    }
    const json = res.map(msg => [msg.author.id, msg.cleanContent])
    const out = JSON.stringify(json)
    fs.promises.writeFile('./queries/' + Date.now() + '.json', out)
      .then(() => msg.channel.createMessage('¡done!'))
      .catch(console.error)
  }, {
    requirements: {
      userIDs: ['104937990006026240']
    }
  })

  bot.registerCommand('die', () => {
    bot.disconnect({ reconnect: false })
    process.exit()
  }, {
    requirements: {
      userIDs: ['104937990006026240']
    }
  })
}
