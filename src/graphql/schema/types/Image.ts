import { objectType, arg, extendType } from 'nexus'

export const Image = objectType({
  name: 'Image',
  definition(t) {
    t.model.id()
    t.model.publicId()
    t.model.format()
    t.model.version()
  },
})

export const imageQuery = extendType({
  type: 'Query',
  definition(t) {
    t.crud.image()
    t.field('findFirstImage', {
      type: 'Image',
      args: {
        where: 'ImageWhereInput',
        orderBy: arg({ type: 'ImageOrderByInput' }),
        cursor: 'ImageWhereUniqueInput',
        skip: 'Int',
        take: 'Int',
      },
      async resolve(_root, args, ctx) {
        return ctx.prisma.image.findFirst(args as any)
      },
    })
    t.crud.images({ filtering: true, ordering: true })
    t.field('imagesCount', {
      type: 'Int',
      args: {
        where: 'ImageWhereInput',
      },
      async resolve(_root, args, ctx) {
        return ctx.prisma.image.count(args as any)
      },
    })
  },
})

export const imageMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.createOneImage()
    t.crud.updateOneImage()
    t.crud.upsertOneImage()
    t.crud.deleteOneImage()
    t.crud.updateManyImage()
    t.crud.deleteManyImage()
  },
})
