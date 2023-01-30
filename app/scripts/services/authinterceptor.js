export function Authinterceptor ($location) {
  let user = localStorage.getItem('loggedOnUser')

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
    responseError: function (response) {
      // Redirect user to login page in case he is not authorized
      if(response.status === 401) {
        $location.path('/login')
      }
    }
  }
}
