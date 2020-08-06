import React from 'react'
import { Grid, Row, Col, Panel } from 'rsuite'
import MaleToFemale from './MaleToFemale'

const Analytics = () => {
  return (
    <Grid style={{ textAlign: 'center', marginTop: 50, minHeight: '50vh' }}>
      <Row>
        <Col xs={24} sm={24} md={24}>
          <Panel shaded bordered bodyFill style={{ minHeight: '50vh' }}>
            <Panel>
              <h1>إحصائيـــات عن المرضى</h1>
              <MaleToFemale />
            </Panel>
          </Panel>
        </Col>
      </Row>
    </Grid>
  )
}

export default Analytics
