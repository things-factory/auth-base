import { sendEmail } from '@things-factory/email-base'
import { getRepository } from 'typeorm'
import { URL } from 'url'
import { User, UserStatus, VerificationToken, VerificationTokenType } from '../entities'
import { getUnlockAccountEmailForm } from '../templates/account-unlock-email'
import { makeVerificationToken } from './utils/make-verification-token'
import { saveVerificationToken } from './utils/save-verification-token'

export async function sendUnlockAccountEmail({ user, context }) {
  try {
    var token = makeVerificationToken()
    var verifaction = await saveVerificationToken(user.id, token, VerificationTokenType.UNLOCK)

    if (verifaction) {
      var serviceUrl = new URL(`/unlock-account?token=${token}`, context.header.referer)
      await sendEmail({
        sender: 'no-reply@hatiolab.com',
        receiver: user.email,
        subject: 'Your account is locked',
        content: getUnlockAccountEmailForm({
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

export async function unlockAccount(token, password) {
  var { userId } = await getRepository(VerificationToken).findOne({
    where: {
      token,
      type: VerificationTokenType.UNLOCK
    }
  })

  if (!userId) return false

  var userInfo = await getRepository(User).findOne(userId)
  if (!userInfo) return false
  if (userInfo.status != UserStatus.LOCKED) return false

  userInfo.status = UserStatus.ACTIVATED
  userInfo.password = User.encode(password)
  userInfo.failCount = 0

  await getRepository(User).save(userInfo)
  await getRepository(VerificationToken).delete({
    userId,
    token,
    type: VerificationTokenType.UNLOCK
  })

  return true
}
