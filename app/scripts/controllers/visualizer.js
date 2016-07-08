'use strict';
/* global moment: false */

angular.module('openhimConsoleApp')
  .controller('VisualizerCtrl', function ($scope, $http, $interval, login, Api, Alerting) {

    $scope.loadingVisualizer = true;
    $scope.loadingVisualizerError = false;
    $scope.loadingVisualizerErrorMsgs = [];


    // initialize global variables
    var components = [];
    var endpoints = [];
    var visResponsive, visW, visH, pad, inactiveColor, activeColor, errorColor, textColor;
    var visualizerUpdateInterval, updatePeriod, diffTime, lastUpdate, maxSpeed, maxTimeout;


    var consoleSession = localStorage.getItem('consoleSession');
    consoleSession = JSON.parse(consoleSession);
    $scope.consoleSession = consoleSession;

    // get the user settings to construct the visualizer
    Api.Users.get({ email: $scope.consoleSession.sessionUser }, function(user){

      // user doesnt have settings saved
      if ( !user.settings ){
        $scope.loadingVisualizerError = true;
        $scope.loadingVisualizer = false;
        $scope.loadingVisualizerErrorMsgs.push({ section: 'Settings Error', msg: 'There appear to be no settings saved for this user. Please save the user settings' });
        return;
      }

      var visSettings = user.settings.visualizer;

      /********** Visualizations Management **********/
      // setup components (components)
      angular.forEach(visSettings.components, function(component){
        components.push({ comp: component.event, desc: component.desc });
      });

      // setup endpoints
      angular.forEach(visSettings.endpoints, function(endpoint){
        endpoints.push({ comp: endpoint.event, desc: endpoint.desc });
      });

      // check if components and components have events
      if ( components.length === 0 || endpoints.length === 0 ){
        $scope.loadingVisualizerError = true;
        $scope.loadingVisualizer = false;
        $scope.loadingVisualizerErrorMsgs.push({ section: 'Visualizations Management', msg: 'Please ensure your visualizer has atleast one Component and one Endpoint added!' });
      }
      /********** Visualizations Management **********/


      /********** Size Management **********/
      visResponsive = visSettings.size.responsive;
      visW = parseInt( visSettings.size.width );
      visH = parseInt( visSettings.size.height );
      pad = parseInt( visSettings.size.padding );

      // check if config not empty
      if ( !visW || !visH || !pad ){
        $scope.loadingVisualizerError = true;
        $scope.loadingVisualizer = false;
        $scope.loadingVisualizerErrorMsgs.push({ section: 'Size Management', msg: 'Please ensure all size management fields are supplied!' });
      }
      /********** Size Management **********/


      /********** Color Management **********/
      inactiveColor = visSettings.color.inactive;
      activeColor = visSettings.color.active;
      errorColor = visSettings.color.error;
      textColor = visSettings.color.text;

      // check if config not empty
      if ( inactiveColor === '' || activeColor === '' || errorColor === '' || textColor === '' ){
        $scope.loadingVisualizerError = true;
        $scope.loadingVisualizer = false;
        $scope.loadingVisualizerErrorMsgs.push({ section: 'Color Management', msg: 'Please ensure all color management fields are supplied!' });
      }
      /********** Color Management **********/


      /********** Time Management **********/
      //How often to fetch updates from the server (in millis)
      updatePeriod = parseInt( visSettings.time.updatePeriod );

      //play speed; 0 = normal, -1 = 2X slower, -2 = 3X slower, 1 = 2X faster, etc.
      $scope.visualizerSpeed = 0;
      maxSpeed = parseInt( visSettings.time.maxSpeed );
      maxTimeout = parseInt( visSettings.time.maxTimeout );

      // check if config not empty
      if ( !updatePeriod || !maxSpeed || !maxTimeout ){
        $scope.loadingVisualizerError = true;
        $scope.loadingVisualizer = false;
        $scope.loadingVisualizerErrorMsgs.push({ section: 'Speed Management', msg: 'Please ensure all speed management fields are supplied!' });
      }
      /********** Time Management **********/


      // setup watchher objects
      $scope.visualizerData = [];
      $scope.visualizerSettings = {
        components: components,
        endpoints: endpoints,
        visResponsive: visResponsive,
        visW: visW,
        visH: visH,
        pad: pad,
        inactiveColor: inactiveColor,
        activeColor: activeColor,
        errorColor: errorColor,
        textColor: textColor,
        updatePeriod: updatePeriod,
        speed: $scope.visualizerSpeed,
        maxSpeed: maxSpeed,
        maxTimeout: maxTimeout
      };


      // check if visualizer should be loaded - no errors found
      if ( $scope.loadingVisualizer === true ){
        // visualizer loaded - change state
        $scope.loadingVisualizer = false;

        // Start the visualizer
        startVisualizer();
      }

    }, function(err){
      $scope.loadingVisualizer = false;
      // on error - add server error alert
      Alerting.AlertAddServerMsg(err.status);
    });


    // function to play the visualizer - Pull new events
    $scope.play = function play() {
      $scope.showPlay = false;
      $scope.showPause = true;

      lastUpdate = (Date.now()-diffTime);
      visualizerUpdateInterval = $interval( function() {
        Api.VisualizerEvents.get({ receivedTime: lastUpdate}, function (events) {
          // update the visualizerData object to trigger the directive watcher and update the events
          $scope.visualizerData = events.events;
          lastUpdate = (Date.now()-diffTime);
        });
      }, updatePeriod);
    };

    // function to cancel the update interval
    var cancelVisualizerUpdateInterval = function() {
      if (angular.isDefined(visualizerUpdateInterval)) {
        $interval.cancel(visualizerUpdateInterval);
        visualizerUpdateInterval = undefined;
      }
    };

    // function to pause the visualizer - cancel update interval
    $scope.pause = function pause() {
      $scope.showPlay = true;
      $scope.showPause = false;
      cancelVisualizerUpdateInterval();
    };

    // cancel update interval when visualizer scope destroyed
    $scope.$on('$destroy', cancelVisualizerUpdateInterval);

    // function to start the visualizer
    var startVisualizer = function startVisualizer() {
      Api.VisualizerSync.get(function (startVisualizer) {
        diffTime = Date.now() - moment(startVisualizer.now);
        $scope.play();
      });
    };

    // funcntion to slow down animate
    $scope.slowDown = function slowDown() {
      if ($scope.visualizerSpeed>-1*maxSpeed+1) {
        $scope.visualizerSpeed--;
      }
      $scope.speedText = $scope.setSpeedText();
    };

    // function to speed up animate
    $scope.speedUp = function speedUp() {
      if ($scope.visualizerSpeed<maxSpeed-1) {
        $scope.visualizerSpeed++;
      }
      $scope.speedText = $scope.setSpeedText();
    };

    // function to set the animate speed
    $scope.setSpeedText = function setSpeedText() {
      if ($scope.visualizerSpeed === 0) {
        return '';
      } else if ($scope.visualizerSpeed<0) {
        return (-1*$scope.visualizerSpeed+1) + 'X Slower';
      } else if ($scope.visualizerSpeed>0) {
        return ($scope.visualizerSpeed+1) + 'X Faster';
      }
    };

  });
