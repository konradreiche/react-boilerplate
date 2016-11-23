import React, { PureComponent, PropTypes } from 'react'

const ContextType = {
  inesrtCss: PropTypes.func.isRequired,
}

class App extends PureComponent {

  static propTypes = {
    context: PropTypes.shape(ContextType).isRequired,
    children: PropTypes.element.isRequired,
  };

  static childContextTypes = ContextType

  getChildrenContext() {
    return this.props.context
  }

  render() {
    return React.Children.only(this.props.children)
  }

}

export default App
