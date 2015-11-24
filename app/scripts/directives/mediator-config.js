'use strict';
// Mediator Config Directive
//
// Makes use of recursive rendering trick from here:
// http://sporto.github.io/blog/2013/06/24/nested-recursive-directives-in-angular/

angular.module('openhimConsoleApp')
  .directive('mediatorConfig', function(){
    return{
      restrict: 'EA',
      scope: {
        configDefs: '=',
        config: '='
      },
      templateUrl: 'views/partials/mediator-config.html',
      link: function(scope){
        scope.inputKeys = {};
        scope.inputValues = {};

        scope.removeMapping = function (param, mapping) {
          delete scope.config[param][mapping];
        };

        scope.addNewMapping = function (param) {
          if (!scope.config[param]) {
            scope.config[param] = {};
          }
          scope.config[param][scope.inputKeys[param]] = scope.inputValues[param];
          scope.inputKeys[param] = '';
          scope.inputValues[param] = '';
        };

        scope.doesNewKeyExist = function (param) {
          return scope.config[param] && scope.config[param][scope.inputKeys[param]];
        };

        scope.isNewKeyValid = function (param) {
          return scope.inputKeys[param] && !scope.doesNewKeyExist(param);
        };
      }
    };
  })
  .directive('mediatorNestedConfig', function($compile){
    return{
      restrict: 'EA',
      scope: {
        configDefs: '=',
        config: '='
      },
      template: '<div/>',
      link: function(scope, element){
        if (scope.configDefs) {
          if (!scope.config) {
            scope.config = {};
          }

          element.append('<div mediator-config config-defs="configDefs" config="config"/>');
          $compile(element.contents())(scope);
        }
      }
    };
  });
