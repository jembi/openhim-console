import * as CryptoJS from 'crypto-js'

export function Authinterceptor () {
  let user = localStorage.getItem('loggedOnUser')
  user = JSON.parse(user)

  return {
    setLoggedInUser: function (u) {
      user = u
      localStorage.setItem('loggedOnUser', JSON.stringify(user))
    },
    getLoggedInUser: function () {
      let user = localStorage.getItem('loggedOnUser')
      user = JSON.parse(user)
      return user
    },
    request: function (config) {
      if (user) {
        let requestTS = new Date().toISOString()
        try {
          /**
           * Try and syncronize with server time
           *
           */
          requestTS = new Date(Math.abs(new Date().getTime() + user.timeDiff)).toISOString()
        } catch (e) {
          console.log('Authinterceptor: ' + e.message)
        }

        config.headers['auth-provider'] = user.provider
        config.headers['auth-ts'] = requestTS

        if (user.provider === 'local') {
          const passwordhash = user.passwordHash
          const requestSalt = CryptoJS.lib.WordArray.random(16).toString()
          const sha512 = CryptoJS.algo.SHA512.create()

          sha512.update(passwordhash)
          sha512.update(requestSalt)
          sha512.update(requestTS)

          const hash = sha512.finalize()
          
          config.headers['auth-token'] = hash.toString(CryptoJS.enc.Hex)
          config.headers['auth-salt'] = requestSalt
          config.headers['auth-username'] = user.email
        } else if (user.provider === 'keycloak') {
          config.headers['auth-token'] = user.jwt.access_token
        } else {
          throw new Error('Invalid authentication provider.')
        }
      }

      return config
    }
  }
}
