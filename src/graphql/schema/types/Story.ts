import { objectType, arg, extendType } from 'nexus'

export const Story = objectType({
  name: 'Story',
  definition(t) {
    t.model.id()
    t.model.user()
    t.model.series()
    t.model.seriesId()
    t.model.userId()
    t.model.characters()
    t.model.title()
    t.model.subTitle()
    t.model.part()
    t.model.private()
    t.model.published()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

export const storyQuery = extendType({
  type: 'Query',
  definition(t) {
    t.crud.story()
    t.field('findFirstStory', {
      type: 'Story',
      args: {
        where: 'StoryWhereInput',
        orderBy: arg({ type: 'StoryOrderByInput' }),
        cursor: 'StoryWhereUniqueInput',
        skip: 'Int',
        take: 'Int',
      },
      async resolve(_root, args, ctx) {
        return ctx.prisma.story.findFirst(args as any)
      },
    })
    t.crud.stories({ filtering: true, ordering: true })
    t.field('storiesCount', {
      type: 'Int',
      args: {
        where: 'StoryWhereInput',
      },
      async resolve(_root, args, ctx) {
        return ctx.prisma.story.count(args as any)
      },
    })
  },
})

export const storyMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.createOneStory()
    t.crud.updateOneStory()
    t.crud.upsertOneStory()
    t.crud.deleteOneStory()
    t.crud.updateManyStory()
    t.crud.deleteManyStory()
  },
})
