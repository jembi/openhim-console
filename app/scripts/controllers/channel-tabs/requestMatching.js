export function channelRequestMatchingCtrl ($scope, Api) {
  // object for the taglist roles
  $scope.taglistClientRoleOptions = []
  $scope.taglistUserRoleOptions = []

  // watch parent scope for 'users' change
  $scope.$watch('users', function () {
    // setup user groups taglist options
    angular.forEach($scope.users, function (user) {
      angular.forEach(user.groups, function (group) {
        if ($scope.taglistUserRoleOptions.indexOf(group) === -1) {
          $scope.taglistUserRoleOptions.push(group)
        }
      })
    })
  })

  // get the roles for the client taglist option
  Api.Clients.query(function (clients) {
    angular.forEach(clients, function (client) {
      if ($scope.taglistClientRoleOptions.indexOf(client.clientID) === -1) {
        $scope.taglistClientRoleOptions.push(client.clientID)
      }
      angular.forEach(client.roles, function (role) {
        if ($scope.taglistClientRoleOptions.indexOf(role) === -1) {
          $scope.taglistClientRoleOptions.push(role)
        }
      })
    })
  },
  function () { /* server error - could not connect to API to get clients */ })

  // if update is true
  if ($scope.update) {
    $scope.channel.$promise.then(function () {
      if ($scope.channel.matchContentRegex) { $scope.matching.contentMatching = 'RegEx matching' }
      if ($scope.channel.matchContentJson) { $scope.matching.contentMatching = 'JSON matching' }
      if ($scope.channel.matchContentXpath) { $scope.matching.contentMatching = 'XML matching' }

      if ($scope.channel.matchContentRegex || $scope.channel.matchContentJson || $scope.channel.matchContentXpath) {
        $scope.matching.showRequestMatching = true
      }
    })
  }
}
