import React, { useState, useEffect } from 'react'
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
import { Redirect, useParams } from 'react-router-dom'
import { useFirestore, useFirestoreDocData } from 'reactfire'
import FroalaEditor from 'react-froala-wysiwyg'

import { Alert } from 'rsuite'

export default function AddPatients() {
  const { id } = useParams()
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
  ]
  const [state, setState] = useState({
    patient_name: '',
    patient_sex: '',
    patient_extra_info: '',
    loading: false,
    redirect: false,
    userId: '',
    patient_ID: '',
    birth_of_date: new Date(),
    patient_city: '',
    patient_city_extra: '',
    patient_phone: '',
    patient_disease_history: '',
    patient_medicine_history: '',
    patient_surgery_history: '',
    patient_educational_lvl: '',
    patient_family_history: '',
    edit: !!id,
    gloablLoading: !!id,
  })

  const patients = useFirestore().collection('patients')
  useEffect(() => {
    if (id) {
      patients
        .doc(id)
        .get()
        .then((doc) => {
          const {
            patient_name,
            patient_sex,
            patient_extra_info,
            patient_ID,
            birth_of_date,
            patient_city,
            patient_city_extra,
            patient_phone,
            patient_disease_history,
            patient_medicine_history,
            patient_surgery_history,
            patient_educational_lvl,
            patient_family_history,
          } = doc.data() as any
          setState({
            ...state,
            patient_name,
            patient_sex,
            patient_extra_info,
            patient_ID,
            birth_of_date,
            patient_city,
            patient_city_extra,
            patient_phone,
            patient_disease_history,
            patient_medicine_history,
            patient_surgery_history,
            patient_educational_lvl,
            patient_family_history,
          })
        })
    }
  }, [])

  const changeVal = (formValue: Record<string, any>) => {
    if (typeof formValue === 'string')
      setState({ ...state, patient_extra_info: formValue })
    else setState({ ...state, ...formValue })
  }

  const submit = () => {
    if (!id) {
      setState({ ...state, loading: true })
      const { redirect, userId, loading, gloablLoading, edit, ...data } = state
      patients.add(data).then((user) => {
        Alert.success('تمت إضافة المريض بنجاح')
        setState({ ...state, loading: false, redirect: true, userId: user.id })
      })
    } else {
      setState({ ...state, loading: true })
      const { redirect, userId, loading, ...data } = state
      patients
        .doc(id)
        .update({ ...data })
        .then(() => {
          Alert.success('تم التعديل بنجاح')
          setState({ ...state, loading: false, redirect: true, userId: id })
        })
    }
  }
  const { patient_sex, patient_name } = state
  const page = state.redirect ? (
    <Redirect to={`/display/patients/${state.userId}`} />
  ) : (
    <Grid style={{ padding: 70 }}>
      <Row>
        <Col xs={24} sm={24} md={24}>
          <Form>
            <FormGroup>
              <ControlLabel>اســم المريــض الكامل</ControlLabel>
              <FormControl
                name="patient_name"
                onChange={(s) => setState({ ...state, patient_name: s })}
                value={state.patient_name}
              />
              <HelpBlock>لا يمكن تخزين المعلومات بدون هذه المعلومة</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>جنـس المريــض</ControlLabel>
              <HelpBlock>لا يمكن تخزين المعلومات بدون هذه المعلومة</HelpBlock>
              <FormControl
                name="patient_sex"
                accepter={RadioGroup}
                value={state.patient_sex}
                onChange={(val) => setState({ ...state, patient_sex: val })}
              >
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
                value={state.patient_city}
                name="patient_city"
              />
              <HelpBlock>معلومة إختيارية</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>معلومات إضافيه عن السكن</ControlLabel>
              <FormControl
                name="patient_city_extra"
                onChange={(patient_city_extra) =>
                  setState({ ...state, patient_city_extra })
                }
                value={state.patient_city_extra}
              />
              <HelpBlock>معلومة إختيارية</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>رقم الهاتف</ControlLabel>
              <FormControl
                name="patient_phone"
                onChange={(patient_phone) =>
                  setState({ ...state, patient_phone })
                }
                value={state.patient_phone}
              />
              <HelpBlock>معلومة إختيارية</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>الرقم الوطني</ControlLabel>
              <FormControl
                name="patient_ID"
                onChange={(patient_ID) => setState({ ...state, patient_ID })}
                value={state.patient_ID}
              />
              <HelpBlock>معلومة إختيارية</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>تاريخ الميلاد</ControlLabel>
              <DatePicker
                onChange={(birth_of_date: Date) =>
                  setState({ ...state, birth_of_date: birth_of_date as any })
                }
                defaultValue={state.birth_of_date}
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
                onChange={(patient_disease_history) =>
                  setState({ ...state, patient_disease_history })
                }
                value={state.patient_disease_history}
              />
              <HelpBlock>معلومة إختيارية</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>تاريخ الأدويه</ControlLabel>
              <FormControl
                name="patient_medicine_history"
                rows={5}
                componentClass="textarea"
                onChange={(patient_medicine_history) =>
                  setState({ ...state, patient_medicine_history })
                }
                value={state.patient_medicine_history}
              />
              <HelpBlock>معلومة إختيارية</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>تاريخ العمليات</ControlLabel>
              <FormControl
                name="patient_surgery_history"
                rows={5}
                componentClass="textarea"
                onChange={(patient_surgery_history) =>
                  setState({ ...state, patient_surgery_history })
                }
                value={state.patient_surgery_history}
              />
              <HelpBlock>معلومة إختيارية</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>المستوى التعليمي</ControlLabel>
              <FormControl
                name="patient_educational_lvl"
                rows={5}
                componentClass="textarea"
                onChange={(patient_educational_lvl) =>
                  setState({ ...state, patient_educational_lvl })
                }
                value={state.patient_educational_lvl}
              />
              <HelpBlock>معلومة إختيارية</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>التاريخ المرضي للعائلة</ControlLabel>
              <FormControl
                name="patient_family_history"
                rows={5}
                componentClass="textarea"
                onChange={(patient_family_history) =>
                  setState({ ...state, patient_family_history })
                }
                value={state.patient_family_history}
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
                {state.edit ? (
                  <Button
                    appearance="primary"
                    color="orange"
                    disabled={!(patient_sex && patient_name)}
                    onClick={submit}
                    loading={state.loading}
                  >
                    تعديل
                  </Button>
                ) : (
                  <Button
                    appearance="primary"
                    disabled={!(patient_sex && patient_name)}
                    onClick={submit}
                    loading={state.loading}
                  >
                    إضافـــة
                  </Button>
                )}
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
