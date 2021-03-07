import { makeSchema, asNexusMethod } from 'nexus'
import { nexusPrisma } from 'nexus-plugin-prisma'
import { GraphQLDate } from 'graphql-iso-date'
import path from 'path'
import { applyMiddleware } from 'graphql-middleware'
import { permissions } from '../permissions'

import * as types from './types'

export const GQLDate = asNexusMethod(GraphQLDate, 'date')

export const baseSchema = makeSchema({
  types: types,
  plugins: [
    nexusPrisma({
      experimentalCRUD: true,
      atomicOperations: false,
    }),
  ],
  outputs: {
    typegen: path.join(__dirname, 'nexus-plugin-prisma-typegen.ts'),
    schema: path.join(__dirname, 'schema.graphql'),
  },
  shouldGenerateArtifacts: process.env.NODE_ENV === 'development',
})

export const schema = applyMiddleware(baseSchema, permissions)
