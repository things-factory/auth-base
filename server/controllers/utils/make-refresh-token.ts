import crypto from 'crypto'
import util from 'util'
import { config } from '@things-factory/env'
const SECRET = config.get('SECRET', '0xD58F835B69D207A76CC5F84a70a1D0d4C79dAC95')
export async function makeRefreshToken(info: Object) {
  const pbkdf2Promise = util.promisify(crypto.pbkdf2)
  const infoJson = JSON.stringify(info)
  try {
    return (await pbkdf2Promise(infoJson, SECRET, Math.floor(Math.random() * 100000), 64, 'sha512')).toString('base64')
  } catch (e) {
    return e
  }
}
