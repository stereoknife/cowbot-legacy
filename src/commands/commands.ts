/* eslint-disable no-unused-vars */
import type { RedisClient } from 'redis'
import type { CommandClient } from 'eris'
import https from 'https'
import axios from 'axios'
import { translate } from 'google-translate-api-browser'
import langs from 'google-translate-api-browser/dist/languages'
/* eslint-enable no-unused-vars */

const emojiScrapeRegex = /<ol class="search-results">[^]*?<h2>[^]*?<span class="emoji">(.)*<\/span>[^]*?<\/ol>/u

export function loadCommands (bot: CommandClient, db: RedisClient) {
  // Simple commands
  bot.registerCommand('echo', (_, args) => args.join(' '), {
    aliases: ['e', '💬']
  })

  bot.registerCommand('clapback', (_, args) => args.join('👏') + '👏', {
    aliases: ['clap', 'c', '👏']
  })

  bot.registerCommand('linegoesdown', 'https://twitter.com/moarajuliana/status/1252318965864464387', {
    aliases: ['📉']
  })

  bot.registerCommand('dollarmachinegoesbrr', 'https://twitter.com/NorthernForger/status/1252412693274755074', {
    aliases: ['🤑']
  })

  bot.registerCommand('linegoesup', 'https://www.youtube.com/watch?v=M5FGuBatbTg', {
    aliases: ['📈']
  })

  // Complex commands
  bot.registerCommand('yee', (msg) => {
    db.zrevrange(`highlights:${msg.channel}`, 0, 1, async (err, res) => {
      if (err) console.error(err)
      if (res == null) return 'no messages saved in this channel'
      const found = await msg.channel.getMessage(res[0])
      msg.channel.createMessage(found.content)
    })
  }, {
    aliases: ['y', '🤠']
  })

  bot.registerCommand('bless', (msg, args) => {
    axios.get('http://labs.bible.org/api/?passage=random&type=json')
      .then((res) => {
        if (res.status < 200 || res.status > 300) return
        const { bookname, chapter, verse, text } = res.data[0]
        msg.channel.createMessage(`**${bookname} ${chapter}:${verse}** ${text}`)
      })
  }, {
    aliases: ['b', '🙏']
  })

  bot.registerCommand('translate', async (msg, args) => {
    const from = 'auto'
    const to = 'en'
    const tr = await translate(args.join(' '), { from, to }) as { text: string, from: { language: { iso: string } } }
    msg.channel.createMessage({
      embed: {
        author: {
          name: msg.author.username,
          icon_url: msg.author.staticAvatarURL
        },
        description: msg.content,
        title: tr.text,
        footer: {
          text: `Translated from ${langs[tr.from.language.iso]} to ${langs[to]}.`
        }
      }
    })
  }, {
    aliases: ['t', '🔣']
  })

  const yturl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&key=AIzaSyAMTINdBOQCIE0ArDVVED2Ia5f0zwpIi1w&q='

  bot.registerCommand('youtube', (msg, args) => {
    https.get(yturl + encodeURIComponent(args.join(' ')), res => {
      const { statusCode } = res
      if (!statusCode || statusCode < 200 || statusCode >= 300) return

      res.setEncoding('utf8')
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        try {
          const id = JSON.parse(data).items[0].id.videoId
          console.log(id)
          if (id) msg.channel.createMessage(`https://youtube.com/watch?v=${id}`)
        } catch (err) {
          console.log(err)
        }
      })
    })
  }, {
    aliases: ['yt', '📺']
  })
}

// TODO colours
// TODO doot
// TODO skell

function emojify (word: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get('https://emojipedia.org/search/?q=' + word, res => {
      const { statusCode } = res
      if (!statusCode || statusCode < 200 || statusCode >= 300) resolve(' ' + word + ' ')

      res.setEncoding('utf8')
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        const match = data.match(emojiScrapeRegex)
        resolve(match ? match[1] : ' ' + word + ' ')
      })
    })
  })
}
