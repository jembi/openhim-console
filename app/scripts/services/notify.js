export function Notify ($rootScope) {
  const notifyService = {}

  notifyService.notify = function (event) {
    $rootScope.$broadcast(event)
  }

  return notifyService
}
