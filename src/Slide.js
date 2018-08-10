import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { space, color } from 'styled-system'
import createFocusTrap from 'focus-trap'
import { modes } from './index'

const Context = React.createContext(null)

export const withSlide = Component => props =>
  <Context.Consumer>
    {slide => (
      <Component
        {...props}
        slide={slide}
      />
    )}
  </Context.Consumer>

const Root = styled.div([], {
  flex: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  overflow: 'hidden',
  width: '100%',
  height: '100%',
  '@media print': {
    width: '100vw',
    height: '100vh',
    pageBreakAfter: 'always',
    pageBreakInside: 'avoid',
    WebkitPrintColorAdjust: 'exact'
  }
}, space, color)

class Slide extends React.Component {
  root = React.createRef()
  trap = null

  componentDidMount () {
    console.log(this.root, this.root.current)
    this.trap = createFocusTrap(this.root.current)
  }

  componentDidUpdate (prev) {
    const { active, mode } = this.props
    console.log(active, mode)
    if (prev.active === active && prev.mode === mode) return
    // requires querystring fix
    // if (active && mode === modes.normal) {
    if (active) {
      console.log('activate')
      try {
        this.trap.activate()
      } catch (e) {}
    } else {
      console.log('deactivate')
      this.trap.deactivate()
    }
  }

  render () {
    const {
      index,
      active,
      mode,
      ...props
    } = this.props
    return (
      <Context.Provider value={{ index }}>
        <Root
          {...props}
          innerRef={this.root}
        />
      </Context.Provider>
    )
  }
}

Slide.propTypes = {
  index: PropTypes.number.isRequired,
  ...space.propTypes,
  ...color.propTypes
}

Slide.defaultProps = {
  px: [ 4, 5, 6 ]
}

export default Slide
