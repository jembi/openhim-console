import 'moment-timezone'
import moment from 'moment'

import * as CryptoJS from 'crypto-js'
import { pd } from 'pretty-data'

export function valueEmpty (value) {
  return /^\s*$/.test(value || ' ')
}

export function valueNotEmpty (value) {
  return !valueEmpty(value)
}

export function isBase64String (string) {
  return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})([=]{1,2})?$/.test(string)
}

export function decodeBase64 (stringToBeDecoded) {
  // decrypt
  const base64Value = CryptoJS.enc.Base64.parse(stringToBeDecoded)
  const decodeBase64Value = base64Value.toString(CryptoJS.enc.Utf8)
  return decodeBase64Value
}

export function getHashAndSalt (stringToBeHashed) {
  const salt = CryptoJS.lib.WordArray.random(16).toString()
  const sha512 = CryptoJS.algo.SHA512.create()
  sha512.update(salt)
  sha512.update(stringToBeHashed)
  const hash = sha512.finalize()
  return {
    hash: hash.toString(CryptoJS.enc.Hex),
    salt: salt,
    algorithm: 'sha512'
  }
}

// location provider
export function viewPage (path) {
  const url = window.location.href + path
  window.location = url
}

export function isValidMSISDN (inputtxt) {
  const numRegex = /^([1-9]\d{1})([0-9]{3,13})$/
  return (inputtxt || '').match(numRegex)
}

export function returnContentType (objectHeaders) {
  if (objectHeaders == null) {
    return undefined
  }
  const [contentKey = 'Content-Type'] = Object.keys(objectHeaders).filter(k => /^content-type$/i.test(k))
  return objectHeaders[contentKey]
}

export function beautifyIndent (type, content) {
  try {
    if (type.indexOf('text/xml') >= 0 || type.indexOf('application/xml') >= 0) {
      return { lang: 'xml', content: pd.xml(content, 2) }
    }

    if (type.indexOf('text/json') >= 0 || type.indexOf('application/json') >= 0) {
      return { lang: 'json', content: pd.json(content, 2) }
    }

    if (type.indexOf('text/html') >= 0 || type.indexOf('application/html') >= 0) {
      return { lang: 'html', content: pd.xml(content, 2) }
    }

    // {anything}application/{word characters}+xml{anything}.
    if (/.*application\/\w+\+xml.*/.test(type)) {
      return { lang: 'xml', content: pd.xml(content, 2) }
    }
  } catch (err) {
    console.log(err)
    return { lang: '', content: content }
  }

  // if not applicable then return as is
  return { lang: '', content: content }
}

export function isCoreVersionCompatible (minVersion, actualVersion) {
  const v1 = minVersion.split('.')
  const v2 = actualVersion.split('.')

  if (v1[0] <= v2[0]) {
    if (v1[1] <= v2[1]) {
      return true
    }
  }
  return false
}

export function buildBlob (data, datatype) {
  let out
  try {
    out = new Blob([data], { type: datatype })
  } catch (e) {
    const BlobBuilder = function () {
      window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder
    }

    if (e.name === 'TypeError' && window.BlobBuilder) {
      const bb = new BlobBuilder()
      bb.append(data)
      out = bb.getBlob(datatype)
    } else if (e.name === 'InvalidStateError') {
      // InvalidStateError (tested on FF13 WinXP)
      out = new Blob([data], { type: datatype })
    } else {
      out = { error: 'Browser not supported for Blob creation' }
      // We're screwed, blob constructor unsupported entirely
    }
  }
  return out
}

export function getTimeForTimezone (timezone) {
  if (timezone) {
    const timezoneDatetime = moment(new Date()).tz(timezone)
    return moment(timezoneDatetime).format('YYYY-MM-DD HH:mm:ss Z')
  }
}

export function getTimezoneOffset (timezone) {
  const timezoneDatetime = moment(new Date()).tz(timezone)
  return moment(timezoneDatetime).format('Z')
}

export function safe (fn, defaultValue = undefined) {
  try {
    return fn() || defaultValue
  } catch (err) {
    console.log(err)
    return defaultValue
  }
}

export function wait (timeout = 100) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout)
  })
}

export function camelcaseToHtmlAttr (input) {
  if (valueEmpty(input)) {
    return input
  }

  const matches = input.match(/([A-Z]*[a-z|\d]+)/g) || []
  return matches.map(m => m.toLowerCase()).join('-')
}

export function * objectVisitor (visitObj, visitPath = []) {
  if (visitObj == null) {
    return
  }

  for (const key in visitObj) {
    const value = visitObj[key]
    const currentPath = [...visitPath, key]
    if (typeof value === 'object') {
      yield * objectVisitor(value, currentPath)
    } else {
      yield {
        path: currentPath,
        value
      }
    }
  }
}
