'use strict';
/* global CryptoJS:false */
/* global vkbeautify:false */
/* exported isBase64String */
/* exported decodeBase64 */
/* exported getHashAndSalt */
/* exported viewPage */
/* exported isValidMSISDN */
/* exported returnContentType */
/* exported beautifyIndent */
/* exported valueNotEmpty */
/* exported isCoreVersionCompatible */


var valueNotEmpty = function(value){
  if ( value !== null && value !== undefined && value !== '' ) {
    return true;
  }
  return false;
};


function isBase64String(string){
  var base64Matcher = new RegExp('^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})([=]{1,2})?$');
  return base64Matcher.test( string);
}

function decodeBase64(stringToBeDecoded) {
  //decrypt
  var base64Value = CryptoJS.enc.Base64.parse( stringToBeDecoded );
  var decodeBase64Value = base64Value.toString( CryptoJS.enc.Utf8 );
  return decodeBase64Value;
}


function getHashAndSalt(stringToBeHashed) {
  var salt = CryptoJS.lib.WordArray.random(16).toString();
  var sha512 = CryptoJS.algo.SHA512.create();
  sha512.update(salt);
  sha512.update(stringToBeHashed);
  var hash = sha512.finalize();
  return  {
    hash: hash.toString(CryptoJS.enc.Hex),
    salt: salt,
    algorithm: 'sha512'
  };
}


//location provider
function viewPage(path) {
  var url = window.location.href+path;
  window.location = url;
}

function isValidMSISDN(inputtxt){
  if ( inputtxt ){
    var numRegex = /^([1-9]\d{1})([0-9]{3,13})$/;
    if ( inputtxt.match(numRegex) ){
      return true;
    } else {
      return false;
    }
  }
}



function returnContentType( objectHeaders ){

  var contentType = '';

  if ( objectHeaders['Content-Type'] ){
    contentType = objectHeaders['Content-Type'];
  }else if ( objectHeaders['content-type'] ){
    contentType = objectHeaders['content-type'];
  }

  return contentType;

}

function beautifyIndent(type, content){

  try {

    if ( type.indexOf('text/xml') >= 0 || type.indexOf('application/xml') >= 0 ){
      return { lang: 'xml', content: vkbeautify.xml(content, 2 ) };
    }

    if ( type.indexOf('text/json') >= 0 || type.indexOf('application/json') >= 0 ){
      return { lang: 'json', content: vkbeautify.json(content, 2 ) };
    }

    if ( type.indexOf('text/html') >= 0 || type.indexOf('application/html') >= 0 ){
      return { lang: 'html', content: vkbeautify.xml(content, 2 ) };
    }

    // {anything}application/{word characters}+xml{anything}.
    if( /.*application\/\w+\+xml.*/.test(type) ){
      return { lang: 'xml', content: vkbeautify.xml(content, 2 ) };
    }

  }catch(err) {
    return { lang: '', content: content};
  }

  // if not applicable then return as is
  return { lang: '', content: content};

}

function isCoreVersionCompatible(minVersion, actualVersion) {
  var v1 = minVersion.split('.');
  var v2 = actualVersion.split('.');
  
  if(v1[0] === v2[0]) {
    if(v1[1] === v2[1]) {
      return true;
    }
  }
  return false;
}
