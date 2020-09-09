const logging = true

const level = 1;

export default function log(message: any, priority: number = 1) {
  if (logging && priority >= level) {
    console.log(message)
    return
  }
}