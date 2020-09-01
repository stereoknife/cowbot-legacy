/* eslint-disable no-unused-vars */
import type { PossiblyUncachedMessage } from 'eris'
import type { RedisClient } from 'redis'
import { translate } from 'google-translate-api-browser'
import langs from 'google-translate-api-browser/dist/languages'
import { PosixClient } from '../parser'
/* eslint-enable no-unused-vars */

const l = Object.keys(langs)

export function loadReactions (bot: PosixClient, db: RedisClient) {
  bot.on('messageReactionAdd', async (msg, emoji, uid) => {
    switch (emoji.name) {
      case '🤠':
        db.zincrby(`highlights:${msg.channel}`, 1, msg.id)
        break

      case '🔣':
        translateMessage(msg, uid)
        break

      case '🗺️':
        translateMessage(msg, uid, 'auto', l[Math.floor(Math.random() * l.length)])
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

  function translateMessage (msg: PossiblyUncachedMessage, uid: string, from: string = 'auto', to: string = 'en') {
    db.exists(`translate:${msg.id}`, async (err, res) => {
      if (err != null) console.error(err)
      if (res === 1) {
        db.expire(`translate:${msg.id}`, 20 * 60)
        return
      }

      const m = await msg.channel.getMessage(msg.id)
      const tr = await translate(m.content, { from, to }) as { text: string, from: { language: { iso: string } } }
      db.setex(`translate:${msg.id}`, 60 * 30, 'd')
      if (tr.text === m.content) return
      msg.channel.createMessage({
        embed: {
          author: {
            name: m.author.username,
            icon_url: m.author.staticAvatarURL
          },
          description: m.content,
          title: tr.text,
          footer: {
            text: `Translated from ${langs[tr.from.language.iso]} to ${langs[to]}.`
          }
        }
      })
    })
  }
}
