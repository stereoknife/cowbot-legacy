import Eris, { Client } from 'eris'
import { parser } from './parser'
import { exec } from './commanding'
import * as commands from './commands'
import log from './logging'
import * as db from './db'

// Check env variables
if (process.env.token == null) {
  console.error('Bot token missing, add it to token environment variable')
  process.exit()
}
if (process.env.owner == null) {
  console.warn("No owner defined, you won't be able to access to restricted commands.")
}

db.init()

const bot = new Client(process.env.token)

process.on('uncaughtException', function (err) {
  console.log(err)
  console.log('RIP me :(')
  bot.disconnect({ reconnect: false })
  process.exit()
})

process.on('SIGINT', function () {
  console.log('Buh bai')
  bot.disconnect({ reconnect: false })
  process.exit()
})

bot.on('ready', () => {
  console.log('Ready!')
})

const parse = parser({
  prefix: ['🤠', 'go-go-gadget', '☭']
})

commands.init()

bot.on('messageCreate', ({ channel, content, author }) => {
  const commandData = parse(content)
  // if valid command
  if (commandData?.prefix != null && commandData?.prefix != '') {
    log('valid command found')
    const reply = channel.createMessage.bind(channel)
    let dm: (content: any) => void = (content: any) => {}
    author.getDMChannel()
      .then(ch => {
        log('got dm channel')
        dm = ch.createMessage.bind(ch)
      })
      .catch(() => { log('error getting dm channel', 2) })
      .finally(() => {
        exec(commandData, reply, dm)
       })
  }

  // if not valid command
})

bot.connect()
