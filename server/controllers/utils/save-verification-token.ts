import { getRepository } from 'typeorm'
import { VerificationToken, VerificationTokenType } from '../../entities'
export async function saveVerificationToken(id, token, type = VerificationTokenType.ACTIVATION) {
  const verificationRepo = getRepository(VerificationToken)
  return await verificationRepo.save({
    userId: id,
    token,
    type
  })
}
