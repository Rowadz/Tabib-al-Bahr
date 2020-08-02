import React from 'react'
import doctor1 from './doctor1.svg'
import doctor2 from './doctor2.svg'
import { Grid, Row, Col } from 'rsuite'

export default function Home() {
  return (
    <Grid style={{ padding: 70 }}>
      <Row>
        <Col xs={24} sm={24} md={12} style={{ padding: 70 }}>
          <img src={doctor1} alt="doctor1" width="100%" height="200" />
        </Col>
        <Col xs={24} sm={24} md={12} style={{ padding: 70 }}>
          <h1>نظام بسيط لإداره العيادات</h1>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={12} style={{ padding: 70 }}>
          <h1>يمكنك إضافـة معلومات عن الأطباء و المرضى و رؤية إحصائيـات</h1>
        </Col>
        <Col xs={24} sm={24} md={12} style={{ padding: 70 }}>
          <img src={doctor2} alt="doctor2" width="100%" height="200" />
        </Col>
      </Row>
    </Grid>
  )
}
