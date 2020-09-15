import 'eonasdan-bootstrap-datetimepicker'

// Just exports the module name
export const moduleName = 'datetimepicker'
angular
  .module('datetimepicker', [])
  .provider('datetimepicker', function () {
    let defaultOptions = {}

    this.setOptions = function (options) {
      defaultOptions = options
    }

    this.$get = function () {
      return {
        getOptions: function () {
          return defaultOptions
        }
      }
    }
  })
  .directive('datetimepicker', [
    '$timeout',
    'datetimepicker',
    function ($timeout,
      datetimepicker) {
      const defaultOptions = datetimepicker.getOptions()

      return {
        require: '?ngModel',
        restrict: 'AE',
        scope: {
          datetimepickerOptions: '@'
        },
        link: function ($scope, $element, $attrs, ngModelCtrl) {
          const passedInOptions = $scope.$eval($attrs.datetimepickerOptions)
          const options = Object.assign({}, defaultOptions, passedInOptions)

          $element
            .on('dp.change', function (e) {
              if (ngModelCtrl) {
                $timeout(function () {
                  ngModelCtrl.$setViewValue(e.target.value)
                })
              }
            })
            .datetimepicker(options)

          function setPickerValue () {
            let date = options.defaultDate || null

            if (ngModelCtrl && ngModelCtrl.$viewValue) {
              date = ngModelCtrl.$viewValue
            }

            $element
              .data('DateTimePicker')
              .date(date)
          }

          if (ngModelCtrl) {
            ngModelCtrl.$render = function () {
              setPickerValue()
            }
          }

          setPickerValue()
        }
      }
    }
  ])
