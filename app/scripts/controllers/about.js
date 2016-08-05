'use strict';

angular.module('openhimConsoleApp')
  .controller('AboutCtrl', function ($rootScope, $scope, Api, Alerting, Notify, config) {
    
    var success = function(result) {
      $scope.aboutInfo = result;
      Notify.notify('aboutInfoReceived');
    };
    
    var error = function(err) {
      Alerting.AlertAddServerMsg(err.status);
    };
    
    Api.About.query(success, error);
    
    
    var getVersionCompatible = function(minVersion, actualVersion) {
      var v1 = minVersion.split(".");
      var v2 = actualVersion.split(".");
      
      if(v1[0] === v2[0]) {
        return 'Compatible';
      }
      return 'Incompatible';
    };
    
    
    $scope.$on('aboutInfoReceived', function () {
      $scope.aboutInfo.currentConsoleVersion = config.version;
      
      var releases = $scope.aboutInfo.releases
      angular.forEach(releases, function(release, key) {
        var coreMaxArray = release.coreMinimum.split(".");
        coreMaxArray[0] = parseInt(coreMaxArray[0]) + 1;
        $scope.aboutInfo.releases[key]['coreMaximum'] = coreMaxArray.join(".");
        
        if(release.console === $scope.aboutInfo.currentConsoleVersion) {
          $scope.aboutInfo.minCoreVersion = release.coreMinimum;
        }
      });
      $scope.aboutInfo.compatibility = getVersionCompatible($scope.aboutInfo.minCoreVersion, $scope.aboutInfo.currentCoreVersion);
    });
    
  });