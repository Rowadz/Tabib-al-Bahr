import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { IntlProvider } from 'rsuite'
import { IntlProviderProps } from 'rsuite/lib/IntlProvider'

function RTL(props: IntlProviderProps) {
  return <IntlProvider rtl>{props.children}</IntlProvider>
}

ReactDOM.render(
  <RTL>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </RTL>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
