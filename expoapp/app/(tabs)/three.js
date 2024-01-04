import { pug, styl } from 'startupjs'

import EditScreenInfo from '@/components/EditScreenInfo'
import { Text, View } from '@/components/Themed'

export default function TabThreeScreen () {
  return pug`
    View.container
      Text.title Tab Three
      View.separator(lightColor='#eee' darkColor='rgba(255,255,255,0.1)')
      EditScreenInfo(path='app/(tabs)/three.js')
  `
}

styl`
  .container
    flex 1
    align-items center
    justify-content center
  .title
    font-size 20px
    font-weight bold
  .separator
    margin 30px 0
    height 1px
    width 80%
`
