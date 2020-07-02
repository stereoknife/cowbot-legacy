import Eris from 'eris'
import redis from 'redis'

import { ComClient } from './parser'
import { loadReactions } from './events/reactions'
import { loadCommands } from './commands/commands'
import { loadUtilities } from './commands/utils'

// Check env variables
if (process.env.token == null) {
  console.error('Bot token missing, add it to token environment variable')
  process.exit()
}
if (process.env.owner == null) {
  console.warn("No owner defined, you won't be able to access to restricted commands.")
}

const db = redis.createClient(process.env.redisPath || '/var/redis/run/redis.sock', {
  retry_strategy: opt => { if (opt.attempt > 10) process.exit() },
  socket_initial_delay: 5000
})
db.on('error', err => console.error(err))

const bot = new ComClient(process.env.token, {
  prefix: ['🤠', 'go-go-gadget', '☭']
})

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
//loadUtilities(bot)

bot.connect()
