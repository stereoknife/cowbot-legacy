// eslint-disable-next-line no-unused-vars
import type { CommandClient } from 'eris'

export function loadEvents (bot: CommandClient) {
  bot.on('messageCreate', message => {
    const match = message.content.match(/^CBT stands for [\w ]*/)
    if (match) {
      // tweet match
    }
  })
}
