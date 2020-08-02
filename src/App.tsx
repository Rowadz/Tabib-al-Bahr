import React from 'react'
import './App.scss'
import { HashRouter as Router, Route } from 'react-router-dom'
import 'rsuite/dist/styles/rsuite-default-rtl.css'
import { AppNav, Home, Patients, AddPatients } from './components'

function App() {
  return (
    <Router>
      <AppNav />
      <Route path="/" exact={true}>
        <Home />
      </Route>
      <Route path="/patients" exact={true}>
        <Patients />
      </Route>
      <Route path="/patients/add" exact={true}>
        <AddPatients />
      </Route>
      <Route path="/doctors"></Route>
      <Route path="/analytics"></Route>
    </Router>
  )
}

export default App
