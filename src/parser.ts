// Command:
// Channel/Author scope
// Command
// Subcommands
// Flags
// Arguments

import { Message, ClientOptions, Client, MessageContent } from "eris"
import { debug } from "console"

enum token_types {
  prefix,
  flag,
  shortFlag,
  argument
}

type Command = {
  flags: { [key: string]: Flag },
  checkPermission: (author: string, channel: string) => boolean
  exec: CommandExecFn,
  meta: { [key: string]: any}
}
type CommandExecFn = (
  data: {
    message: Message,
    args: string[],
    flags: { [key: string]: string | number | boolean },
    meta: { [key:string]: any }
  }, 
  reply: (content: MessageContent) => void) => void | string

type Flag = {
  name: string,
  long: string,
  short: string,
  type: 'bool' | 'number' | 'string'
}

type ConstructorOptions = ClientOptions & {
  prefix: string[]
}

type CommandOpts = {
  checkPermission?: (author: string, channel: string) => boolean
  meta?: { [key: string]: any}
}

export class ComClient extends Client {
  commands: { [key: string]: Command }
  prefix: string[]
  prefixrx: RegExp

  constructor (token: string, opts?: ConstructorOptions) {
    super(token, opts)
    this.prefix = opts?.prefix ?? []
    this.commands = {}
    this.prefixrx = new RegExp(`^${this.prefix.join('|')}`, 'g')
    this.on('messageCreate', this.HandleMessages)
  }

  RegisterCommand (identifier: string | string[], exec: CommandExecFn, opts: CommandOpts = {}): Command {
    if (!Array.isArray(identifier)) identifier = [identifier]
    const com = {
      flags: {},
      checkPermission: opts.checkPermission ?? (() => true),
      exec,
      meta: opts.meta ?? {}
    }
    identifier.forEach(id => {
      this.commands[id] = com
    });
    return com
  }

  HandleMessages (this: ComClient, message: Message) {
    const { author, channel } = message
    // Set author, channel context
    // Do context stuff
    
    // Check prefix and remove it
    const prefix = message.content.match(this.prefixrx)?.shift()
    const content = message.content.slice(prefix?.length)

    // Separate words
    const tokens = content.match(/".*"|[^\s]+/g) ?? []
    
    // Handle message
    if (prefix != null && prefix.length > 0) {
      const commandName = tokens.shift()
      const command = commandName ? this.commands[commandName] : undefined
      if (commandName == null || commandName.length === 0 || command == null) return
      if (!command.checkPermission(author.id, channel.id)) return
  
      const args = []
      const flags: { [key: string]: string | number | boolean } = {}
  
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]
        const flagMap = {
          string: () => tokens[i++],
          number: () => Number.parseFloat(tokens[i++]),
          bool: () => true
        }
  
        if (token.startsWith('--')) {
          // Check flag exists and add it to list
          const flag = command?.flags[token] ?? undefined
          if (flag != null) {
            flags[flag.name] = flagMap[flag.type]()
            continue
          }
        } else if (token.startsWith('-')) {
          // Iterate through characters, ignore first (-)
          // Check flag exists and add it to list
          const chars = token.split('')
          for (let j = 1; j < chars.length; j++) {
            const flag = command?.flags[chars[j]] ?? undefined
            if (flag != null) {
              if (flag.type !== 'bool' && chars.length > 2) throw new Error ('Tried to use flag with argument in combined shortcut form')
              flags[flag.name] = flagMap[flag.type]()
              continue
            }
          }
        }
        args.push(token)
      }
  
      // Do the thing
      const reply = command.exec({ message, args, flags, meta: command.meta }, channel.createMessage.bind(channel))
      if (reply) channel.createMessage(reply)
    }
  }

}