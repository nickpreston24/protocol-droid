 // Lego version 2.0.0-beta.7
  import { h, Component } from './lego.min.js'
  

  
    const state = {color: '#e4a', saber: 'rgba(0, 255, 0, 0.5)'}


  const __template = function({ state }) {
    return [  
    h("h1", {}, `User profile`),
    h("p", {}, [
`important information:
        `,
      h("slot", {}, "")
    ])
  ]
  }

  const __style = function({ state }) {
    return h('style', {}, `
      
      
        h1 {
            color: ${ state.color };
            text-shadow: 4px 6px 8px ${ state.saber };
        }
    
    `)
  }

  // -- Lego Core
  export default class Lego extends Component {
    init() {
      this.useShadowDOM = true
      if(typeof state === 'object') this.__state = Object.assign({}, state, this.__state)
      if(typeof connected === 'function') this.connected = connected
      if(typeof setup === 'function') setup.bind(this)()
    }
    get vdom() { return __template }
    get vstyle() { return __style }
  }
  // -- End Lego Core

  
