import { appConfig } from "@/app/config"
import { db, Paginated } from "@/core/database"
import { User, UserRole } from "@prisma/client"
import { UpdateUserProfile, CreateUser } from "./user.schema"
import { Password } from "@/core/helpers"

export const UserRepository = {
  async listUsers(page: number = 1, query: string | undefined = undefined): Promise<Paginated<User>> {
    const findCondition = {
      where: {
        email: query ? { startsWith: query } : undefined,
      },
    }

    const [count, users] = await db.$transaction([
      db.user.count(findCondition),
      db.user.findMany({
        ...findCondition,
        skip: appConfig.pagination.perPage * (page - 1),
        take: appConfig.pagination.perPage,
      }),
    ])

    return {
      pages: Math.ceil(count / appConfig.pagination.perPage),
      data: users,
    }
  },
  
  async findById(userId: number): Promise<User | null> {
    return db.user.findUnique({
      where: {
        id: userId,
      },
    })
  },

  async findByEmail(email: string): Promise<User | null> {
    return db.user.findFirst({
      where: { email },
    })
  },

  async createUser(args: CreateUser, role: UserRole): Promise<User> {
    return db.user.create({
      data: {
        email: args.email,
        name: args.name,
        role,
        password: {
          create: {
            hash: await Password.hash(args.password),
          },
        },
      },
    })
  },

  async updateUserStatus(user: User, status: boolean) {
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        approved: status,
      },
    })
  },

  async updateUserProfile(user: User, data: UpdateUserProfile): Promise<User> {
    return db.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: data.name,
        phone: data.phone,
        mobile: data.mobile,
      },
    })
  },

  async updateUserPassword(user: User, newPassword: string): Promise<void> {
    await db.password.update({
      where: {
        userId: user.id,
      },
      data: {
        hash: await Password.hash(newPassword),
      },
    })
  }
}