import redis from 'redis'

let db: redis.RedisClient

export function init () {
  db = redis.createClient(process.env.redisPath || '/var/redis/run/redis.sock', {
    retry_strategy: opt => { if (opt.attempt > 10) process.exit() },
    socket_initial_delay: 5000
  })
  db.on('error', err => console.error(err))
}

export default {
  set (key: string, value: string, cb?: redis.Callback<'OK'>): boolean | undefined {
    if (db != null) {
      return db.set(key, value, cb)
    }
  },
  setF (key: string, value: string, flag: string, cb?: redis.Callback<'OK'>): boolean | undefined {
    if (db != null) {
      return db.set(key, value, flag, cb)
    }
  },
  del (key: string, ...keys: string[]): boolean | undefined {
    if (db != null) {
      return db.del([key, ...keys])
    }
  }
}
