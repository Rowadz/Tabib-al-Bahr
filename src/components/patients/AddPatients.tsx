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
  SelectPicker,
  DatePicker,
} from 'rsuite'
import { Redirect } from 'react-router-dom'
import { useFirestore } from 'reactfire'
import FroalaEditor from 'react-froala-wysiwyg'

import { Alert } from 'rsuite'

export default function AddPatients() {
  const city = [
    {
      label: 'عمان',
      value: 'عمان',
    },
    {
      label: 'الزرقاء',
      value: 'الزرقاء',
    },
    {
      label: 'معان',
      value: 'معان',
    },
    {
      label: 'المفرق',
      value: 'المفرق',
    },
    {
      label: 'العقبة',
      value: 'العقبة',
    },
    {
      label: 'اربد',
      value: 'اربد',
    },
    {
      label: 'الطفيلة',
      value: 'الطفيلة',
    },
    {
      label: 'الكرك',
      value: 'الكرك',
    },
    {
      label: 'البلقاء',
      value: 'البلقاء',
    },
    {
      label: 'جرش',
      value: 'جرش',
    },
    {
      label: 'عجلون',
      value: 'عجلون',
    },
    {
      label: 'مادبا',
      value: 'مادبا',
    },
    {
      label: 'المفرق',
      value: 'المفرق',
    },
  ]
  const [state, setState] = useState({
    patient_name: '',
    patient_sex: '',
    patient_extra_info: '',
    loading: false,
    redirect: false,
    userId: '',
    birth_of_date: '',
    patient_city: '',
    patient_city_extra: '',
    patient_phone: '',
    patient_disease_history: '',
    patient_medicine_history: '',
    patient_surgery_history: '',
    patient_educational_lvl: '',
    patient_family_history: '',
  })

  const patients = useFirestore().collection('patients')

  const { patient_sex, patient_name } = state
  const changeVal = (formValue: Record<string, any>) => {
    if (typeof formValue === 'string')
      setState({ ...state, patient_extra_info: formValue })
    else setState({ ...state, ...formValue })
  }

  const dateChage = (value: Date) => {
    setState({ ...state, birth_of_date: value as any })
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
              <ControlLabel>السكن</ControlLabel>
              <SelectPicker
                data={city}
                style={{ width: 280 }}
                placeholder="السكن"
                onChange={(patient_city) =>
                  setState({ ...state, patient_city })
                }
                name="patient_city"
              />
              <HelpBlock>معلومة إختيارية</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>معلومات إضافيه عن السكن</ControlLabel>
              <FormControl name="patient_city_extra" />
              <HelpBlock>معلومة إختيارية</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>رقم الهاتف</ControlLabel>
              <FormControl name="patient_phone" />
              <HelpBlock>معلومة إختيارية</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>الرقم الوطني</ControlLabel>
              <FormControl name="patient_ID" />
              <HelpBlock>معلومة إختيارية</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>تاريخ الميلاد</ControlLabel>
              <DatePicker
                onChange={dateChage}
                cleanable={false}
                locale={{
                  sunday: 'Su',
                  monday: 'Mo',
                  tuesday: 'Tu',
                  wednesday: 'We',
                  thursday: 'Th',
                  friday: 'Fr',
                  saturday: 'Sa',
                  ok: 'إضافة التاريخ',
                  today: 'اليوم',
                  yesterday: 'البارحة',
                  hours: 'Hours',
                  minutes: 'Minutes',
                  seconds: 'Seconds',
                }}
                name="birth_of_date"
                style={{ width: 280 }}
              />
              <HelpBlock>معلومة إختيارية</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>السيره المرضية</ControlLabel>
              <FormControl
                name="patient_disease_history"
                rows={5}
                componentClass="textarea"
              />
              <HelpBlock>معلومة إختيارية</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>تاريخ الأدويه</ControlLabel>
              <FormControl
                name="patient_medicine_history"
                rows={5}
                componentClass="textarea"
              />
              <HelpBlock>معلومة إختيارية</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>تاريخ العمليات</ControlLabel>
              <FormControl
                name="patient_surgery_history"
                rows={5}
                componentClass="textarea"
              />
              <HelpBlock>معلومة إختيارية</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>المستوى التعليمي</ControlLabel>
              <FormControl
                name="patient_educational_lvl"
                rows={5}
                componentClass="textarea"
              />
              <HelpBlock>معلومة إختيارية</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>التاريخ المرضي للعائلة</ControlLabel>
              <FormControl
                name="patient_family_history"
                rows={5}
                componentClass="textarea"
              />
              <HelpBlock>معلومة إختيارية</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>معلومات إضافــية</ControlLabel>
              <FroalaEditor
                tag="textarea"
                config={{
                  toolbarButtons: [
                    'bold',
                    'italic',
                    'underline',
                    'h1',
                    'strikeThrough',
                    'fontFamily',
                    'fontSize',
                    '|',
                    'paragraphStyle',
                    'paragraphFormat',
                    'align',
                    'undo',
                    'redo',
                    'html',
                  ],
                  charCounterCount: true,
                  direction: 'rtl',
                }}
                onModelChange={changeVal}
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
