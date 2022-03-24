import React from 'react'
import { Platform } from 'react-native'
import init from 'startupjs/init'
import App from 'startupjs/app'
import { pug, observer, model } from 'startupjs'
import baseUrl from 'startupjs/baseUrl'
import orm from '../model'

// Frontend micro-services
import * as main from '../main'

if (Platform.OS === 'web') window.model = model

// Init startupjs connection to server and the ORM.
// baseUrl option is required for the native to work - it's used
// to init the websocket connection and axios.
// Initialization must start before doing any subscribes to data.
init({ baseUrl, orm })

export default observer(() => {
  return pug`
    App(
      apps={main}
    )
  `
})
