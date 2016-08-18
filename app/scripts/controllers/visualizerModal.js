'use strict';

angular.module('openhimConsoleApp')
  .controller('VisualizerModalCtrl', function ($http, $scope, $modalInstance, $timeout, Api, Notify, Alerting, settingsStore, visualizers) {


    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/

    $scope.ngError = {};
    $scope.validationRequiredMsg = 'This field is required.';

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
    $scope.viewModel = {};

    $scope.addSelectedChannel = function(){
      $scope.settings.visualizer.channels.push({ eventType: 'channel', eventName: $scope.viewModel.addSelectChannel.name, display: $scope.viewModel.addSelectChannel.name });
      $scope.viewModel.addSelectChannel = null;
    };

    $scope.addSelectedMediator = function(){
      $scope.settings.visualizer.mediators.push({ mediator: $scope.viewModel.addSelectMediator.urn, name: $scope.viewModel.addSelectMediator.name, display: $scope.viewModel.addSelectMediator.name });
      $scope.viewModel.addSelectMediator = null;
    };

    $scope.addComponent = function(){
      if( $scope.viewModel.addComponent.eventType ){
        $scope.settings.visualizer.components.push({ eventType: $scope.viewModel.addComponent.eventType, eventName: $scope.viewModel.addComponent.eventName, display: $scope.viewModel.addComponent.display });
        $scope.viewModel.addComponent.eventType = '';
        $scope.viewModel.addComponent.eventName = '';
        $scope.viewModel.addComponent.display = '';
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

    $scope.validateFormSettings = function(settings, callback){
      // reset hasErrors alert object
      Alerting.AlertReset('hasErrors');

      // clear timeout if it has been set
      $timeout.cancel( $scope.clearValidation );

      $scope.ngError.hasErrors = false;

      // required fields validation
      if(!settings.name){
        $scope.ngError.hasNoName = true;
        $scope.ngError.hasErrors = true;
      } else {

        // the visualizer name must be unique
        var result = visualizers.filter(function (obj){
          return obj.name === settings.name;
        });

        if(result.length > 0){
          $scope.ngError.nameNotUnique = true;
          $scope.ngError.hasErrors = true; 
        }
      }      

      if(settings.components === undefined || settings.components.length === 0){
        $scope.ngError.hasErrors = true;
        $scope.ngError.hasNoComponents = true;
      }

      if(settings.channels === undefined || settings.channels.length === 0){
        $scope.ngError.hasErrors = true;
        $scope.ngError.hasNoChannels = true;
      }

      if ( $scope.ngError.hasErrors ){
        $scope.clearValidation = $timeout(function(){
          // clear errors after 5 seconds
          $scope.ngError = {};
          Alerting.AlertReset('hasErrors');
        }, 5000);
        Alerting.AlertAddMsg('hasErrors', 'danger', 'There are errors on the form.');
        callback('Error: Form has errors');
      } else {
        callback();
      }
    };

    var notifyUser = function(){
      // reset backing object and refresh users list
      Notify.notify('visualizersChanged');
      $modalInstance.close();
    };

    var success = function () {
      // add the success message
      Alerting.AlertAddMsg('top', 'success', 'The visualizer has been saved successfully');
      
      notifyUser();
    };

    var error = function () {
      // add the success message
      Alerting.AlertAddMsg('top', 'danger', 'Failed to save the visualizer details because the visualizer name is not unique. Please try again.');

      notifyUser();
    };

    $scope.saveVisualizer = function(){
      
      // validate form input
      $scope.validateFormSettings($scope.settings.visualizer, function(err){
        if(!err){
          // save visualizer settings
          Api.Visualizers.save({ name: '' },$scope.settings.visualizer, success, error);
        }
      });
    };

    /*******************************************/
    /**   Settings - Visualizer Functions     **/
    /*******************************************/

  });


