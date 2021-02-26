import { objectType, arg, extendType } from 'nexus'

export const Series = objectType({
  name: 'Series',
  definition(t) {
    t.model.id()
    t.model.user()
    t.model.userId()
    t.model.title()
    t.model.published()
    t.model.createdAt()
    t.model.updatedAt()
    t.model.Story()
  },
})

export const seriesQuery = extendType({
  type: 'Query',
  definition(t) {
    t.crud.series()
    t.field('findFirstSeries', {
      type: 'Series',
      args: {
        where: 'SeriesWhereInput',
        orderBy: arg({ type: 'SeriesOrderByInput' }),
        cursor: 'SeriesWhereUniqueInput',
        skip: 'Int',
        take: 'Int',
      },
      async resolve(_root, args, ctx) {
        return ctx.prisma.series.findFirst(args as any)
      },
    })
    t.crud.series({ filtering: true, ordering: true })
    t.field('seriesCount', {
      type: 'Int',
      args: {
        where: 'SeriesWhereInput',
      },
      async resolve(_root, args, ctx) {
        return ctx.prisma.series.count(args as any)
      },
    })
  },
})

export const seriesMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.createOneSeries()
    t.crud.updateOneSeries()
    t.crud.upsertOneSeries()
    t.crud.deleteOneSeries()
    t.crud.updateManySeries()
    t.crud.deleteManySeries()
  },
})
