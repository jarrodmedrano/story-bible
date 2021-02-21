import { objectType, arg, extendType } from 'nexus'

export const Account = objectType({
  name: 'Account',
  definition(t) {
    t.model.id()
    t.model.compoundId()
    t.model.userId()
    t.model.providerType()
    t.model.providerId()
    t.model.providerAccountId()
    t.model.refreshToken()
    t.model.accessToken()
    t.model.accessTokenExpires()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

export const accountQuery = extendType({
  type: 'Query',
  definition(t) {
    t.crud.account()
    t.field('findFirstAccount', {
      type: 'Account',
      args: {
        where: 'AccountWhereInput',
        orderBy: arg({ type: 'AccountOrderByInput' }),
        cursor: 'AccountWhereUniqueInput',
        skip: 'Int',
        take: 'Int',
      },
      async resolve(_root, args, ctx) {
        return ctx.prisma.account.findFirst(args as any)
      },
    })
    t.crud.accounts({ filtering: true, ordering: true })
    t.field('accountsCount', {
      type: 'Int',
      args: {
        where: 'AccountWhereInput',
      },
      async resolve(_root, args, ctx) {
        return ctx.prisma.account.count(args as any)
      },
    })
  },
})

export const accountMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.createOneAccount()
    t.crud.updateOneAccount()
    t.crud.upsertOneAccount()
    t.crud.deleteOneAccount()
    t.crud.updateManyAccount()
    t.crud.deleteManyAccount()
  },
})
