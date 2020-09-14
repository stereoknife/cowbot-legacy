import { Client } from 'eris'
import * as db from './db'
import term from './term'
import react from './reactions'
import translate from './usr/translate.pkg'
import general from './usr/general.pkg'
import echo from './usr/echo.pkg'
import callout from './usr/callout.pkg'

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
  console.log('Katastrooffi occured')
  bot.disconnect({ reconnect: true })
})

process.on('SIGINT', function () {
  console.log('Shutting down...')
  bot.disconnect({ reconnect: false })
  process.exit()
})

bot.on('ready', async () => {
  term.setup(bot)
  react.setup(bot)

  // load base features
  general.install()
  translate.install()
  echo.install()
  callout.install()

  console.log('Ready!')
})

bot.connect()
