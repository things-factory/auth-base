import passport from 'passport'
import { Strategy as localStrategy } from 'passport-local'
import { MAX_AGE } from '../constants/max-age'
import { getDefaultDomain } from '../utils/default-domain'
import { signin } from '../controllers/signin'

passport.use(
  'signin',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const { user: userInfo, token, domains } = await signin({
          email,
          password
        })

        return done(
          null,
          {
            user: userInfo,
            token,
            domains
          },
          { message: 'Logged in Successfully' }
        )
      } catch (error) {
        return done(error)
      }
    }
  )
)

export async function signinMiddleware(context, next) {
  return new Promise((resolve, reject) => {
    const { request: req, response: res, secure } = context
    passport.authenticate('signin', async (err, user, info) => {
      try {
        if (err || !user) {
          const error = new Error('An Error occurred')
          return reject(next(error))
        }

        const reqBody = req.body
        const { user: userInfo, token, domains } = user

        const redirectTo = reqBody.redirect_to || (await getDefaultDomain(userInfo))

        let responseObj = {
          message: 'signin successfully',
          token,
          domains
        }

        context.cookies.set('access_token', token, {
          secure,
          httpOnly: true,
          maxAge: MAX_AGE
        })

        context.redirect(redirectTo)
        resolve(next())
      } catch (error) {
        return next(error)
      }
    })(req, res, next)
  })
}
