import { EventEmitter } from 'events'
import log from './logging'
import { Client } from 'eris'

export type Service = {
    id: string
    enabled: boolean
}

const servicesMap: Map<string, Service> = new Map()

const emitter = new EventEmitter()

export function init (bot: Client) {
  bot.on('messageCreate', (msg) => emitter.emit('messageCreate', msg))
  bot.on('messageReactionAdd', (msg) => emitter.emit('messageReactionAdd', msg))
}

export function register (srv: Service) {
  if (!servicesMap.has(srv.id)) {
    log('Registering service ' + srv.id)
    servicesMap.set(srv.id, srv)
  }
}

export function deregister (id: string) {
  if (servicesMap.has(id)) {
    log('Deregistering service ' + id)
    servicesMap.delete(id)
  }
}

export function enable (id: string) {
  if (servicesMap.has(id)) {
    log('Enabling service ' + id)
    const srv = servicesMap.get(id) as Service
    srv.enabled = true
  }
}
