import * as configDisplay from '~/views/partials/mediator-config-display.html'
// Mediator Config Display Directive
//
// Makes use of recursive rendering trick from here:
// http://sporto.github.io/blog/2013/06/24/nested-recursive-directives-in-angular/

export function mediatorConfigDisplay () {
  return {
    restrict: 'EA',
    scope: {
      configDefs: '=',
      config: '='
    },
    template: configDisplay,
    link: function (scope) {
      scope.mediatorDefsMap = {}

      scope.$watch('configDefs', function (configDefs) {
        if (configDefs) {
          configDefs.map(function (def) {
            scope.mediatorDefsMap[def.param] = def
          })
        }
      })
    }
  }
}

export function mediatorNestedConfigDisplay ($compile) {
  return {
    restrict: 'EA',
    scope: {
      configDefs: '=',
      config: '='
    },
    template: '<div/>',
    link: function (scope, element) {
      if (scope.config) {
        element.append('<div mediator-config-display config-defs="configDefs" config="config"></div>')
        $compile(element.contents())(scope)
      }
    }
  }
}
