import 'source-map-support/register'
import 'babel-polyfill'
import express from 'express'
import Html from './components/Html'
import React from 'react'
import ReactDOM from 'react-dom/server'
import routes from './routes'
import UniversalRouter from 'universal-router'
import App from './components/App'
import assets from './assets'
import { port } from './config'

const app = express()
app.use(express.static('build/public'))

app.get('*', async (req, res, next) => {
  try {
    const css = new Set()
    const route = await UniversalRouter.resolve(routes, {
      path: req.path,
      query: req.query,
    })

    const context = {
      insertCss: (...styles) => {
        styles.forEach(style => css.add(style._getCss())) 
      }
    }

    const data = { ...route }
    data.children = ReactDOM.renderToString(<App context={context}>{route.component}</App>)
    data.style = [...css].join('')
    data.scripts = [
      assets.client.js
    ]
    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />)

    res.status(route.status || 200)
    res.send(`<!doctype html>${html}`)
  } catch(err) {
    next(err)
  }
})

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error">
    </Html>
  )
  res.status(err.status || 500)
  res.send(`<!doctype html>${html}`)
})

app.listen(port, () => {
  console.log('Server is running') //eslint-disable-line no-console
})
