import { register } from "./commanding";
import axios from "axios";
import { translate } from 'google-translate-api-browser'
import langs from 'google-translate-api-browser/dist/languages'
import log from './logging'

export function init() {
  const yturl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&key=AIzaSyAMTINdBOQCIE0ArDVVED2Ia5f0zwpIi1w&q='

  register(['clap'], ({ args }, reply) => reply(args.join('👏') + '👏'))

  register(['bless'], (_, reply) => {
    axios.get('http://labs.bible.org/api/?passage=random&type=json')
      .then((res) => {
        if (res.status < 200 || res.status > 300) return
        const { bookname, chapter, verse, text } = res.data[0]
        reply(`**${bookname} ${chapter}:${verse}** ${text}`)
      })
      .catch(e => log(e))
  })

  register(['yt', 'youtube'], ({ args }, reply) => {
    axios.get(yturl + encodeURIComponent(args.join(' ')))
      .then((res) => {
        if (res.status < 200 || res.status > 300) return
        try {
          const id = JSON.parse(res.data).items[0].id.videoId
          console.log(id)
          if (id) reply(`https://youtube.com/watch?v=${id}`)
        } catch (err) {
          console.log(err)
        }
      })
      .catch(e => log(e))
  })

  register(['t', 'translate'], ({ args, flags }, reply) => {
    const msg = args.join(' ')
    const from = flags.from ?? 'auto'
    const to = flags.to ?? 'en'
    translate(msg, { from, to })
      .then((tr: any) => {
        reply({
          embed: {
            description: msg,
            title: tr.text,
            footer: {
              text: `Translated from ${langs[tr.from.language.iso]} to ${langs[to]}.`
            }
          }
        })
      })
      .catch(e => {
        log(e)
      })
  })
}