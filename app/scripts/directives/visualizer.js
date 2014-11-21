'use strict';
/* global d3: false */
// Visualizer Directive

angular.module('openhimWebui2App')
  .directive('visualizer', function($parse){
    return{
      restrict:'EA',
      template:'<div id="visualizer"></div>',
      link: function(scope, elem, attrs){
        // initialize directive data elements
        var data = $parse(attrs.visData);
        var settings = $parse(attrs.visSettings);
        var speedVal = $parse(attrs.visSpeed);

        // initialize global variables
        var components = [];
        var endpoints = [];
        var himRect, himText, visW, visH, pad, himX, himY, himW, himH,
          inactiveColor, activeColor, errorColor, textColor, speed, maxTimeout, vis;

        /* ---------- Directive Watchers ---------- */

        // watcher to update the speed of the visualizer
        scope.$watchCollection(speedVal, function(newSpeed){
          // check if data object exist before processing
          if ( newSpeed !== undefined ){
            speed = newSpeed;
          }
        });

        // watcher to find any new event data added
        scope.$watchCollection(data, function(newData){
          // check if data object exist before processing
          if ( newData && newData.length > 0 ){
            processEvents(newData);
          }
        });

        // watcher to find any settings added
        scope.$watchCollection(settings, function(newSettings){
          // check if settings object exist before creating
          if ( newSettings ){

            components = newSettings.components;
            endpoints = newSettings.endpoints;

            visW = newSettings.visW;
            visH = newSettings.visH;
            pad = newSettings.pad;

            himX = 0 + pad;
            himY = visH/2.0;
            himW = visW - 2.0*pad;
            himH = visH/4.0 - 2.0*pad;

            inactiveColor = newSettings.inactiveColor;
            activeColor = newSettings.activeColor;
            errorColor = newSettings.errorColor;
            textColor = newSettings.textColor;

            speed = newSettings.speed;
            maxTimeout = newSettings.maxTimeout;

            // load responsive visualizer
            if ( newSettings.visResponsive === true ){
              vis = d3.select('#visualizer')
                .append('svg:svg')
                .attr('viewBox', '0 0 ' + newSettings.visW + ' ' + newSettings.visH )
                .attr('preserveAspectRatio', 'xMinYMin');

              vis.append('svg:rect')
                .attr('width', newSettings.visW)
                .attr('height', newSettings.visH);
            }else{
              // setup fixed size visualizer
              vis = d3.select('#visualizer')
                .append('svg:svg')
                .attr('width', newSettings.visW)
                .attr('height', newSettings.visH);
            }

            // setup the visualizer diagram
            setupHIM(vis);
            setupRegistries(vis);
            setupEndpoints(vis);

          }
        });

        /* ---------- Directive Watchers ---------- */
        


        function getRegistryRect(name) {
          for (var i=0; i<components.length; i++) {
            if (components[i].comp.toLowerCase() === name.toLowerCase()) {
              return components[i].rect;
            }
          }
          return null;
        }

        function getEndpointText(name) {
          for (var i=0; i<endpoints.length; i++) {
            if (endpoints[i].comp.toLowerCase() === name.toLowerCase()) {
              return endpoints[i].text;
            }
          }
          return null;
        }

        /* Component Drawing */

        function setupBasicComponent(compRect, compText, x, y, w, h, text) {
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
            .style('fill', textColor);
        }

        function setupRegistryComponent(compRect, compText, compConnector, index, text) {
          var compW = visW/components.length - 2.0*pad,
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
        }

        function setupEndpointText(compText, index, text) {
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
        }

        function setupHIM(vis) {

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
        }

        function setupRegistries(vis) {
          for (var i=0; i<components.length; i++) {
            components[i].rect = vis.append('svg:rect');
            components[i].text = vis.append('svg:text');
            components[i].line = vis.append('svg:line');
            setupRegistryComponent(components[i].rect, components[i].text, components[i].line, i, components[i].desc);
          }
        }

        function setupEndpoints(vis) {
          for (var i=0; i<endpoints.length; i++) {
            endpoints[i].text = vis.append('svg:text');
            setupEndpointText(endpoints[i].text, i, endpoints[i].desc);
          }
        }

        /* Animation */

        function animateComp(comp, ev, delay, isError) {
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

          if (ev.toLowerCase() === 'start' || isError) {

            var timeout;
            if ( isError ){
              timeout = 1000;
            }else{
              timeout = maxTimeout;
            }

            comp
              .transition()
              .delay(delay * delayMultiplier + timeout)
              .style('fill', inactiveColor);
          }
        }

        function processEvents(data) {
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
        }
       

      }
    };
  });