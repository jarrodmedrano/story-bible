import { objectType, extendType } from '@nexus/schema'

export const Character = objectType({
  name: 'Character',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.createdAt()
    t.model.updatedAt()
    t.model.bloodType()
    t.model.eyes()
    t.model.height()
    t.model.weight()
    t.model.user()
  },
})

export const CharacterQueries = extendType({
  type: 'Query',
  definition: (t) => {
    t.crud.characters({
      filtering: {
        id: true,
        user: true,
        userId: true,
        name: true,
        bloodType: true,
        weight: true,
        height: true,
        createdAt: true,
        updatedAt: true,
      },
      type: 'User',
      ordering: { name: true },
    })
  },
})

export const CharacterMutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.crud.createOneCharacter({
      type: 'User',
    })
  },
})
