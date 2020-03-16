import { config } from '@things-factory/env'
import passport from 'passport'
import { ExtractJwt, Strategy as JWTstrategy } from 'passport-jwt'
import { User } from '../entities'
const SECRET = config.get('SECRET', '0xD58F835B69D207A76CC5F84a70a1D0d4C79dAC95')
passport.use(
  new JWTstrategy(
    {
      //secret we used to sign our JWT
      secretOrKey: SECRET,
      //we expect the user to send the token as a query parameter with the name 'secret_token'
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromHeader('authorization'),
        ExtractJwt.fromHeader('x-access-token'),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('access_token'),
        ExtractJwt.fromBodyField('access_token'),
        req => {
          var token = null
          token = req?.ctx?.cookies?.get('access_token')
          return token
        }
      ])
    },
    async (token, done) => {
      try {
        //Pass the user details to the next middleware
        return done(null, token)
      } catch (error) {
        return done(error)
      }
    }
  )
)

export async function jwtAuthenticateMiddleware(context, next) {
  return passport.authenticate('jwt', { session: false }, async (err, user, info) => {
    if (err || !user) {
      context.state.error = err
      // if (context.header['sec-fetch-mode'] && context.header['sec-fetch-mode'] != 'navigate') {
      //   context.throw(401, {
      //     success: false,
      //     message: error.message
      //   })
      // }

      await next()
    } else {
      try {
        const userEntity = await User.checkAuth(user)
        context.state.user = userEntity
      } catch (e) {
      } finally {
        await next()
      }
    }
  })(context, next)
}
