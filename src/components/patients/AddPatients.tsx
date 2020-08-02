import React, { useState } from 'react'
import {
  Grid,
  Row,
  Col,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock,
  ButtonToolbar,
  Button,
  Radio,
  RadioGroup,
} from 'rsuite'
import { Redirect } from 'react-router-dom'
import { useFirestore } from 'reactfire'
import { Alert } from 'rsuite'

export default function AddPatients() {
  const [state, setState] = useState({
    patient_name: '',
    patient_sex: '',
    patient_extra_info: '',
    loading: false,
    redirect: false,
    userId: '',
  })

  const patients = useFirestore().collection('patients')

  const { patient_sex, patient_name } = state
  const changeVal = (formValue: Record<string, any>) => {
    setState({ ...state, ...formValue })
  }

  const submit = () => {
    setState({ ...state, loading: true })
    const { redirect, userId, loading, ...data } = state
    patients.add(data).then((user) => {
      Alert.success('تمت إضافة المريض بنجاح')
      setState({ ...state, loading: false, redirect: true, userId: user.id })
    })
  }
  const page = state.redirect ? (
    <Redirect to={`/display/patients/${state.userId}`} />
  ) : (
    <Grid style={{ padding: 70 }}>
      <Row>
        <Col xs={24} sm={24} md={24}>
          <Form onChange={changeVal}>
            <FormGroup>
              <ControlLabel>اســم المريــض الكامل</ControlLabel>
              <FormControl name="patient_name" />
              <HelpBlock>لا يمكن تخزين المعلومات بدون هذه المعلومة</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>جنـس المريــض</ControlLabel>
              <HelpBlock>لا يمكن تخزين المعلومات بدون هذه المعلومة</HelpBlock>
              <FormControl name="patient_sex" accepter={RadioGroup}>
                <Radio value="ذكـــر">ذكـــر</Radio>
                <Radio value="أنثـــى">أنثـــى</Radio>
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>معلومات إضافــية</ControlLabel>
              <FormControl
                rows={5}
                name="patient_extra_info"
                componentClass="textarea"
              />
            </FormGroup>
            <FormGroup>
              <ButtonToolbar>
                <Button
                  appearance="primary"
                  disabled={!(patient_sex && patient_name)}
                  onClick={submit}
                  loading={state.loading}
                >
                  إضافـــة
                </Button>
                <HelpBlock>
                  بعد إضافة المريض او المريضة, يمكنك من الصفحة الشخصيه الخاصة
                  بالمريض او المريضة إضافه زيارات و تخشيصات
                </HelpBlock>
              </ButtonToolbar>
            </FormGroup>
          </Form>
        </Col>
      </Row>
    </Grid>
  )
  return page
}
