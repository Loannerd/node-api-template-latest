import { Done, Request, Reply } from "@/Infra/HTTP/Server"
import { AuthException } from "@/Application/Exceptions"

export const ParseBearerToken = (req: Request, _reply: Reply, done: Done) => {
  const header = req.headers["authorization"]

  if (!header) {
    done(AuthException("please provide bearer token"))
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, token] = header.split(" ")

  if (!token) {
    done(AuthException("invalid bearer token"))
    return
  }

  req.requestContext.set("token", token)
  done()
}