import Keycloak from 'keycloak-js'

let keycloakInstance = null

export function keycloak (config) {
  let keycloakState = ''
  // Init SSO with keycloak
  if (config.ssoEnabled) {
    if (!keycloakInstance) {
      // return a single instance of keycloak
      keycloakInstance = new Keycloak({
        url: config.keyCloakUrl,
        realm: config.keyCloakRealm,
        clientId: config.keyCloakClientId
      })
      keycloakInstance.init({ checkLoginIframe: false })
    }
  }
  return {
    keycloakInstance,
    setKeycloakState: function (state) {
      keycloakState = state
    },
    getKeycloakState: function () {
      return keycloakState
    }
  }
}
