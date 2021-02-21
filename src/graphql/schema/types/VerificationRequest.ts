import { objectType, arg, extendType } from 'nexus'

export const VerificationRequest = objectType({
  name: 'VerificationRequest',
  definition(t) {
    t.model.id()
    t.model.identifier()
    t.model.token()
    t.model.expires()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

export const verificationRequestQuery = extendType({
  type: 'Query',
  definition(t) {
    t.crud.verificationRequest()
    t.field('findFirstVerificationRequest', {
      type: 'VerificationRequest',
      args: {
        where: 'VerificationRequestWhereInput',
        orderBy: arg({ type: 'VerificationRequestOrderByInput' }),
        cursor: 'VerificationRequestWhereUniqueInput',
        skip: 'Int',
        take: 'Int',
      },
      async resolve(_root, args, ctx) {
        return ctx.prisma.verificationRequest.findFirst(args as any)
      },
    })
    t.crud.verificationRequests({ filtering: true, ordering: true })
    t.field('verificationRequestsCount', {
      type: 'Int',
      args: {
        where: 'VerificationRequestWhereInput',
      },
      async resolve(_root, args, ctx) {
        return ctx.prisma.verificationRequest.count(args as any)
      },
    })
  },
})

export const verificationRequestMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.createOneVerificationRequest()
    t.crud.updateOneVerificationRequest()
    t.crud.upsertOneVerificationRequest()
    t.crud.deleteOneVerificationRequest()
    t.crud.updateManyVerificationRequest()
    t.crud.deleteManyVerificationRequest()
  },
})
