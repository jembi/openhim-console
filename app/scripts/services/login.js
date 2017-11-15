import * as CryptoJS from 'crypto-js'

export function login (Api, Authinterceptor) {
  let userProfile = {}

  return {
    login: function (email, password, done) {
      // fetch salt from openhim-core server and work out password hash
      Api.Authenticate.get({ email: email }, function (authDetails) {
        // on success
        if (!authDetails.salt) {
          done('Authentication Failed')
        } else {
          // Get Time diff
          userProfile.clientTimeStamp = new Date().getTime()
          userProfile.serverTimeStamp = new Date(authDetails.ts).getTime()
          userProfile.timeDiff = userProfile.serverTimeStamp - userProfile.clientTimeStamp

          let sha512 = CryptoJS.algo.SHA512.create()
          sha512.update(authDetails.salt)
          sha512.update(password)
          let hash = sha512.finalize()

          userProfile.email = email
          userProfile.passwordHash = hash.toString(CryptoJS.enc.Hex)
          // notify the authInterceptor of a logged in user
          Authinterceptor.setLoggedInUser(userProfile)
          // Verify that you can make authenticated requests
          Api.Users.get({ email: email }, function (profile) {
            userProfile = profile
            done('Authentication Success')
          }, function () {
            // Throw error upon failure
            done('Authentication Failed')
          })
        }
      }, function (err) {
        // if error returns a status then server is active - user not authenticated
        if (err.status) {
          done('Authentication Failed')
        } else {
          // no status returned - server error occured
          done('Internal Server Error')
        }
      })
    },
    logout: function () {
      userProfile = null
    },
    getLoggedInUser: function () {
      return userProfile
    },
    isLoggedIn: function () {
      if (userProfile !== null) {
        return typeof (userProfile.passwordHash) !== 'undefined'
      } else {
        return false
      }
    }
  }
}
