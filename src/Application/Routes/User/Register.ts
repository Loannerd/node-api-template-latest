import { Container } from "typedi"
import { RouteOptions } from "@/Vendor/Entities/Server"
import { ParseBearerToken, ValidateToken, HasRole } from "@/Vendor/Middleware"
import {
  UserController,
  RegisterUserSchema,
  IRegisterUser,
} from "@/Domain/User"

export const Register: RouteOptions = {
  url: "/users/register",
  method: "POST",
  preValidation: [ParseBearerToken, ValidateToken, HasRole("admin")],
  schema: {
    body: RegisterUserSchema,
  },
  handler: async (req) => {
    const userController = Container.get(UserController)

    /* TODO: send email to user with instructions to set a password */
    const user = await userController.registerUser(req.body as IRegisterUser)

    return {
      message: "user registered successfully",
      user,
    }
  },
}
