import { objectType, arg, extendType } from 'nexus'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.email()
    t.model.emailVerified()
    t.model.image()
    t.model.characters()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

export const userQuery = extendType({
  type: 'Query',
  definition(t) {
    t.crud.user()
    t.field('findFirstUser', {
      type: 'User',
      args: {
        where: 'UserWhereInput',
        orderBy: arg({ type: 'UserOrderByInput' }),
        cursor: 'UserWhereUniqueInput',
        skip: 'Int',
        take: 'Int',
      },
      async resolve(_root, args, ctx) {
        return ctx.prisma.user.findFirst(args as any)
      },
    })
    t.crud.users({ filtering: true, ordering: true })
    t.field('usersCount', {
      type: 'Int',
      args: {
        where: 'UserWhereInput',
      },
      async resolve(_root, args, ctx) {
        return ctx.prisma.user.count(args as any)
      },
    })
  },
})

export const userMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.createOneUser()
    t.crud.updateOneUser()
    t.crud.upsertOneUser()
    t.crud.deleteOneUser()
    t.crud.updateManyUser()
    t.crud.deleteManyUser()
  },
})
