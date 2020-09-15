/* eslint-disable no-unused-vars */
import type { CommandData } from '../term/manager'
/* eslint-enable no-unused-vars */

import { Severity } from '@sentry/node'
import command from '../term'
import log from '../logging'
// mport db from '../db'

const db: any = {}

export default {
  install () {
    command.register(['remember'], remember)
    command.register(['forget'], forget)
    command.register(['linegoesdown'], (_, rp) => rp('https://twitter.com/moarajuliana/status/1252318965864464387'))
    command.register(['brrr'], (_, rp) => rp('https://www.youtube.com/watch?v=RUw6WKIrqmw'))
    command.register(['linegoesup'], (_, rp) => rp('https://www.youtube.com/watch?v=M5FGuBatbTg'))
  }
}

function remember ({ args, message }: CommandData, reply: any) {
  const name = args.shift()
  const str = args.join(' ')
  if (name == null || str == null) return

  log(Severity.Log, `Remembering message "${str}" at entry "${name}"`)
  db.set(name, str, 'nx')
  command.register([name], (_, rp) => rp(args.join(' ')))
  reply('ok')
}

function forget ({ args, message }: CommandData, reply: any) {
  const name = args.shift()
  if (name == null) return
  log(Severity.Log, `Forgetting message at entry "${name}"`)
  db.del(name)
  command.deregister(name)
  reply('i forgot')
}
