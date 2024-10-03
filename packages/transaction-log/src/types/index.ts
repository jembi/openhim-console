export type Client = {
  _id: string
  name: string
}

export type Channel = {
  _id: string
  name: string
}

export type TransactionStatus =
  | 'Processing'
  | 'Pending Async'
  | 'Successful'
  | 'Completed'
  | 'Completed with error(s)'
  | 'Failed'

export interface RequestDef {
  host?: string
  port?: string
  path?: string
  headers?: Record<string, unknown>
  querystring?: string
  body?: string
  method?: string
  timestamp: string
  params?: {}
}

export interface ResponseDef {
  status?: number
  headers?: Record<string, unknown>
  body?: string
  timestamp?: string
}

export interface ErrorDetailsDef {
  message?: string
  stack?: string
}

export interface OrchestrationMetadataDef {
  name: string
  group?: string
  request?: RequestDef
  response?: ResponseDef
  error?: ErrorDetailsDef
}

export interface RouteMetadataDef {
  name: string
  request: RequestDef
  response: ResponseDef
  orchestrations: OrchestrationMetadataDef[]
  properties?: Record<string, unknown>
  error?: ErrorDetailsDef
}

type ObjectId = string

export interface Transaction {
  _id: ObjectId
  clientID?: ObjectId
  clientIP?: string
  parentID?: ObjectId
  childIDs?: ObjectId[]
  channelID?: ObjectId
  request?: RequestDef
  response?: ResponseDef
  routes?: RouteMetadataDef[]
  orchestrations?: OrchestrationMetadataDef[]
  properties?: Record<string, unknown>
  canRerun?: boolean
  autoRetry?: boolean
  autoRetryAttempt?: number
  wasRerun?: boolean
  error?: ErrorDetailsDef
  status: TransactionStatus
  clientName?: string
  channelName?: string
}
