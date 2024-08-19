type UpdatedByDef = {
  id?: string // Assuming ObjectId is represented as a string
  name?: string
}

type ContactUserDef = {
  user: string
  method: 'email' | 'sms'
  maxAlerts?: 'no max' | '1 per hour' | '1 per day'
}

type RewriteRuleDef = {
  fromHost: string
  toHost: string
  fromPort?: number
  toPort?: number
  pathTransform?: string
}

type AlertsDef = {
  condition?: 'status' | 'auto-retry-max-attempted'
  status?: string
  failureRate?: number
  groups?: Array<string> // Assuming ObjectId is represented as a string
  users?: Array<ContactUserDef>
}

type ChannelRoute = {
  name: string
  type?: 'http' | 'kafka'
  cert?: string // Assuming ObjectId is represented as a string
  status?: 'enabled' | 'disabled'
  secured?: boolean
  host?: string
  port?: number
  path?: string
  pathTransform?: string
  primary?: boolean
  username?: string
  password?: string
  forwardAuthHeader?: boolean
  waitPrimaryResponse?: boolean
  statusCodesCheck?: string
  kafkaClientId?: string
  kafkaTopic?: string
}

export type Channel = {
  name: string
  description?: string
  urlPattern: string
  isAsynchronousProcess?: boolean
  maxBodyAgeDays?: number
  lastBodyCleared?: Date
  timeout?: number
  methods?: Array<
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'CONNECT'
    | 'OPTIONS'
    | 'TRACE'
    | 'PATCH'
  >
  type?: 'http' | 'tcp' | 'tls' | 'polling'
  priority?: number
  tcpPort?: number
  tcpHost?: string
  pollingSchedule?: string
  requestBody?: boolean
  responseBody?: boolean
  allow: Array<string>
  whitelist?: Array<string>
  authType?: 'private' | 'public'
  routes?: Array<ChannelRoute>
  matchContentTypes?: Array<string>
  matchContentRegex?: string
  matchContentXpath?: string
  matchContentJson?: string
  matchContentValue?: string
  properties?: Array<Record<string, any>>
  txViewAcl?: Array<string>
  txViewFullAcl?: Array<string>
  txRerunAcl?: Array<string>
  alerts?: Array<AlertsDef>
  status?: 'enabled' | 'disabled' | 'deleted'
  rewriteUrls?: boolean
  addAutoRewriteRules?: boolean
  rewriteUrlsConfig?: Array<RewriteRuleDef>
  autoRetryEnabled?: boolean
  autoRetryPeriodMinutes?: number
  autoRetryMaxAttempts?: number
  updatedBy?: UpdatedByDef
}
