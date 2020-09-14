/* eslint-disable no-unused-vars */
import { Message, Emoji } from 'eris'
/* eslint-enable no-unused-vars */

import reaction from '../reactions'

export default {
  install () {
    reaction.registerRem('🔣', callout)
    reaction.registerRem('🗺️', callout)
  },

  uninstall () {
    // deregister(['t', 'translate'])
  }
}

function callout (emoji: Emoji, message: Message, reply: any, dm: any) {
  message.addReaction(emoji.name ?? emoji.id)
  reply('Ok coward...')
}
