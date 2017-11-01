export function Api ($rootScope, $resource, config) {
  // fetch API server details
  let protocol = config.protocol
  let host = config.host
  let port = config.port
  let server = protocol + '://' + host + ':' + port

  return {
    Authenticate: $resource(server + '/authenticate/:email'),

    Channels: $resource(server + '/channels/:channelId', { channelId: '@_id' }, {
      update: { method: 'PUT' },
      audits: {
        method: 'GET',
        url: server + '/channels/:channelId/audits',
        isArray: true
      }
    }),

    TriggerPollingChannels: $resource(server + '/channels/:channelId/trigger', { channelId: '@_id' }, {}),

    Roles: $resource(server + '/roles/:name', { name: '@name' }, {
      update: { method: 'PUT' }
    }),

    Users: $resource(server + '/users/:email', { email: '@email' }, {
      update: { method: 'PUT' }
    }),

    Clients: $resource(server + '/clients/:clientId/:property', { clientId: '@_id', property: '@property' }, {
      update: { method: 'PUT' }
    }),

    Transactions: $resource(server + '/transactions/:transactionId', { transactionId: '@_id' }),

    Mediators: $resource(server + '/mediators/:urn', { urn: '@urn' }, {
      update: { method: 'PUT' }
    }),
    MediatorConfig: $resource(server + '/mediators/:urn/config', { urn: '@urn' }, {
      update: { method: 'PUT' }
    }),
    MediatorChannels: $resource(server + '/mediators/:urn/channels', { urn: '@urn' }),

    // add the metric endpoints
    MetricsChannels: $resource(server + '/metrics/channels/:channelId'),
    MetricsTimeseries: $resource(server + '/metrics/timeseries/:type'),
    MetricsTimeseriesChannel: $resource(server + '/metrics/timeseries/:type/channels/:channelId'),

    Tasks: $resource(server + '/tasks/:taskId', { taskId: '@_id' }, {
      update: { method: 'PUT' }
    }),

    ContactGroups: $resource(server + '/groups/:groupId', { groupId: '@_id' }, {
      update: { method: 'PUT' }
    }),

    Events: $resource(server + '/events/:receivedTime'),
    Heartbeat: $resource(server + '/heartbeat'),

    // endpoint to restart the core server
    Restart: $resource(server + '/restart', {}),

    // User Token
    UserPasswordToken: $resource(server + '/token/:token', { token: '@token' }, {
      update: { method: 'PUT' }
    }),

    // user reset password request
    UserPasswordResetRequest: $resource(server + '/password-reset-request/:email', { email: '@email' }, {}),

    Keystore: $resource(server + '/keystore/:type/:property', { type: '@type', property: '@property' }, {
      update: { method: 'PUT' }
    }),

    Certificates: $resource(server + '/certificates', {}),

    // ATNA Audit log endpoint
    Audits: $resource(server + '/audits/:auditId', { auditId: '@_id' }),
    AuditsFilterOptions: $resource(server + '/audits-filter-options/', {}),

    // Logs API
    Logs: $resource(server + '/logs'),

    // Metadata API
    Metadata: $resource(server + '/metadata', {}, {
      save: { method: 'POST', isArray: true },
      query: { method: 'GET', isArray: true }
    }),

    MetadataValidation: $resource(server + '/metadata/validate', {}, {
      save: { method: 'POST', isArray: true }
    }),

    // Visualizer API
    Visualizers: $resource(server + '/visualizers/:id', { id: '@_id' }, {
      update: { method: 'PUT' }
    }),

    // About page (versions) API
    About: $resource(server + '/about')

  }
}
