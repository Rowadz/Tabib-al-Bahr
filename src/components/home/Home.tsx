import React, { useState } from 'react'
// import doctor1 from './doctor1.svg'
// import doctor2 from './doctor2.svg'
import logo from './logo.jpeg'
import {
  Grid,
  Row,
  Col,
  Panel,
  Alert,
  Form,
  ControlLabel,
  FormGroup,
  HelpBlock,
  FormControl,
  ButtonToolbar,
  Button,
} from 'rsuite'
import * as firebase from 'firebase'

export default function Home() {
  const [state, setState] = useState({
    email: '',
    password: '',
    isLoggedIn: false,
  })
  const user = firebase.auth().currentUser

  if (user) {
    setState({ ...state, isLoggedIn: true })
  }

  const sub = (a: any) => {
    setState({ ...state, ...a })
  }
  const go = () => {
    const { email, password } = state

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => Alert.success('تم الدخول!'))
      .catch(() => Alert.error('كلمه السر او الايميل خطأ '))
  }
  const { isLoggedIn } = state
  return (
    <Grid style={{ padding: 70 }}>
      <Row>
        <Col xs={24} sm={24} md={24}>
          <Panel bodyFill style={{ display: 'inline-block' }}>
            <img src={logo} alt="doctor1" width="100%" height="auto" />
          </Panel>
        </Col>
        {!isLoggedIn ? (
          <Col xs={24} sm={24} md={24}>
            <Form onChange={sub}>
              <FormGroup>
                <ControlLabel>الايميل</ControlLabel>
                <FormControl name="email" />
                <HelpBlock>هذه المعلومه مطلوبه</HelpBlock>
              </FormGroup>
              <FormGroup>
                <ControlLabel>كلمه السر</ControlLabel>
                <FormControl name="password" type="password" />
                <HelpBlock>هذه المعلومه مطلوبه</HelpBlock>
              </FormGroup>
              <FormGroup>
                <ButtonToolbar>
                  <Button appearance="primary" onClick={go}>
                    دخول
                  </Button>
                </ButtonToolbar>
              </FormGroup>
            </Form>
          </Col>
        ) : (
          ''
        )}
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
