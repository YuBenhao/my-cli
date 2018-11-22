var url = getCurrentScript()
var sourceIndex, publicPath

if (!url) {
  throw Error('An unknown error.')
}

sourceIndex = url.lastIndexOf('/js/')

if (~sourceIndex) {
  publicPath = url.slice(0, sourceIndex + 1)
} else {
  throw Error('The publicPath test failed.')
}

__webpack_public_path__ = publicPath // eslint-disable-line

function getCurrentScript () {
  var doc = document
  var stack, i, scripts, script

  if (doc.currentScript) {
    return doc.currentScript.src
  }

  try {
    throw Error('intentionally')
  } catch (e) {
    stack = e.stack
    if (!stack && window.opera) {
      stack = (String(e).match(/of linked script \S+/g) || []).join(' ')
    }
  }

  if (stack) {
    stack = stack.split(/[@ ]/g).pop()
    stack = stack[0] === '(' ? stack.slice(1, -1) : stack
    return stack.replace(/(?::\d+)?:\d+$/i, '')
  }

  scripts = doc.getElementsByTagName('script')
  for (i = 0; (script = scripts[i++]);) {
    if (script.readyState === 'interactive') {
      return (script.className = script.src)
    }
  }
}
