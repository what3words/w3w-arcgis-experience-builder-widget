import { ImmutableObject } from 'jimu-core'

export interface Config {
  w3wLocator: string
}

export type IMConfig = ImmutableObject<Config>
