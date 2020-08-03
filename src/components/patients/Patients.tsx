import React, { useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import { Grid, Row, Col, IconButton, Icon } from 'rsuite'
import { Link } from 'react-router-dom'
import * as firebase from 'firebase'
import { Patient } from './patients.interface'

export default function Patients() {
  const [state, setSate] = useState({
    columnDefs: [
      {
        headerName: 'اسم المريض',
        field: 'patient_name',
        cellRendererFramework: ({ value, data }: any) => {
          return <Link to={`/display/patients/${data.id}`}>{value}</Link>
        },
      },
      {
        headerName: 'الجنس',
        field: 'patient_sex',
      },
      //   {
      //     headerName: 'معلومـات إضافية',
      //     field: 'patient_extra_info',
      //   },
    ],
    rowData: [],
    defaultColDef: {
      editable: true,
      sortable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
      resizable: true,
    },
  })
  useEffect(() => {
    const db = firebase.firestore()
    const patients: Array<Patient> = []
    db.collection('patients')
      .get()
      .then((data) => {
        data.forEach((doc) => {
          console.log(doc)
          patients.push({ ...doc.data(), id: doc.id } as Patient)
        })
        setSate({ ...state, rowData: patients as any })
      })
  }, [])
  return (
    <Grid style={{ padding: 70 }}>
      <Row>
        <Col xs={24} sm={24} md={24}>
          <Link to="/patients/add">
            <IconButton icon={<Icon icon="plus" />} color="blue">
              إضافــة مريــض
            </IconButton>
          </Link>
        </Col>
        <Col xs={24} sm={24} md={24} style={{ marginTop: 10 }}>
          <div
            className="ag-theme-alpine"
            style={{
              height: '100vh',
              width: '100%',
            }}
          >
            <AgGridReact
              columnDefs={state.columnDefs}
              rowData={state.rowData}
              defaultColDef={state.defaultColDef}
              enableRtl={true}
            ></AgGridReact>
          </div>
        </Col>
      </Row>
    </Grid>
  )
}
