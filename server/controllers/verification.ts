import { sendEmail } from '@things-factory/email-base'
import { getRepository } from 'typeorm'
import { URL } from 'url'
import { User, UserStatus, VerificationToken } from '../entities'
import { getVerificationEmailForm } from '../templates/verification-email'
import { makeVerificationToken } from './utils/make-verification-token'
import { saveVerificationToken } from './utils/save-verification-token'

export async function sendVerificationEmail({ user, context }) {
  try {
    var token = makeVerificationToken()
    var verifaction = await saveVerificationToken(user.id, token)

    if (verifaction) {
      var serviceUrl = new URL(`/verify/${token}`, context.header.referer)
      await sendEmail({
        sender: 'no-reply@hatiolab.com',
        receiver: user.email,
        subject: 'Verify your email',
        content: getVerificationEmailForm({
          name: user.name,
          verifyUrl: serviceUrl
        })
      })

      return true
    }
  } catch (e) {
    return false
  }
}

export async function verify(token) {
  var { userId } = await getRepository(VerificationToken).findOne({
    where: {
      token
    }
  })

  if (!userId) return false

  var userInfo = await getRepository(User).findOne(userId)
  if (!userInfo) return false
  if (!(userInfo.status == UserStatus.INACTIVE || userInfo.status == UserStatus.LOCKED)) return false

  userInfo.status = UserStatus.ACTIVATED
  await getRepository(User).save(userInfo)
  await getRepository(VerificationToken).delete({
    userId
  })

  return true
}

export async function resendVerificationEmail(email, context) {
  var user = await getRepository(User).findOne({
    where: {
      email
    }
  })

  if (!user) return false
  if (user.status == UserStatus.ACTIVATED) return false

  return await sendVerificationEmail({
    user,
    context
  })
}
