/* eslint-disable no-unused-vars */
import type { ParseData } from '../term/parser'
/* eslint-enable no-unused-vars */

import command from '../term'
import axios from 'axios'
import log from '../logging'

export default {
  install () {
    command.register(['clap'], clap)
    command.register(['bless'], bless)
    command.register(['youtube', 'yt'], youtube)
  }
}

function clap ({ args }: ParseData, reply: any) { reply(args.join('👏') + '👏') }

function bless (_: ParseData, reply: any) {
  log('calling bless api', 1)
  axios.get('http://labs.bible.org/api/?passage=random&type=json')
    .then((res) => {
      log('response from bless api', 1)
      if (res.status < 200 || res.status > 300) return
      const { bookname, chapter, verse, text } = res.data[0]
      reply(`**${bookname} ${chapter}:${verse}** ${text}`)
    })
    .catch(e => log(e))
}

const yturl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&key=AIzaSyAMTINdBOQCIE0ArDVVED2Ia5f0zwpIi1w&q='
function youtube ({ args }: ParseData, reply: any) {
  axios.get(yturl + encodeURIComponent(args.join(' ')))
    .then((res) => {
      if (res.status < 200 || res.status > 300) return
      const id = res.data.items[0].id.videoId
      if (id != null) reply(`https://youtube.com/watch?v=${id}`)
    })
    .catch(e => log(e))
}
