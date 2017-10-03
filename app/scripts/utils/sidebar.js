export function toggleSubMenu (element) {
  let $li = $(element).parent('li')
  let $ul = $(element).next('ul')

  if ($li.hasClass('open')) {
    $ul.slideUp(350)
    $li.removeClass('open')
  } else {
    $('.nav > li > ul').slideUp(350)
    $('.nav > li').removeClass('open')
    $ul.slideDown(350)
    $li.addClass('open')
  }
}
