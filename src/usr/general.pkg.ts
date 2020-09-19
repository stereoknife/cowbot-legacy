/* eslint-disable no-unused-vars */
import type { ParseData } from '../term/parser'
/* eslint-enable no-unused-vars */
import command from '../term'
import axios from 'axios'
import log from '../logging'
import * as Sentry from '@sentry/node'

export default {
  install () {
    command.register(['clap'], clap)
    command.register(['bless'], bless)
    command.register(['al-bless'], quran)
    command.register(['youtube', 'yt'], youtube)
    initQuran()
  }
}

function clap ({ args }: ParseData, reply: any) { reply(args.join('👏') + '👏') }

function bless (_: ParseData, reply: any) {
  axios.get('http://labs.bible.org/api/?passage=random&type=json')
    .then((res) => {
      if (res.status < 200 || res.status > 300) return
      const { bookname, chapter, verse, text } = res.data[0]
      reply(`**${bookname} ${chapter}:${verse}** ${text}`)
    })
    .catch(Sentry.captureException)
}

const quranIndex: [number, number][] = []
async function initQuran () {
  const res = await axios.get('http://api.quran.com:3000/api/v3/chapters')
  if (res.status < 200 || res.status > 300) return
  const { data } = res
  let startingVerse = 1
  data.chapters.forEach(({ verses_count }: any) => {
    quranIndex.push([startingVerse, verses_count])
    startingVerse += verses_count
  })
}

async function quran (_: ParseData, reply: any) {
  try {
    const chapter = Math.floor(Math.random() * quranIndex.length)
    const [start, run] = quranIndex[chapter]
    const verse = start + Math.floor(Math.random() * run)
    const res = await axios.get(`http://api.quran.com:3000/api/v3/chapters/${chapter + 1}/verses/${verse}/`)
    if (res.status < 200 || res.status > 300) return
    const { verse_key, text_simple } = res.data.verse
    reply(`**${verse_key}**  ${text_simple}`)
  } catch (e) {
    Sentry.captureException(e)
  }
}

const yturl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&key=AIzaSyAMTINdBOQCIE0ArDVVED2Ia5f0zwpIi1w&q='
function youtube ({ args }: ParseData, reply: any) {
  axios.get(yturl + encodeURIComponent(args.join(' ')))
    .then((res) => {
      if (res.status < 200 || res.status > 300) return
      const id = res.data.items[0].id.videoId
      if (id != null) reply(`https://youtube.com/watch?v=${id}`)
    })
    .catch(Sentry.captureException)
}
