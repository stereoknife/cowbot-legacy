import fs = require('fs')

const STX = '\x02'
const EOT = '\x03'

export interface Branch {
  value: number,
  children: {
    [key: string]: Branch
  }
}

export function populate (tree: Branch, message: string, filename: string) {
  const arr = parse(message)
  for (let i = 0; i < arr.length - 2; i++) {
    append(tree, arr[i], arr[i + 1], arr[i + 2])
  }
  writeOut(tree, filename)
}

export function talk (tree: Branch): string {
  let first = next(tree, STX)
  let second = next(tree, STX, first)
  const out: string[] = [first]
  while (second !== EOT) {
    out.push(second)
    const n = next(tree, first, second)
    first = second
    second = n
  }
  return out.join(' ')
}

function parse (message: string): string[] {
  return [STX, ...message.split(' '), EOT]
}

function append (branch: Branch, ...add: string[]): Branch {
  let b = branch
  add.forEach(word => {
    if (!b.children[word]) b.children[word] = { value: 0, children: {} }
    b.children[word].value++
    b = b.children[word]
  })
  return b
}

function next (tree: Branch, ...words: string[]): string {
  const l = last(tree, words)
  const options = Object.keys(l.children)
  let weighted: string[] = []
  options.forEach(option => {
    weighted = [...weighted, ...Array(l.children[option].value).fill(option)]
  })
  return options[Math.floor(Math.random() * options.length)]
}

function last (tree: Branch, words: string[]): Branch {
  let last = tree
  words.forEach((word, i) => {
    last = last.children[word]
    if (!last) throw new Error(`Word ${word} at index ${i} doesn't exist`)
  })
  return last
}

function writeOut (tree: Branch, filename: string) {
  const out = JSON.stringify(tree, (key, value) => typeof value === 'object' && Object.keys(value).length === 0 ? undefined : value)
  fs.writeFile('./trees/' + filename + '.json', out, (err) => { if (err) throw err })
}
