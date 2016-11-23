import 'babel-polyfill'
import React from 'react'
import UniversalRouter from 'universal-router'
import ReactDOM from 'react-dom'
import history from './core/history'
import queryString from 'query-string'
import App from './components/App'
import { default as routes } from './routes'

const context = {
  insertCss: (...styles) => {
    const removeCss = styles.map(x => x._insertCss())
    return () => { removeCss.forEach( f => f()) }
  }
}

function updateTag(tagName, keyName, keyValue, attrName, attrValue) {
  const node = document.head.querySelector(`${tagName}[${keyName}="${keyValue}"]`)
  if (node && node.getAttribute(attrName) == attrValue) return

  // Remove and create a new tag in order to make it work with bookmarks in Safari
  if (node) {
    node.parentNode.removeChild(node)
  }
  if (typeof attrValue === 'string') {
    const nextNode = document.createElement(tagName)
    nextNode.setAttribute(keyName, keyValue)
    nextNode.setAttribute(attrName, attrValue)
    document.head.appendChild(nextNode)
  }
}

function updateMeta(name, content) {
  updateTag('meta', 'name', name, 'content', content)
}

let onRenderComplete = function initialRenderComplete() {
  const elem = document.getElementById('css')
  if (elem) elem.parentNode.removeChild(elem)
  onRenderComplete = function renderComplete(route, location) { // eslint-disable-line no-unused-vars
    document.title = route.title
    updateMeta('description', route.description)
  }
}

let currentLocation = history.location
const container = document.getElementById('app')

async function onLocationChange(location) {
  currentLocation = location
  const route = await UniversalRouter.resolve(routes, {
    path: location.pathname,
    query: queryString.parse(location.search),
  })

  ReactDOM.render(
    <App context={context}>{route.component}</App>,
    container, () => onRenderComplete(route, location),
  )
}

onLocationChange(currentLocation)
