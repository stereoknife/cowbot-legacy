import Eris from 'eris'
import redis from 'redis'

import { loadReactions } from './events/reactions'
import { loadCommands } from './commands/commands'
import { loadUtilities } from './commands/utils'

const commandOpts = {
  prefix: ['🤠', 'go-go-gadget-', '☭']
}

const db = redis.createClient(process.env.redisPath || '/var/redis/run/redis.sock', {
  retry_strategy: opt => { if (opt.attempt > 10) process.exit() },
  socket_initial_delay: 5000
})
db.on('error', err => console.error(err))

const bot = new Eris.CommandClient('NDgxNTQxNTEzMTAxMzEyMDUx.XkkIww.n7VU-pjvkd-UsPMmAmj0IQWjIJo', {}, commandOpts)

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

// Reactions
loadReactions(bot, db)
// loadEvents(bot)

// Commands
loadCommands(bot, db)
loadUtilities(bot)

bot.connect()
