import React from 'react'
import PropTypes from 'prop-types'
import Terminal from './Terminal'
import termContent from './contentHandler'

class Renderer extends React.Component {
  constructor(props) {
    super(props)
    this.content = termContent(props.lines)
    this.state = {
      lines: this.content.next().value
    }
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      const { value, done } = this.content.next()
      this.setState({
        lines: value
      })
      if (done) {
        clearInterval(this.timer)
      }
    }, this.props.interval)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  componentDidUpdate(prevProps) {
    if(JSON.stringify(prevProps.lines) !== JSON.stringify(this.props.lines)) {
      clearInterval(this.timer)
      this.content = termContent(this.props.lines)

      this.timer = setInterval(() => {
        const { value, done } = this.content.next()
        this.setState({
          lines: value
        })
        if (done) {
          clearInterval(this.timer)
        }
      }, this.props.interval)
    }
  }

  render() {
    return (
      <Terminal
        {...this.props}
      >
        {this.state.lines}
      </Terminal>
    )
  }
}

Renderer.defaultProps = {
  interval: 100,
  lines: []
}

Renderer.propTypes = {
  interval: PropTypes.number,
  lines: PropTypes.array,
}

export default Renderer
