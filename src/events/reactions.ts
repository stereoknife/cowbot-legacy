/* eslint-disable no-unused-vars */
import type { CommandClient, PossiblyUncachedMessage } from 'eris'
import type { RedisClient } from 'redis'
import { translate } from 'google-translate-api-browser'
/* eslint-enable no-unused-vars */

export function loadReactions (bot: CommandClient, db: RedisClient) {
  bot.on('messageReactionAdd', async (msg, emoji, uid) => {
    switch (emoji.name) {
      case '🤠':
        db.zincrby(`highlights:${msg.channel}`, 1, msg.id)
        break

      case '🔣':
        translateMessage(msg, uid)
        break

      default:
        break
    }
  })

  bot.on('messageReactionRemove', async (msg, emoji, uid) => {
    if (emoji.name !== '🤠') return
    db.zincrby(`highlights:${msg.channel}`, -1, msg.id)
  })

  bot.on('messageReactionRemoveEmoji', async (msg, emoji) => {
    if (emoji.name !== '🤠') return
    db.zrem(`highlights:${msg.channel}`, msg.id)
  })

  function translateMessage (msg: PossiblyUncachedMessage, uid: string) {
    db.exists(`translate:${msg.id}`, async (err, res) => {
      if (err != null) console.error(err)
      if (res === 1) {
        db.expire(`translate:${msg.id}`, 20 * 60)
        return
      }

      const m = await msg.channel.getMessage(msg.id)
      const tr = await translate(m.content, { from: 'auto', to: 'en' }) as { text: string }
      msg.channel.createMessage({
        embed: {
          author: {
            name: m.author.username,
            icon_url: m.author.staticAvatarURL
          },
          title: m.content,
          description: tr.text
        }
      })
      db.setex(`translate:${msg.id}`, 60 * 30, 'd')
    })
  }
}
