export function channelUserAccessCtrl ($scope) {
  // object for the taglist roles
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
}
