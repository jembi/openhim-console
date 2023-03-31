export function Authinterceptor ($q, $location) {
  return {
    responseError: function (response) {
      // Redirect user to login page in case he is not authorized
      if (response.status === 401) {
        localStorage.removeItem('consoleSession')

        $location.path('/login')
      }
      return $q.reject(response)
    }
  }
}
