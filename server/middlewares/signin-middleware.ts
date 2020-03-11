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

        //Find the user associated with the email provided by the user
        // const userRepo = getRepository(User)
        // const user = await userRepo.findOne({ email })
        // if (!user) {
        //   //If the user isn't found in the database, return a message
        //   return done(null, false, { message: 'User not found' })
        // }
        // //Validate password and make sure it matches with the corresponding hash stored in the database
        // //If the passwords match, it returns a value of true.
        // const validate = await user.verify(password)
        // if (!validate) {
        //   return done(null, false, { message: 'Wrong Password' })
        // }
        // //Send the user information to the next middleware
        // return done(null, user, { message: 'Logged in Successfully' })
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

        const { user: userInfo, token, domains } = user

        const redirectTo = user.redirect_to || (await getDefaultDomain(userInfo))

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
        resolve()
        // req.login(user, { session: false }, async error => {
        //   if (error) return next(error)
        //   //We don't want to store the sensitive information such as the
        //   //user password in the token so we pick only the email and id
        //   const body = { _id: user._id, email: user.email }
        //   //Sign the JWT token and populate the payload with the user email and id
        //   // const token = jwt.sign({ user : body },'top_secret');
        //   //Send back the token to the user
        //   // return res.json({ token });
        //   return (context.body = {
        //     token: 'hhh'
        //   })
        // })
      } catch (error) {
        return next(error)
      }
    })(req, res, next)
  })
}
