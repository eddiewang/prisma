import { TypescriptGenerator } from './typescript-client'
import { getExistsFlowTypes } from '../utils'

import * as prettier from 'prettier'
const { version } = require('../../package.json')

export interface RenderOptions {
  endpoint?: string
  secret?: string
}

export class FlowGenerator extends TypescriptGenerator {
  genericsDelimiter = ':'
  lineBreakDelimiter = ','
  partialType = '$Shape'
  exportPrisma = false

  prismaInterface = 'PrismaInterface'
  renderImports() {
    return `\
/**
 * @flow
 */

// Code generated by Prisma CLI (https://github.com/prisma/prisma) and prisma-client-lib@${version}. DO NOT EDIT.

import type { GraphQLSchema } from 'graphql'
import type { IResolvers } from 'graphql-tools/dist/Interfaces'
import type { BasePrismaOptions as BPOType, Options } from 'prisma-client-lib'
import { makePrismaClientClass } from 'prisma-client-lib'
import { typeDefs } from './prisma-schema'`
  }
  renderClientConstructor() {
    return `export interface ClientConstructor<T> {
  new(options?: BPOType): T
}
`
  }
  format(code: string, options: prettier.Options = {}) {
    return prettier.format(code, {
      ...options,
      parser: 'flow',
    })
  }
  renderAtLeastOne() {
    // TODO: as soon as flow has a clean solution for at least one, implement it here
    return `type AtLeastOne<T> = $Shape<T>`
  }
  renderGraphQL() {
    return `$graphql: <T: any>(query: string, variables?: {[key: string]: any}) => Promise<T>;`
  }
  renderInputListType(type) {
    return `${type}[]`
  }
  renderExists() {
    const queryType = this.schema.getQueryType()
    if (queryType) {
      return `${getExistsFlowTypes(queryType)}`
    }
    return ''
  }
  // renderExports(options?: RenderOptions) {
  //   const args = this.renderPrismaClassArgs(options)

  //   return `export const prisma: Prisma = makePrismaClientClass(${args})`
  // }
}