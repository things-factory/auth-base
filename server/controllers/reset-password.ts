import { sendEmail } from '@things-factory/email-base'
import { getRepository } from 'typeorm'
import { URL } from 'url'
import { User, UserStatus, VerificationToken, VerificationTokenType } from '../entities'
import { getResetPasswordEmailForm } from '../templates/reset-password-email'
import { makeVerificationToken } from './utils/make-verification-token'
import { saveVerificationToken } from './utils/save-verification-token'

export async function sendPasswordResetEmail({ user, context }) {
  try {
    var token = makeVerificationToken()
    var verifaction = await saveVerificationToken(user.id, token, VerificationTokenType.PASSWORD_RESET)

    if (verifaction) {
      var serviceUrl = new URL(`/reset-password?token=${token}`, context.header.referer)
      await sendEmail({
        sender: 'no-reply@hatiolab.com',
        receiver: user.email,
        subject: 'Reset your password',
        content: getResetPasswordEmailForm({
          name: user.name,
          resetUrl: serviceUrl
        })
      })

      return true
    }
  } catch (e) {
    return false
  }
}

export async function resetPassword(token, password) {
  const user = await getRepository(VerificationToken).findOne({
    where: {
      token,
      type: VerificationTokenType.PASSWORD_RESET
    }
  })

  if (!user) return false
  const { userId } = user
  if (!userId) return false

  var userInfo = await getRepository(User).findOne(userId)
  if (!userInfo) return false
  if (userInfo.status == UserStatus.INACTIVE) return false

  userInfo.password = User.encode(password)

  await getRepository(User).save(userInfo)
  await getRepository(VerificationToken).delete({
    userId,
    token,
    type: VerificationTokenType.PASSWORD_RESET
  })

  return true
}
