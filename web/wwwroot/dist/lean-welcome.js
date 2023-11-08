 // Lego version 2.0.0-beta.7
  import { h, Component } from './lego.min.js'
  

  

  const __template = function({ state }) {
    return [  
    h("h1", {"style": `color: #4a90e2;`}, [
`Welcome to Protocol Droid
        `,
      h("sl-icon", {"class": `bg-accent text-accent`, "style": `{color: #1b6ec2}`, "name": `android`}, "")
    ]),
    h("p", {}, [
`The fast way to refactor!
        `,
      h("slot", {}, "")
    ])
  ]
  }

  const __style = function({ state }) {
    return h('style', {}, `
      
      
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

  
