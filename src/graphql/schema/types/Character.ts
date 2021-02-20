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
