import redis from 'redis'

let db: redis.RedisClient

export function init() {
  redis.createClient(process.env.redisPath || '/var/redis/run/redis.sock', {
    retry_strategy: opt => { if (opt.attempt > 10) process.exit() },
    socket_initial_delay: 5000
  })
  db.on('error', err => console.error(err))
}