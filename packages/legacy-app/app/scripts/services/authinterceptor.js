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
        const passwordhash = user.passwordHash
        const requestSalt = CryptoJS.lib.WordArray.random(16).toString()
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
        const username = user.email

        const sha512 = CryptoJS.algo.SHA512.create()
        sha512.update(passwordhash)
        sha512.update(requestSalt)
        sha512.update(requestTS)
        const hash = sha512.finalize()

        config.headers['auth-username'] = username
        config.headers['auth-ts'] = requestTS
        config.headers['auth-salt'] = requestSalt
        config.headers['auth-token'] = hash.toString(CryptoJS.enc.Hex)
      }

      return config
    }
  }
}
