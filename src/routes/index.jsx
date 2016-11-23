export default {
  path: '/',

  children: [
    require('./home').default,
    require('./notFound').default,
  ],

  async action({ next }) {
    const route = await next()

    route.title = `${route.title || 'Untitled Page'} - Skreenly`,
    route.description = route.description || ''

    return route
  },
}
