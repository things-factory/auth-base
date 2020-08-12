import { config } from '@things-factory/env'

var _SECRET = config.get('SECRET')

if (!_SECRET) {
  if (process.env.NODE_ENV == 'production') {
    throw new TypeError('SECRET key not configured.')
  } else {
    _SECRET = '0xD58F835B69D207A76CC5F84a70a1D0d4C79dAC95'
  }
}

export const SECRET = _SECRET
