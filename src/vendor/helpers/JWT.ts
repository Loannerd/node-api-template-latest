import jwt from "jsonwebtoken"

export const JWT = {
  /**
   *  generate a JWT and sign using a secret key
   *
   */
  async generate(
    secret: string,
    payload: Record<string, unknown>,
    expiredInSeconds?: number,
  ): Promise<string> {
    return jwt.sign(payload, secret, { expiresIn: expiredInSeconds })
  },

  /**
   *  check if JWT is valid and extract the payload
   *
   */
  async validate(secret: string, token: string): Promise<unknown> {
    try {
      return jwt.verify(token, secret)
    } catch (err) {
      return
    }
  },
}
