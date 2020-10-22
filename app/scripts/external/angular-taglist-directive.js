import template from './angular-taglist-directive.html'

export const angularTaglist = 'angular_taglist_directive'

angular.module(angularTaglist, []).directive('taglist', ['$timeout', function ($timeout) {
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      tagData: '=',
      taglistBlurTimeout: '='
    },
    transclude: true,
    template: template,
    compile: function (tElement, tAttrs, transcludeFn) {
      return function (scope, element, attrs) {
        element.bind('click', function () {
          element[0].getElementsByTagName('input')[0].focus()
        })

        const input = angular.element(element[0].getElementsByTagName('div')[0].getElementsByTagName('input')[0])

        input.bind('blur', function () {
          if (scope.taglistBlurTimeout) {
            $timeout(function () {
              addTag(input[0])
            }, scope.taglistBlurTimeout)
          } else {
            addTag(input[0])
          }
        })
        input.bind('keydown', function (evt) {
          if (evt.altKey || evt.metaKey || evt.ctrlKey || evt.shiftKey) {
            return
          }
          if (evt.which === 188 || evt.which === 13) { // 188 = comma, 13 = return
            evt.preventDefault()
            addTag(this)
          } else if (evt.which === 8 && /* 8 = delete */
                        this.value.trim().length === 0 &&
                        element[0].getElementsByClassName('tag').length > 0) {
            evt.preventDefault()
            scope.$apply(function () {
              scope.tagData.splice(scope.tagData.length - 1, 1)
            })
          }
        })

        function addTag (element) {
          if (!scope.tagData) {
            scope.tagData = []
          }
          const val = element.value.trim()
          if (val.length === 0) {
            return
          }
          if (scope.tagData.indexOf(val) >= 0) {
            return
          }
          scope.$apply(function () {
            scope.tagData.push(val)
            element.value = ''
          })
        }
      }
    }
  }
}])
