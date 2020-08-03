import React, { useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import { Grid, Row, Col, IconButton, Icon } from 'rsuite'
import { Link } from 'react-router-dom'
import * as firebase from 'firebase'
import { Patient, keys } from './patients.interface'

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
      {
        headerName: 'الرقم الوطني',
        field: 'patient_ID',
      },
      {
        headerName: 'المدينة',
        field: 'patient_city',
      },
      {
        headerName: 'معلومات إضافيه عن السكن',
        field: 'patient_city_extra',
      },
      {
        headerName: 'رقم الهاتف',
        field: 'patient_phone',
      },
      {
        headerName: 'السيره المرضية',
        field: 'patient_disease_history',
      },
      {
        headerName: 'المستوى الدراسي',
        field: 'patient_educational_lvl',
      },
      {
        headerName: 'التاريخ المرضي للعائلة',
        field: 'patient_family_history',
      },
      {
        headerName: 'تاريخ الأدويه',
        field: 'patient_medicine_history',
      },
      {
        headerName: 'تاريخ العمليات',
        field: 'patient_surgery_history',
      },
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
    const startObj = keys.reduce((prev, curr) => ({ ...prev, [curr]: '' }), {})
    db.collection('patients')
      .get()
      .then((data) => {
        data.forEach((doc) => {
          patients.push({ ...startObj, ...doc.data(), id: doc.id } as Patient)
        })
        setSate({ ...state, rowData: patients as any })
      })
  }, [])
  console.log(state.rowData)
  return (
    <Grid fluid style={{ marginTop: 10 }}>
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
