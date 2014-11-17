'use strict';
//TODO it may be good to integrate d3 in a more 'angular', e.g. using directives
/* global d3: false */
/* global moment: false */

angular.module('openhimWebui2App')
  .controller('VisualizerCtrl', function ($scope, $http, $interval, login, Api) {
    var registries = [
      { 'comp': 'server1', 'desc': 'Server 1' },
      { 'comp': 'server2', 'desc': 'Server 2' },
      { 'comp': 'route-server3', 'desc': 'Server 3' }
    ];
    var endpoints = [
      { 'comp': 'channel-1', 'desc': '/channel1' },
      { 'comp': 'channel-2', 'desc': '/channel2' },
      { 'comp': 'channel-3', 'desc': '/channel3' }
    ];

    var himRect, himText;

    var visW = 900, visH = 400;
    var pad = 20;

    var himX = 0 + pad,
      himY = visH/2.0,
      himW = visW - 2.0*pad,
      himH = visH/4.0 - 2.0*pad;

    var inactiveColor = '#ccc',
      activeColor = '#555',
      errorColor = '#a55';

    var visualizerUpdateInterval;
    //How often to fetch updates from the server (in millis)
    var updatePeriod = 200;
    var diffTime;
    var lastUpdate;

    //play speed; 0 = normal, -1 = 2X slower, -2 = 3X slower, 1 = 2X faster, etc.
    var speed = 0;
    var maxSpeed = 4;


    var getRegistryRect = function getRegistryRect(name) {
      for (var i=0; i<registries.length; i++) {
        if (registries[i].comp.toLowerCase() === name.toLowerCase()) {
          return registries[i].rect;
        }
      }
      return null;
    };

    var getEndpointText = function getEndpointText(name) {
      for (var i=0; i<endpoints.length; i++) {
        if (endpoints[i].comp.toLowerCase() === name.toLowerCase()) {
          return endpoints[i].text;
        }
      }
      return null;
    };

    /* Component Drawing */

    var setupBasicComponent = function setupBasicComponent(compRect, compText, x, y, w, h, text) {
      compRect
        .attr('rx', 6)
        .attr('ry', 6)
        .attr('x', x)
        .attr('y', y)
        .attr('width', w)
        .attr('height', h)
        .style('fill', inactiveColor);

      var textSize = h/3.5;
      compText
        .attr('x', x + w/2.0)
        .attr('y', y + h/2.0 + textSize/2.0)
        .attr('text-anchor', 'middle')
        .attr('font-size', textSize)
        .text(text)
        .style('fill', '#000');
    };

    var setupRegistryComponent = function setupRegistryComponent(compRect, compText, compConnector, index, text) {
      var compW = visW/registries.length - 2.0*pad,
        compH = visH/4.0 - 2.0*pad;
      var compX = index*compW + pad + index*pad*2.0,
        compY = 0 + pad;

      setupBasicComponent(compRect, compText, compX, compY, compW, compH, text);

      compConnector
        .attr('x1', compX + compW/2.0)
        .attr('y1', compY + compH)
        .attr('x2', compX + compW/2.0)
        .attr('y2', himY)
        .style('stroke-width', visW/150.0)
        .style('stroke', '#ddd');
    };

    var setupEndpointText = function setupEndpointText(compText, index, text) {
      var compW = visW/endpoints.length - 2.0*pad,
        compH = (visH/4.0 - 2.0*pad) / 3.0;
      var compX = index*compW + pad + index*pad*2.0,
        compY = visH - pad;

      compText
        .attr('x', compX + compW/2.0)
        .attr('y', compY)
        .attr('text-anchor', 'middle')
        .attr('font-size', compH)
        .text(text)
        .style('fill', inactiveColor);
    };

    var setupHIM = function setupHIM(vis) {
      himRect = vis.append('svg:rect');
      himText = vis.append('svg:text');
      setupBasicComponent(himRect, himText, himX, himY, himW, himH, 'Health Information Mediator');

      vis.append('svg:rect')
        .attr('rx', 6)
        .attr('ry', 6)
        .attr('x', 0 + pad)
        .attr('y', visH*3.0/4.0)
        .attr('width', visW - 2.0*pad)
        .attr('height', visH/50.0)
        .style('fill', inactiveColor);
    };

    var setupRegistries = function setupRegistries(vis) {
      for (var i=0; i<registries.length; i++) {
        registries[i].rect = vis.append('svg:rect');
        registries[i].text = vis.append('svg:text');
        registries[i].line = vis.append('svg:line');
        setupRegistryComponent(registries[i].rect, registries[i].text, registries[i].line, i, registries[i].desc);
      }
    };

    var setupEndpoints = function setupEndpoints(vis) {
      for (var i=0; i<endpoints.length; i++) {
        endpoints[i].text = vis.append('svg:text');
        setupEndpointText(endpoints[i].text, i, endpoints[i].desc);
      }
    };

    /* Animation */

    var animateComp = function animateComp(comp, ev, delay, isError) {
      var color;
      var delayMultiplier = 1.0;

      if (ev.toLowerCase() === 'start') {
        color = activeColor;
      } else if (isError) {
        color = errorColor;
      } else {
        color = inactiveColor;
      }

      if (speed<0) {
        delayMultiplier = -1.0*speed + 1.0;
      } else if (speed>0) {
        delayMultiplier = 1.0 / (speed + 1.0);
      }

      comp
        .transition()
        .delay(delay * delayMultiplier)
        .style('fill', color);

      if (isError) {
        comp
          .transition()
          .delay(delay * delayMultiplier + 1000)
          .style('fill', inactiveColor);
      }
    };

    var processEvents = function processEvents(data) {
      if (data.length === 0) {
        return;
      }

      var baseTime = data[0].ts;
      var isErrorStatus = function(status) {
        return typeof status !== 'undefined' && status !== null && status.toLowerCase() === 'error';
      };

      angular.forEach(data, function(item) {
        var comp = null;

        comp = getRegistryRect(item.comp);
        if (comp === null) {
          comp = getEndpointText(item.comp);
          if (typeof comp !== 'undefined' && comp !== null) {
            animateComp(comp, item.ev, item.ts-baseTime, isErrorStatus(item.status));
            animateComp(himRect, item.ev, item.ts-baseTime, isErrorStatus(item.status));
          }
        } else {
          animateComp(comp, item.ev, item.ts-baseTime, isErrorStatus(item.status));
        }
      });
    };

    var play = function play() {
      $scope.showPlay = false;
      $scope.showPause = true;

      lastUpdate = (Date.now()-diffTime);
      visualizerUpdateInterval = $interval( function() {
        Api.VisualizerEvents.get({ receivedTime: lastUpdate}, function (events) {
          processEvents(events.events);
          lastUpdate = (Date.now()-diffTime);
        });
      }, updatePeriod);
    };

    var cancelVisualizerUpdateInterval = function() {
      if (angular.isDefined(visualizerUpdateInterval)) {
        $interval.cancel(visualizerUpdateInterval);
        visualizerUpdateInterval = undefined;
      }
    };

    $scope.play = play;

    $scope.pause = function pause() {
      $scope.showPlay = true;
      $scope.showPause = false;
      cancelVisualizerUpdateInterval();
    };

    $scope.$on('$destroy', cancelVisualizerUpdateInterval);

    var sync = function sync() {
      Api.VisualizerSync.get(function (sync) {
        diffTime = Date.now() - moment(sync.now);
        play();
      });
    };

    $scope.slowDown = function slowDown() {
      if (speed>-1*maxSpeed+1) {
        speed--;
      }
      $scope.speedText = speedText();
    };

    $scope.speedUp = function speedUp() {
      if (speed<maxSpeed-1) {
        speed++;
      }
      $scope.speedText = speedText();
    };

    var speedText = function speedText() {
      if (speed === 0) {
        return '';
      } else if (speed<0) {
        return (-1*speed+1) + 'X Slower';
      } else if (speed>0) {
        return (speed+1) + 'X Faster';
      }
    };

    /* */

    var vis = d3.select('#visualizer')
      .append('svg:svg')
      .attr('width', visW)
      .attr('height', visH);

    setupHIM(vis);
    setupRegistries(vis);
    setupEndpoints(vis);

    sync();

  });
