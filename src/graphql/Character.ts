import { objectType, arg, extendType } from 'nexus'

export const Character = objectType({
  name: 'Character',
  definition(t) {
    t.model.id()
    t.model.user()
    t.model.userId()
    t.model.name()
    t.model.bloodType()
    t.model.eyes()
    t.model.height()
    t.model.weight()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

export const characterQuery = extendType({
  type: 'Query',
  definition(t) {
    t.crud.character()
    t.field('findFirstCharacter', {
      type: 'Character',
      args: {
        where: 'CharacterWhereInput',
        orderBy: arg({ type: 'CharacterOrderByInput' }),
        cursor: 'CharacterWhereUniqueInput',
        skip: 'Int',
        take: 'Int',
      },
      async resolve(_root, args, ctx) {
        return ctx.prisma.character.findFirst(args as any)
      },
    })
    t.crud.characters({ filtering: true, ordering: true })
    t.field('charactersCount', {
      type: 'Int',
      args: {
        where: 'CharacterWhereInput',
      },
      async resolve(_root, args, ctx) {
        return ctx.prisma.character.count(args as any)
      },
    })
  },
})

export const characterMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.createOneCharacter()
    t.crud.updateOneCharacter()
    t.crud.upsertOneCharacter()
    t.crud.deleteOneCharacter()
    t.crud.updateManyCharacter()
    t.crud.deleteManyCharacter()
  },
})
