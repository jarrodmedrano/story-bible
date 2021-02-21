import { objectType, arg, extendType } from 'nexus'

export const Session = objectType({
  name: 'Session',
  definition(t) {
    t.model.id()
    t.model.userId()
    t.model.expires()
    t.model.sessionToken()
    t.model.accessToken()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

export const sessionQuery = extendType({
  type: 'Query',
  definition(t) {
    t.crud.session()
    t.field('findFirstSession', {
      type: 'Session',
      args: {
        where: 'SessionWhereInput',
        orderBy: arg({ type: 'SessionOrderByInput' }),
        cursor: 'SessionWhereUniqueInput',
        skip: 'Int',
        take: 'Int',
      },
      async resolve(_root, args, ctx) {
        return ctx.prisma.session.findFirst(args as any)
      },
    })
    t.crud.sessions({ filtering: true, ordering: true })
    t.field('sessionsCount', {
      type: 'Int',
      args: {
        where: 'SessionWhereInput',
      },
      async resolve(_root, args, ctx) {
        return ctx.prisma.session.count(args as any)
      },
    })
  },
})

export const sessionMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.createOneSession()
    t.crud.updateOneSession()
    t.crud.upsertOneSession()
    t.crud.deleteOneSession()
    t.crud.updateManySession()
    t.crud.deleteManySession()
  },
})
