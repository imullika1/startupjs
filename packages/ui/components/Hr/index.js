import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Row from './../Row'
import { View } from 'react-native'
import './index.styl'

function Hr ({
  style,
  children,
  align
}) {
  return pug`
    Row.root(vAlign='center' style=style)
      View.hr(styleName={full: ['right', 'center'].includes(align)})
      if children
        View.content
          = children
      View.hr(styleName={full: ['left', 'center'].includes(align)})
  `
}

Hr.defaultProps = {
  align: 'center'
}

Hr.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  align: propTypes.oneOf(['left', 'center', 'right'])
}

export default observer(Hr)
