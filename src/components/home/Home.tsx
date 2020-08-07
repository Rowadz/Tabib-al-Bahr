import React from 'react'
// import doctor1 from './doctor1.svg'
// import doctor2 from './doctor2.svg'
import logo from './logo.jpeg'
import { Grid, Row, Col, Panel } from 'rsuite'

export default function Home() {
  return (
    <Grid style={{ padding: 70, textAlign: 'center' }}>
      <Row>
        <Col xs={24} sm={24} md={24}>
          <Panel bodyFill style={{ display: 'inline-block' }}>
            <img src={logo} alt="doctor1" width="100%" height="auto" />
          </Panel>
        </Col>
      </Row>
      {/* <Row>
        <Col xs={24} sm={24} md={12}>
          <Panel bodyFill style={{ display: 'inline-block' }}>
            <img src={doctor1} alt="doctor1" width="100%" height="auto" />
            <Panel>
              <h1>نظام بسيط لإداره العيادات</h1>
            </Panel>
          </Panel>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Panel bodyFill style={{ display: 'inline-block' }}>
            <img src={doctor2} alt="doctor2" width="100%" height="auto" />
            <Panel>
              <h1>يمكنك إضافـة معلومات عن المرضى و رؤية إحصائيـات</h1>
            </Panel>
          </Panel>
        </Col>
      </Row> */}
    </Grid>
  )
}
