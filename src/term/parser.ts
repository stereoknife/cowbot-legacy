import log from '../logging'
import { Severity } from '@sentry/node'

export type ParseData = {
  prefix: string
  name: string,
  args: string[],
  flags: {[key: string]: any}
}

export type parserOptions = {
  prefix: string[]
}

export function parser (opt: parserOptions): (input: string) => ParseData {
  return (input: string) =>
    makeChain({}, input)
      .chain(extractPrefix(opt.prefix))
      .chain(extractCommand)
      .chain(extractFlags)
      .chain(extractArgs)
      .parse()
}

type NullableParseData = {
  prefix?: string
  name?: string,
  args?: string[],
  flags?: {[key: string]: any}
}

type ParserChain = {
  parse: () => ParseData
  chain: (f: (input: string) => ParserOut) => ParserChain
}

type ParserOut = [NullableParseData, string]

function makeChain (data: NullableParseData | null, input: string): ParserChain {
  return {
    parse: () => {
      if (data == null) data = {}
      if (data.prefix == null) data.prefix = ''
      if (data.name == null) data.prefix = ''
      if (data.flags == null) data.flags = {}
      if (data.args == null) data.args = []
      return data as ParseData
    },
    chain: (p) => {
      const [out, rest] = p(input) ?? [null, '']
      return makeChain({ ...data, ...out }, rest)
    }
  }
}

function extractPrefix (pref: string[]): (input: string) => ParserOut {
  return (input: string) => {
    const prefix = input.match(new RegExp(`^(${pref.join('|')})`))?.[1]
    return [{ prefix }, input.slice(prefix?.length ?? 0)]
  }
}

function extractCommand (input: string): ParserOut {
  const w = words(input)
  const name = w.shift()
  return [{ name }, w.join(' ')]
}

function extractFlags (input: string): ParserOut {
  const ws = words(input)
  const out: string[] = []
  const flags: { [key: string]: string } = {}

  for (let i = 0; i < ws.length; i++) {
    const w = ws[i]
    if (w.match(/^--/)) {
      flags[w] = ws[++i]
    } else {
      out.push(w)
    }
  }
  return [{ flags }, out.join(' ')]
}

function extractArgs (input: string): ParserOut {
  return [{ args: words(input) ?? '' }, '']
}

function words (input: string): string[] {
  return [...input.matchAll(/([^\s]+)|"([^"]+)"/g)]
    .map(match => match[1] ?? match[2])
}
