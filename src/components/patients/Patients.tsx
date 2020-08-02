import React, { useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import { Grid, Row, Col, IconButton, Icon } from 'rsuite'
import { Link } from 'react-router-dom'

export default function Patients() {
  const [state] = useState({
    columnDefs: [
      {
        headerName: 'اسم المريض',
        field: 'make',
      },
      {
        headerName: 'الجنس',
        field: 'model',
      },
      {
        headerName: 'تاريخ اخر زياره',
        field: 'price',
      },
    ],
    rowData: [
      {
        make: 'محمد الرواد',
        model: 'ذكر',
        price: 35000,
      },
      {
        make: 'سيف الرواد',
        model: 'ذكر',
        price: 32000,
      },
      {
        make: 'زهره',
        model: 'انثى',
        price: 72000,
      },
    ],
    defaultColDef: {
      editable: true,
      sortable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
      resizable: true,
    },
  })
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
