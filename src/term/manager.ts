import type { Message } from 'eris'
import type { ParseData } from './parser'
import log from '../logging'

export type CommandData = ParseData & { message: Message }

type Command = (data: CommandData, reply: any, dm: any) => void

type CommandOps = {
  alias: string[],
  denyUsers: string[] | null,
  allowUsers: string[] | null,
  denyGuilds: string[] | null,
  allowGuilds: string[] | null
}

const emptyOpts = {
  alias: [],
  denyUsers: null,
  allowUsers: null,
  denyGuilds: null,
  allowGuilds: null
}

const aliasMap = new Map()
const commandMap = new Map()

export function register (names: string[], cmd: Command) {
  if (names.length === 0) return
  const id = names.shift()
  names.forEach(alias => {
    aliasMap.set(alias, id)
  })
  commandMap.set(id, cmd)
}

export function deregister (name: string) {
  if (commandMap.has(name)) {
    commandMap.delete(name)
  }
}

export function exec (data: CommandData, publicReply: any, privateReply: any) {
  log('executing ' + data.name)
  const id = findAlias(data.name) ?? data.name
  const comm = findCommand(id)
  if (comm != null) {
    comm(data, publicReply, privateReply)
  }
}

function loadCommand (id: string, db: any) {
  const op = { ...emptyOpts }
  op.alias = db[`${id}:alias`]
  op.denyUsers = db[`${id}:denyusers`]
  op.allowUsers = db[`${id}:allowusers`]
  op.denyGuilds = db[`${id}:denyguilds`]
  op.allowGuilds = db[`${id}:allowguilds`]
  return op
}

function findAlias (alias: string | undefined): string | undefined {
  if (alias == null) return undefined
  for (const [key, value] of aliasMap) {
    if (key === alias) return value
  }
  return undefined
}

function findCommand (id: string | undefined): Command | undefined {
  if (id == null) return undefined
  return commandMap.get(id)
}
