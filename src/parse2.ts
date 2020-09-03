import { words } from 'lodash/fp'

export type parseData = {
  prefix: string
  name: string,
  args: string[],
  flags: {[key: string]: any}
} | null

export type Parser = {
  data: parseData,
  input: string,
  chain: (f: (data: parseData, input: string) => Parser) => Parser
}

export type FlagRules = {
  [key: string]: boolean
}

function makeParser(data: parseData, input?: string): Parser {
  return {
    data: data,
    input: input ?? '',
    chain: (f) => f(data, input ?? '')
  }
}

const emptyData = {
  name: '',
  prefix: '',
  args: [],
  flags: {}
}

export function parser(pref: RegExp, flagRules: {}) {
  return (input: string) => {
    const { data } =
      makeParser({...emptyData}, input)
        .chain(extractPrefix(pref))
        .chain(extractCommand)
        .chain(extractFlags(flagRules))
        .chain(extractArgs)
    return data
  }
}

function extractPrefix(prx: RegExp): (data: parseData, input: string) => Parser {
  return (data: parseData, input: string): Parser => {
    if (data == null || input == null) return makeParser(null)

    const rgxm = input.match(prx)
    if (rgxm == null || rgxm.length < 2) return makeParser(null)

    data.prefix = rgxm[1]

    return makeParser(data, input.slice(data.prefix.length))
  }
}

function extractCommand(data: parseData, input: string): Parser {
  if (data == null) return makeParser(null)

  const w = words(input)
  const c = w.shift()

  if (c == null) return makeParser(null)

  data.name = c

  return makeParser(data, w.join(' '))
}

function extractFlags(flagRules: FlagRules): (data: parseData, input: string) => Parser {
  return (data: parseData, input: string) => {
    if (data == null) return makeParser(null)

    const ws = words(input)
    const out: string[] = []

    for (let i = 0; i < ws.length; i++) {
      const w = ws[i];
      if (w.match(/^--/)) {
        if (flagRules[w] != null) {
          data.flags[w] = flagRules[w] ? ws[++i] : true
          continue
        }
      }
      out.push(w)
    }
    return makeParser(data, out.join(' '))
  }
}

function extractArgs(data: parseData, input: string): Parser {
  if (data == null) return makeParser(null)
  data.args = words(input)
  return makeParser(data)
}