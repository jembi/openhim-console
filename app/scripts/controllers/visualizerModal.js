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

      if(settings.mediators === undefined || settings.mediators.length === 0){
        $scope.ngError.hasErrors = true;
        $scope.ngError.hasNoMediators = true;
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
      Notify.notify('channelsChanged');
      $modalInstance.close();
    };

    var success = function () {
      // add the success message
      Alerting.AlertAddMsg('top', 'success', 'The visualizer has been saved successfully');
      
      notifyUser();
    };

    var error = function (err) {
      // add the success message
      Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while saving the channels\' details: #' + err.status + ' - ' + err.data);

      $scope.clearValidation = $timeout(function(){
        // clear errors after 5 seconds
        Alerting.AlertReset('hasErrors');
      }, 10000);

      notifyUser();
    };

    $scope.submitSettingsForm = function(){
      
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


