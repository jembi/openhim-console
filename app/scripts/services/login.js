export function login (Api, $rootScope, keycloak) {
  let userProfile = {}

  return {
    login: function (email, password, done) {
      // fetch salt from openhim-core server and work out password hash
      Api.AuthenticateLocal.save({ username: email, password }, function () {
        // on success
        // Verify that you can make authenticated requests
        Api.Users.get({ email: email }, function (profile) {
          userProfile = profile
          done('Authentication Success')
        }, function () {
          // Throw error upon failure
          done('Authentication Failed')
        })
      }, function (err) {
        if (err.status < 100) {
          // If the status is outside the possible http status range no then http error
          done('Internal Server Error')
        } else {
          // if error returns a status then server is active - user not authenticated
          done('Authentication Failed')
        }
      }
      )
    },
    loginWithKeyCloak: function (code, sessionState, state, done) {
      // fetch salt from openhim-core server and work out password hash
      Api.AuthenticateOpenid.getToken({ code, sessionState, state }, function (authDetails) {
        userProfile = authDetails.user
        done('Authentication Success', authDetails.user)
      }, function (err) {
        if (err.status < 100) {
          // If the status is outside the possible http status range no then http error
          done('Internal Server Error')
        } else {
          // if error returns a status then server is active - user not authenticated
          done('Authentication Failed')
        }
      })
    },
    logout: function (done) {
      Api.Logout.get(
        {},
        function () {
          // Cleanup of keycloak session
          const keycloakState = keycloak.getKeycloakState()
          const isKeycloakLogin = $rootScope.sessionUser && $rootScope.sessionProvider === 'openid' && keycloakState
          userProfile = null
          $rootScope.sessionUser = null
          $rootScope.navMenuVisible = false
          localStorage.removeItem('consoleSession')

          if (isKeycloakLogin) {
            localStorage.removeItem(`kc-callback-${keycloakState}`)
            keycloak.keycloakInstance.logout({ redirectUri: window.location.origin })
          }

          done('Logout Successful')
        }, function () {
          done('Internal Server Error')
        }
      )
    },
    getLoggedInUser: function () {
      return userProfile
    },
    isLoggedIn: function () {
      return userProfile !== null && Object.keys(userProfile).length > 0
    }
  }
}
