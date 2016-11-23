import React from 'react'
import Home from './Home'
import Layout from '../../components/Layout'

export default {
  path: '/',
  async action() {
    return {
      title: 'Skreelnly',
      component: <Layout><Home /></Layout>,
    }
  }
}
