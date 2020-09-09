/* eslint-disable no-unused-vars */
import type { Client, Message, Emoji } from 'eris'
/* eslint-enable no-unused-vars */

type emfn = (emoji: Emoji, message: Message, reply: any, dm: any) => void | Promise<void>

const reactions: Map<string, emfn> = new Map()

export default {
  register,
  deregister,
  setup
}

export function setup (bot: Client) {
  bot.on('messageReactionAdd', async (uncachedMsg, emoji, user) => {
    if (!reactions.has(emoji.name)) return

    const message = ((uncachedMsg as Message).content == null)
      ? await bot.getMessage(uncachedMsg.channel.id, uncachedMsg.id)
      : uncachedMsg as Message

    const reply = message.channel.createMessage.bind(message.channel)
    const dmch = await bot.getDMChannel(user)
    const dm = dmch.createMessage.bind(dmch)

    const exec = reactions.get(emoji.name)
    if (exec != null) exec(emoji, message, reply, dm)
  })
}

function register (e: string, fn: emfn) {
  if (reactions.has(e)) return
  reactions.set(e, fn)
}

function deregister () {

}
