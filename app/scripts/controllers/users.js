'use strict';

angular.module('openhimWebui2App')
    .controller('UsersCtrl', function ($scope, $modal, Api) {
        $scope.users = Api.Users.query();

        $scope.$on('usersChanged', function() {
            $scope.users = Api.Users.query();
        });

        $scope.addUser = function() {
            $modal.open({
                templateUrl: 'views/usersmodal.html',
                controller: 'UsersModalCtrl',
                resolve: {
                    user: function () {}
                }
            });
        };

        $scope.removeUser = function(user) {
            user.$remove(function() {
                // On success
                $scope.users = Api.Users.query();
            });
        };

        $scope.editUser = function(user) {
            $modal.open({
                templateUrl: 'views/usersmodal.html',
                controller: 'UsersModalCtrl',
                resolve: {
                    user: function () {
                        return user;
                    }
                }
            });
        };
    });
