import React from 'react'
import './App.scss'
import { HashRouter as Router, Route } from 'react-router-dom'
import 'rsuite/dist/styles/rsuite-default-rtl.css'
import 'froala-editor/css/froala_style.min.css'
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'froala-editor/js/plugins/font_size.min.js'
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
        <Route path="/patients/add/:id" exact={true}>
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
