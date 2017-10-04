export function SidebarCtrl ($scope, $location) {
  $scope.isCurrent = function (path) {
    if (path.length > 1 && $location.path().substr(0, path.length) === path) {
      return true
    } else if ($location.path() === path) {
      return true
    } else {
      return false
    }
  }

  $(window).scroll(function (e) {
    // Get the position of the location where the scroller starts.
    const scrollerAnchor = $('.scollNavAnchor').offsetParent().scrollTop()
    if (scrollerAnchor >= 50) {
      // show the scroll to button
      $('#scrollToTop').css('display', 'block')
      $('.header').css('box-shadow', '0px 0px 10px #888')
    } else {
      // hide the scroll to button
      $('#scrollToTop').css('display', 'none')
      $('.header').css('box-shadow', 'none')
    }
  })
}
