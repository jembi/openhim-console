export function Authinterceptor ($location) {

  return {
    responseError: function (response) {
      // Redirect user to login page in case he is not authorized
      if(response.status === 401) {
        $location.path('/login')
      }
    }
  }
}
