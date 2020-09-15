/* eslint-disable no-unused-vars */
import type { ParseData } from '../term/parser'
import { Message, Emoji } from 'eris'
/* eslint-enable no-unused-vars */

import { Severity } from '@sentry/node'
import command from '../term'
import reaction from '../reactions'
import tr from 'google-translate-api-browser'
import langs from 'google-translate-api-browser/dist/languages'
import log from '../logging'

export default {
  install () {
    command.register(['t', 'translate'], translateFromCommand)
    reaction.registerAdd('🔣', translateFromReaction)
    reaction.registerAdd('🗺️', translateFromReaction)
  },

  uninstall () {
    // deregister(['t', 'translate'])
  }
}

function translateFromCommand ({ args, flags }: ParseData, reply: any) {
  const msg = args.join(' ')
  translate(msg, flags.from, flags.to)
    .then(([text, from, to]) => {
      reply({
        embed: {
          description: msg,
          title: text,
          footer: {
            text: `Translated from ${from} to ${to}.`
          }
        }
      })
    })
    .catch(e => {
      log(Severity.Error, 'Translate from command :: ' + e)
    })
}

async function translateFromReaction ({ name }: Emoji, message: Message, reply: any, dm: any) {
  const [text, from, to] = await translate(message.content, 'auto', name === '🗺️' ? 'random' : 'en')

  if (text === message.content) {
    reply('Nothing to translate..')
  } else {
    reply({
      embed: {
        author: {
          name: message.member?.nick ?? message.author.username,
          icon_url: message.author.staticAvatarURL
        },
        description: `_${message.content}_\n${text}`,
        footer: {
          text: `Translated from ${from} to ${to}`
        }
      }
    })
  }
}

export function translate (msg: string, from: string = 'auto', to: string = 'en'): Promise<[string, string, string]> {
  if (to === 'random') {
    const langKeys = Object.keys(langs)
    const i = Math.floor(Math.random() * langKeys.length)
    to = langKeys[i]
  }

  log(Severity.Log, `Translating from ${from} to ${to}`)

  return tr(msg, { from, to })
    .then((tr: any) => [tr.text, langs[tr.from.language.iso], langs[to]])
}
