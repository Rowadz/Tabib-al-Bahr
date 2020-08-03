import React from 'react'
import './App.scss'
import { HashRouter as Router, Route } from 'react-router-dom'
import 'rsuite/dist/styles/rsuite-default-rtl.css'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import {
  AppNav,
  Home,
  Patients,
  AddPatients,
  PatientProfile,
} from './components'
import { SuspenseWithPerf } from 'reactfire'

function App() {
  return (
    <SuspenseWithPerf fallback={'تحميــــل .....'} traceId={'load'}>
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
        <Route path="/display/patients/:id" exact={true}>
          <PatientProfile />
        </Route>
        <Route path="/doctors"></Route>
        <Route path="/analytics"></Route>
      </Router>
    </SuspenseWithPerf>
  )
}

export default App
