import Log from './model'

const log = async (method = 'controller', error, message, header = '', url = '') => {
  if (error.status === 404) return null
  await Log.create({
    method, error, message, header, url,
  })
  return true
}

export default log
