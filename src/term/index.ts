/* eslint-disable no-unused-vars */
import { Client, Message } from 'eris'
/* eslint-enable no-unused-vars */
import { exec, register, deregister } from './manager'
import { parser } from './parser'

export default {
  register,
  deregister,
  setup
}

function setup (srv: Client) {
  const parse = parser({
    prefix: ['🤠', 'go-go-gadget', '☭', 'cowbot would you please']
  })

  srv.on('messageCreate', async (message: Message) => {
    const { channel, content, author } = message
    const commandData = { ...parse(content), message }

    // if valid command
    if (commandData?.prefix != null && commandData?.prefix !== '') {

      const reply = channel.createMessage.bind(channel)
      const dmch = await author.getDMChannel()
      const dm = dmch.createMessage.bind(dmch)

      exec(commandData, reply, dm)
    }
  })
}
