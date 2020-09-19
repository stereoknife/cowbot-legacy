/* eslint-disable no-unused-vars */
import type { Client, Message, Emoji } from 'eris'
import type Eris from 'eris'
/* eslint-enable no-unused-vars */

type emfn = (emoji: Emoji, message: Message, reply: any, dm: any) => void | Promise<void>
type replyfn = (content: Eris.MessageContent, file?: Eris.MessageFile | Eris.MessageFile[] | undefined) => Promise<Message<Eris.TextableChannel>> | void

const addReaction: Map<string, emfn> = new Map()
const remReaction: Map<string, emfn> = new Map()

export default {
  registerAdd,
  registerRem,
  deregister,
  setup
}

export function setup (bot: Client) {
  bot.on('messageReactionAdd', async (uncachedMsg, emoji, user) => {
    let message: Message | undefined,
      reply: replyfn | undefined,
      dm: replyfn | undefined
    try {
      if (!addReaction.has(emoji.name)) return
  
      message = ((uncachedMsg as Message).content == null)
        ? await bot.getMessage(uncachedMsg.channel.id, uncachedMsg.id)
        : uncachedMsg as Message
  
      reply = message.channel.createMessage.bind(message.channel)

      const dmch = await bot.getDMChannel(user)
      dm = dmch.createMessage.bind(dmch)

      const exec = addReaction.get(emoji.name)
      if (exec != null) exec(emoji, message, reply, dm)
    } catch (e) {
      console.log(e)
    } finally {
      if (message == null) return
      if (reply == null) reply = () => {}
      if (dm == null) dm = () => {}

      const exec = addReaction.get(emoji.name)
      if (exec != null) exec(emoji, message, reply, dm)
    }
  })

  bot.on('messageReactionRemove', async (uncachedMsg, emoji, user) => {
    if (!remReaction.has(emoji.name)) return

    const message = ((uncachedMsg as Message).content == null)
      ? await bot.getMessage(uncachedMsg.channel.id, uncachedMsg.id)
      : uncachedMsg as Message

    const reply = message.channel.createMessage.bind(message.channel)
    const dmch = await bot.getDMChannel(user)
    const dm = dmch.createMessage.bind(dmch)

    const exec = remReaction.get(emoji.name)
    if (exec != null) exec(emoji, message, reply, dm)
  })
}

function registerAdd (e: string, fn: emfn) {
  if (addReaction.has(e)) return
  addReaction.set(e, fn)
}

function registerRem (e: string, fn: emfn) {
  if (remReaction.has(e)) return
  remReaction.set(e, fn)
}

function deregister () {

}
