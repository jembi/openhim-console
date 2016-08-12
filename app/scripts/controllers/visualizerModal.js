'use strict';

angular.module('openhimConsoleApp')
  .controller('VisualizerModalCtrl', function ($http, $scope, $modalInstance, $timeout, Api, settingsStore) {


    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/



    // get/set the users scope whether new or update
    if (settingsStore) {
      $scope.update = true;
      
      
    }else{
      $scope.update = false;

      // create visualizer settings properties
      $scope.settings = {};
      $scope.settings.visualizer = {};

      // load default visualizer config for new user
      $http.get('config/visualizer.json').success(function( visualizerConfig ) {
        angular.extend( $scope.settings.visualizer, angular.copy( visualizerConfig ) );
      });
    }

    $scope.cancel = function () {
      $timeout.cancel( $scope.clearValidationRoute );
      $modalInstance.dismiss('cancel');
    };

    // get the allowed channels for the transaction settings
    Api.Channels.query(function(channels){
      $scope.channels = channels;

      $scope.primaryRoutes = [];
      $scope.secondaryRoutes = [];

      angular.forEach(channels, function(channel){
        angular.forEach(channel.routes, function(route){
          if (route.primary) {
            if ($scope.primaryRoutes.indexOf(route.name) < 0) {
              $scope.primaryRoutes.push(route.name);
            }
          } else {
            if ($scope.secondaryRoutes.indexOf(route.name) < 0) {
              $scope.secondaryRoutes.push(route.name);
            }
          }
        });
      });
    }, function(){ /* server error - could not connect to API to get channels */ });


    Api.Mediators.query(function(mediators){
      $scope.mediators = mediators;
    }, function(){ /* server error - could not connect to API to get mediators */ });

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/


    
    /*******************************************/
    /**   Settings - Visualizer Functions     **/
    /*******************************************/

    // setup visualizer object
    $scope.visualizer = {};

    $scope.addSelectedChannel = function(){
      $scope.settings.visualizer.channels.push({ eventType: 'channel', eventName: $scope.visualizer.addSelectChannel.name, display: $scope.visualizer.addSelectChannel.name });
      $scope.visualizer.addSelectChannel = null;
    };

    $scope.addSelectedMediator = function(){
      $scope.settings.visualizer.mediators.push({ mediator: $scope.visualizer.addSelectMediator.urn, name: $scope.visualizer.addSelectMediator.name, display: $scope.visualizer.addSelectMediator.name });
      $scope.visualizer.addSelectMediator = null;
    };

    $scope.addComponent = function(){
      if( $scope.visualizer.addComponent.eventType ){
        $scope.settings.visualizer.components.push({ eventType: $scope.visualizer.addComponent.eventType, eventName: $scope.visualizer.addComponent.eventName, display: $scope.visualizer.addComponent.display });
        $scope.visualizer.addComponent.eventType = '';
        $scope.visualizer.addComponent.eventName = '';
        $scope.visualizer.addComponent.display = '';
      }
    };

    $scope.removeComponent = function(index){
      $scope.settings.visualizer.components.splice(index, 1);
    };

    $scope.removeChannel = function(index){
      $scope.settings.visualizer.channels.splice(index, 1);
    };

    $scope.removeMediator = function(index){
      $scope.settings.visualizer.mediators.splice(index, 1);
    };

    /*******************************************/
    /**   Settings - Visualizer Functions     **/
    /*******************************************/

  });


