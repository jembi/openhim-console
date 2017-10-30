export function auditOperation () {
  return {
    restrict: 'E',
    templateUrl: 'views/partials/audit-operation.html',
    scope: {
      audit: '=audit'
    },
    link: (scope, element, attrs) => {
      scope.expanded = false

      scope.toggleExpanded = () => {
        scope.expanded = !scope.expanded
      }

      scope.isObject = maybeObject => {
        return (
          typeof maybeObject !== 'string' &&
          typeof maybeObject !== 'boolean' &&
          typeof maybeObject !== 'number'
        )
      }
    }
  }
}
