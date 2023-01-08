import Keycloak from 'keycloak-js';

export const keycloak = new Keycloak({
  url: 'http://localhost:9080',
  realm: 'platform-realm',
  clientId: 'openhim-oauth',
});
