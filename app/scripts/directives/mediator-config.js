import mediatorConfigView from '~/views/partials/mediator-config.html'
// Mediator Config Directive
//
// Makes use of recursive rendering trick from here:
// http://sporto.github.io/blog/2013/06/24/nested-recursive-directives-in-angular/
export function mediatorConfig () {
  return {
    restrict: 'EA',
    scope: {
      configDefs: '=',
      config: '='
    },
    template: mediatorConfigView,
    link: function (scope) {
      scope.inputKeys = {}
      scope.inputValues = {}

      scope.removeMapping = function (param, mapping) {
        delete scope.config[param][mapping]
      }

      scope.addNewMapping = function (param) {
        if (!scope.config[param]) {
          scope.config[param] = {}
        }
        scope.config[param][scope.inputKeys[param]] = scope.inputValues[param]
        scope.inputKeys[param] = ''
        scope.inputValues[param] = ''
      }

      scope.doesNewKeyExist = function (param) {
        return scope.config[param] && scope.config[param][scope.inputKeys[param]]
      }

      scope.isNewKeyValid = function (param) {
        return scope.inputKeys[param] && !scope.doesNewKeyExist(param)
      }

      scope.inputKeysForArrays = {}
      scope.inputValuesForArrays = {}

      scope.removeMappingInArray = function (param, index, mapping) {
        delete scope.config[param][index][mapping]
      }

      scope.addNewMappingInArray = function (param, index) {
        if (!scope.config[param][index]) {
          scope.config[param][index] = {}
        }
        scope.config[param][index][scope.inputKeysForArrays[param + index]] = scope.inputValuesForArrays[param + index]
        scope.inputKeysForArrays[param + index] = ''
        scope.inputValuesForArrays[param + index] = ''
      }

      scope.doesNewKeyExistInArray = function (param, index) {
        return scope.config[param][index] && scope.config[param][index][scope.inputKeysForArrays[param + index]]
      }

      scope.isNewKeyValidInArray = function (param, index) {
        return scope.inputKeysForArrays[param + index] && !scope.doesNewKeyExistInArray(param, index)
      }

      scope.removeArrayItem = function (param, index) {
        scope.config[param].splice(index, 1)
      }

      scope.addNewArrayItem = function (def) {
        if (!scope.config[def.param]) {
          scope.config[def.param] = []
        }

        let newItem = ''
        switch (def.type) {
          case 'bool': newItem = false; break
          case 'number': newItem = 0; break
          case 'option': newItem = def.values[0]; break
          case 'map': newItem = {}; break
          case 'struct': newItem = {}; break
        }

        scope.config[def.param].push(newItem)
      }
    }
  }
}

export function mediatorNestedConfig ($compile) {
  return {
    restrict: 'EA',
    scope: {
      configDefs: '=',
      config: '='
    },
    template: '<div/>',
    link: function (scope, element) {
      if (scope.configDefs) {
        if (!scope.config) {
          scope.config = {}
        }

        element.append('<div mediator-config config-defs="configDefs" config="config"></div>')
        $compile(element.contents())(scope)
      }
    }
  }
}
