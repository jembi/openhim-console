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
      var v1 = minVersion.split('.');
      var v2 = actualVersion.split('.');
      
      if(v1[0] === v2[0]) {
        return 'Compatible';
      }
      return 'Incompatible';
    };
    
    
    var buildAboutInfoObject = function() {
      $scope.aboutInfo.currentConsoleVersion = config.version;
      
      angular.forEach($scope.aboutInfo.releases, function(release, key) {
        
        var maxCoreVersionArray = release.minimumCoreVersion.split('.');
        maxCoreVersionArray[0] = parseInt(maxCoreVersionArray[0]) + 1;
        $scope.aboutInfo.releases[key].maximumCoreVersion = maxCoreVersionArray.join('.');
        
        if(release.consoleVersion === $scope.aboutInfo.currentConsoleVersion) {
          $scope.aboutInfo.minimumCoreVersion = release.minimumCoreVersion;
        }
      });
      
      $scope.aboutInfo.compatibility = getVersionCompatible($scope.aboutInfo.minimumCoreVersion, $scope.aboutInfo.currentCoreVersion);
    };
    
    
    $scope.$on('aboutInfoReceived', function () {
      buildAboutInfoObject();
    });
    
  });
  