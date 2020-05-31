/* eslint-disable no-unused-vars */
import type { CommandClient } from 'eris'
import type { RedisClient } from 'redis'
/* eslint-enable no-unused-vars */

export function loadEvents (bot: CommandClient, db: RedisClient) {
  bot.on('messageCreate', message => {
    const match = /CBT/i.test(message.content)
    if (match) {
      db.sadd(message.content)
    }
  })
}
