import { getRepository } from 'typeorm'
import { VerificationToken, User } from '../entities'
import crypto from 'crypto'
import { sendEmail } from '@things-factory/email-base'
import { URL } from 'url'
import { getVerificationEmailForm } from '../templates/verification-email'

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

export function makeVerificationToken() {
  return crypto.randomBytes(16).toString('hex')
}

export async function saveVerificationToken(id, token) {
  const verificationRepo = getRepository(VerificationToken)
  return await verificationRepo.save({
    userId: id,
    token
  })
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

  userInfo.activated = true
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
  if (user.activated) return false

  return await sendVerificationEmail({
    user,
    context
  })
}
