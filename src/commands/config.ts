/* eslint-disable no-unused-vars */
import type { RedisClient } from 'redis'
import https from 'https'
import axios from 'axios'
import { translate } from 'google-translate-api-browser'
import langs from 'google-translate-api-browser/dist/languages'
import { PosixClient, CommandPermissionFn } from '../parser'
import { Command } from 'eris'

/* eslint-enable no-unused-vars */

export type AdminCheck = (author: string, channel: string) => boolean | Promise<boolean>;

const admins: { [key: string]: Set<string> } = {}

export function loadConfig (bot: PosixClient, db: RedisClient) {
  // Load admins
  bot.guilds.forEach(guild => {
    bot.admins[guild.id] = new Set()
    db.smembers(guild.id + '_admins', (err, res) => {
      if (err) throw err
      res.forEach(bot.admins[guild.id].add, bot.admins[guild.id])
    })
  });
}