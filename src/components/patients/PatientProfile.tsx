import React from 'react'
import { useParams } from 'react-router-dom'
import { useFirestoreDocData, useFirestore } from 'reactfire'
import { Grid, Row, Col, Divider, Panel } from 'rsuite'

export default function PatientProfile() {
  const { id } = useParams()
  const burritoRef = useFirestore().collection('patients').doc(id)

  const { patient_name, patient_sex, patient_extra_info } = useFirestoreDocData(
    burritoRef
  )
  return (
    <Grid style={{ padding: 70 }}>
      <Row>
        <Col xs={24} sm={24} md={24}>
          <Panel shaded bordered bodyFill style={{ display: 'inline-block' }}>
            <Panel>
              <h4>الاسم: {patient_name}</h4>
              <h4>الجنس: {patient_sex}</h4>
              <h5>معلومات اضافيه: {patient_extra_info}</h5>
            </Panel>
          </Panel>
        </Col>
        <Col xs={24} sm={24} md={24}>
          <Divider>خيــارات</Divider>
        </Col>
      </Row>
    </Grid>
  )
}
