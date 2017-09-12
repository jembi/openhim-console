'use strict';

import $ from "jquery";

export function toggleSubMenu(element) {
  var $li = $(element).parent('li');
  var $ul = $(element).next('ul');

  if($li.hasClass('open')) {
    $ul.slideUp(350);
    $li.removeClass('open');
  } else {
    $('.nav > li > ul').slideUp(350);
    $('.nav > li').removeClass('open');
    $ul.slideDown(350);
    $li.addClass('open');
  }
}