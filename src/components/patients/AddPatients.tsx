import React from 'react'
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

export default function AddPatients() {
  return (
    <Grid style={{ padding: 70 }}>
      <Row>
        <Col xs={24} sm={24} md={24}>
          <Form>
            <FormGroup>
              <ControlLabel>اســم المريــض الكامل</ControlLabel>
              <FormControl name="patient_name" />
              <HelpBlock>لا يمكن تخزين المعلومات بدون هذه المعلومة</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>جنـس المريــض</ControlLabel>
              <HelpBlock>لا يمكن تخزين المعلومات بدون هذه المعلومة</HelpBlock>
              <FormControl name="patient_sex" accepter={RadioGroup}>
                <Radio value="male">ذكـــر</Radio>
                <Radio value="female">أنثـــى</Radio>
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
                <Button appearance="primary">إضافـــة</Button>
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
}
