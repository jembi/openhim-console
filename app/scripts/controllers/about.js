'use strict';
/* global isCoreVersionCompatible:false */

angular.module('openhimConsoleApp')
  .controller('AboutCtrl', function ($scope, Api, Alerting, config) {
    
    $scope.aboutInfo = {};
    
    var success = function(result) {
      $scope.aboutInfo.currentCoreVersion = result.currentCoreVersion;
      buildAboutInfoObject();
    };
    
    var error = function(err) {
      Alerting.AlertAddServerMsg(err.status);
    };
    
    Api.About.get(success, error);
    
    var buildAboutInfoObject = function() {
      $scope.aboutInfo.currentConsoleVersion = config.version;
      $scope.aboutInfo.minimumCoreVersion = config.minimumCoreVersion;
      
      var maxCoreMajorVersion = parseInt(config.minimumCoreVersion.split('.')[0]) + 1;
      $scope.aboutInfo.maximumCoreVersion = maxCoreMajorVersion + '.0.0';
      
      $scope.aboutInfo.compatible = isCoreVersionCompatible($scope.aboutInfo.minimumCoreVersion, $scope.aboutInfo.currentCoreVersion);
    };
    
  });
  