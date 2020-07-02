/* eslint-disable no-unused-vars */
import type { RedisClient } from 'redis'
import https from 'https'
import axios from 'axios'
import { translate } from 'google-translate-api-browser'
import langs from 'google-translate-api-browser/dist/languages'
import { ComClient } from '../parser'

/* eslint-enable no-unused-vars */
const emojiScrapeRegex = /<ol class="search-results">[^]*?<h2>[^]*?<span class="emoji">(.)*<\/span>[^]*?<\/ol>/u

export function loadCommands (bot: ComClient, db: RedisClient) {

  // Simple commands
  bot.registerCommand(['clapback','clap', 'c', '👏'], ({ args }) => args.join('👏') + '👏')

  bot.registerCommand(['linegoesdown', '📉'], (_, reply) => reply('https://twitter.com/moarajuliana/status/1252318965864464387'))

  bot.registerCommand(['dollarmachinegoesbrr', '🤑'], (_, reply) => reply('https://www.youtube.com/watch?v=RUw6WKIrqmw'))

  bot.registerCommand(['linegoesup', '📈'], (_, reply) => reply('https://www.youtube.com/watch?v=M5FGuBatbTg'))

  // Complex commands
  bot.registerCommand(['remember'], ({ message, args }) => {
    if (args.length < 2) return
    const name = args.shift()
    if (name == null) return
    bot.registerCommand(name, (_, reply) => {
      reply(args.join(' '))
    }, { meta: { createdBy: message.author.id } })
    return 'Saved!'
  })

  bot.registerCommand(['forget'], ({ message, args }) => {
    const command = bot.commands[args[0]]
    if (command == null) return
    if (command.meta.createdBy !== message.author.id) return "can't delete someone else's command >:("
    delete bot.commands[args[0]]
    return 'Forgotten!'
  })

  bot.registerCommand(['yee', '🤠'], ({ message }) => {
    db.zrevrange(`highlights:${message.channel}`, 0, 1, async (err, res) => {
      if (err) console.error(err)
      if (res == null) return 'no messages saved in this channel'
      const found = await message.channel.getMessage(res[0])
      message.channel.createMessage(found.content)
    })
  })

  bot.registerCommand(['bless', 'b', '🙏'], ({ message }) => {
    axios.get('http://labs.bible.org/api/?passage=random&type=json')
      .then((res) => {
        if (res.status < 200 || res.status > 300) return
        const { bookname, chapter, verse, text } = res.data[0]
        message.channel.createMessage(`**${bookname} ${chapter}:${verse}** ${text}`)
      })
  })

  // bot.RegisterCommand('cbt', (msg) => {
  //   db.srandmember('cbt', (err, res) => {
  //     if (err) return console.error(err)
  //     if (res) msg.channel.createMessage(res)
  //   })
  // }).registerSubcommand('load', (msg, args) => {
  //   const total = parseInt(args[0]) || 1000
  //   ;(function fetch (rest: number, id: string): void {
  //     msg.channel.getMessages(rest > 100 ? 100 : rest, id)
  //       .then(batch => {
  //         batch.forEach(m => {
  //           if (/CBT/i.test(m.content)) db.sadd(m.content)
  //         })
  //         rest -= batch.length
  //         if (rest > 0) {
  //           id = batch[batch.length - 1].id
  //           fetch(rest, id)
  //         } else msg.channel.createMessage('done')
  //       })
  //       .catch(console.error)
  //   })(total, msg.id)
  // })

  // bot.RegisterCommand('tick-my-toe', (msg, args) => {
  //   if (args[0] == null) return 'You must specify an oponent to challenge'
  //   const opponent = msg.mentions[0]
  //   // const game = new tictactoe(msg.author.username, opponent.username)
  // }, {
  //   hidden: true
  // })

  // bot.RegisterCommand('turnip', (msg, args) => {
  // }, {
  //   aliases: ['nap', 'turnips', 'naps', 'n', '💸'],
  //   hidden: true
  // })
  //   .registerSubcommand('price', (msg, args) => {
  //     return '0'
  //   })
  //   .registerSubcommand('buy', (msg, args) => {
  //     console.log('hi')
  //   })
  //   .registerSubcommand('buy', (msg, args) => {
  //     console.log('hi')
  //   })

  // bot.RegisterCommand('yeet', (msg, args) => {
  //   const transmission = args.join(' ')
  //   msg.channel.createMessage("you yeet the message, but it doesn't get very far")
  // }, {
  //   aliases: ['y'],
  //   hidden: true
  // })

  bot.registerCommand(['translate', 't', '🔣'], ({ message, args, flags }, reply) => {
    const from = typeof flags.from === 'string' ? flags.from : 'auto'
    const to = typeof flags.to === 'string' ? flags.to : 'en'
    type payload = { text: string, from: { language: { iso: string } } }
    translate(args.join(' '), { from, to })
      .then((tr: {} | { text: string, from: { language: { iso: string } } }) => {
        reply({
          embed: {
            author: {
              name: message.author.username,
              icon_url: message.author.staticAvatarURL
            },
            description: message.content,
            title: (tr as payload).text,
            footer: {
              text: `Translated from ${langs[(tr as payload).from.language.iso]} to ${langs[to]}.`
            }
          }
        })
      })
  })
    .registerFlag('from', 'f', 'string')
    .registerFlag('to', 't', 'string')

  const yturl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&key=AIzaSyAMTINdBOQCIE0ArDVVED2Ia5f0zwpIi1w&q='

  bot.registerCommand(['youtube', 'yt', '📺'], ({ message, args }, reply) => {
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
          if (id) reply(`https://youtube.com/watch?v=${id}`)
        } catch (err) {
          console.log(err)
        }
      })
    })
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
