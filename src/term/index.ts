/* eslint-disable no-unused-vars */
import { Client, Message } from 'eris'
/* eslint-enable no-unused-vars */
import { exec, register, deregister } from './manager'
import { parser } from './parser'
import log from '../logging'

export default {
  register,
  deregister,
  setup
}

function setup (srv: Client) {
  const parse = parser({
    prefix: ['🤠', 'go-go-gadget', '☭', 'please cowbot would you']
  })

  srv.on('messageCreate', async (message: Message) => {
    const { channel, content, author } = message
    const commandData = { ...parse(content), message }
    log(commandData, 0)

    // if valid command
    if (commandData?.prefix != null && commandData?.prefix !== '') {
      log('valid command found', 1)

      const reply = channel.createMessage.bind(channel)
      const dmch = await author.getDMChannel()
      const dm = dmch.createMessage.bind(dmch)

      exec(commandData, reply, dm)
    }
  })
}
