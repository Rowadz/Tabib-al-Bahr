import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useFirestoreDocData, useFirestore } from 'reactfire'
import {
  Grid,
  Row,
  Col,
  Form,
  FormGroup,
  ControlLabel,
  Whisper,
  DatePicker,
  Popover,
  Button,
  Modal,
  Panel,
  IconButton,
  Icon,
  Divider,
  Timeline,
  Alert,
} from 'rsuite'
import { v4 } from 'uuid'
import FroalaEditor from 'react-froala-wysiwyg'

import moment from 'moment'
// import 'moment/locale/ar'
// moment.locale('ar')
const { Header, Title, Body, Footer } = Modal

export default function PatientProfile() {
  const [state, setState] = useState({
    openModal: false,
    diagDate: undefined,
    txt: '',
    loading: false,
    globalLoading: false,
    edit: false,
    editTxt: '',
    editDiagDate: undefined,
    toEditUuid: '',
  })

  const { id } = useParams()
  const patient = useFirestore().collection('patients').doc(id)

  const {
    patient_name,
    patient_sex,
    patient_extra_info,
    diagnoses,
    patient_ID,
    birth_of_date,
  } = useFirestoreDocData(patient)

  const age = !birth_of_date
    ? '--'
    : moment.duration(moment().diff(moment(birth_of_date.toDate(), 'MM-YYYY')))

  const years = (age as moment.Duration).years()
  const months = (age as moment.Duration).months()

  const toDisplayDiagnoses = (diagnoses || []).sort(
    ({ diagDate: a }: any, { diagDate: b }: any) =>
      +moment(a.toDate()).format('X') - +moment(b.toDate()).format('X')
  )

  const toggle = () =>
    setState({
      ...state,
      openModal: !state.openModal,
      edit: false,
      editTxt: '',
      editDiagDate: undefined,
      diagDate: undefined,
      txt: '',
    })
  const addDiag = async () => {
    setState({ ...state, loading: true })
    const newData = {
      txt: state.edit ? state.editTxt : state.txt.trim(),
      diagDate: state.edit ? state.editDiagDate : state.diagDate,
      uuid: state.edit ? state.toEditUuid : v4(),
    }

    let oldDiagnoses = ((await patient.get()).data() as any).diagnoses
    if (!oldDiagnoses) oldDiagnoses = []
    if (state.edit) {
      oldDiagnoses = oldDiagnoses.filter(
        ({ uuid }: any) => state.toEditUuid !== uuid
      )
    }
    patient
      .update({
        diagnoses: [...oldDiagnoses, newData],
      })
      .then(() => {
        if (state.edit) {
          Alert.success(`تم التعـــديــل`)
        } else {
          Alert.success(`تمت إضافة زياره لــ ${patient_name}`)
        }
        setState({ ...state, loading: false, openModal: false, edit: true })
      })
      .catch(() => {
        Alert.error(`حدث خطأ من السيرفر الرجاء المحاوله بعد ٣٠ ثانيه`)
        setState({ ...state, loading: false, openModal: false, edit: true })
      })
  }
  const dateChage = (value: Date) => {
    if (state.edit) {
      setState({ ...state, editDiagDate: value as any })
    } else {
      setState({ ...state, diagDate: value as any })
    }
  }
  const txtChange = (txt: any) => {
    if (state.edit) {
      setState({ ...state, editTxt: txt })
    } else {
      setState({ ...state, txt })
    }
  }

  const deleteDiagnose = async (uuid: string) => {
    setState({ ...state, globalLoading: true })
    const oldDiagnoses = ((await patient.get()).data() as any).diagnoses
    patient
      .update({
        diagnoses: oldDiagnoses.filter(({ uuid: id }: any) => uuid !== id),
      })
      .then(() => {
        Alert.success(`تم الحذف`)
        setState({ ...state, globalLoading: false })
      })
      .catch(() => {
        Alert.error(`حدث خطأ من السيرفر الرجاء المحاوله بعد ٣٠ ثانيه`)
        setState({ ...state, globalLoading: false })
      })
  }

  const editDiagnose = (uuid: string) => {
    setState({ ...state, edit: true, globalLoading: true, toEditUuid: uuid })
    Alert.info('جاري التحميل, الرجاء الإنتظار')
    initEdit(uuid)
  }

  const initEdit = async (uuid: string) => {
    const oldDiagnoses = ((await patient.get()).data() as any).diagnoses
    const diagnose = oldDiagnoses.find(({ uuid: id }: any) => uuid === id)

    setState({
      ...state,
      openModal: true,
      globalLoading: false,
      edit: true,
      toEditUuid: uuid,
      editTxt: diagnose.txt,
      editDiagDate: diagnose.diagDate.toDate(),
    })
  }

  const delSpeaker = (
    <Popover title="ملاحــظه !">
      <p>إضــغــط مرتين بسرعه للحــذف</p>
    </Popover>
  )

  return (
    <Grid style={{ padding: 70 }}>
      <Modal full show={state.openModal} onHide={toggle}>
        <Header>
          {state.edit ? (
            'تعديل زياره'
          ) : (
            <Title>إضافة زيــارة أو تشــخيــص لـــ ` {patient_name} `</Title>
          )}
        </Header>
        <Body>
          <Form>
            <FormGroup>
              <ControlLabel>تاريخ الزيـارة</ControlLabel>
              <DatePicker
                value={state.edit ? (state.editDiagDate as any) : undefined}
                disabled={state.globalLoading}
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
                name="coming_date"
                style={{ width: '100%' }}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>التشـــيخــص</ControlLabel>
              <FroalaEditor
                tag="textarea"
                model={state.edit ? state.editTxt : state.txt}
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
                  direction: 'rtl',
                }}
                onModelChange={txtChange}
              />
            </FormGroup>
          </Form>
        </Body>
        <Footer>
          {state.edit ? (
            <Button
              appearance="primary"
              color="orange"
              onClick={addDiag}
              disabled={
                !(state.editTxt && state.editDiagDate) || state.globalLoading
              }
              loading={state.loading}
            >
              تعديــل
            </Button>
          ) : (
            <Button
              appearance="primary"
              onClick={addDiag}
              disabled={!(state.txt && state.diagDate)}
              loading={state.loading}
            >
              إضافة
            </Button>
          )}
          <Button onClick={toggle} appearance="subtle">
            إغلاق
          </Button>
        </Footer>
      </Modal>
      <Row>
        <Col xs={24} sm={24} md={24} style={{ marginTop: 10 }}>
          <Panel
            shaded
            bordered
            bodyFill
            style={{ display: 'inline-block', width: '100%' }}
          >
            <Panel>
              <h4>الاسم: {patient_name}</h4>
              <h4>الجنس: {patient_sex}</h4>
              <h4>الرقم الوطني: {patient_ID}</h4>
              <h4>
                تاريخ الميلاد:{' '}
                {birth_of_date
                  ? moment(birth_of_date.toDate()).format('MM/DD/YYYY')
                  : '--'}
              </h4>
              <h4>
                العمــر: {years} سنه
                {' و '}
                {months} اشهر
              </h4>
              <Divider />
              <h5>معلومات اضافيه:</h5>
              <span
                dangerouslySetInnerHTML={{
                  __html: patient_extra_info ? patient_extra_info : 'لا يوجد',
                }}
              ></span>
            </Panel>
          </Panel>
        </Col>
        <Col xs={24} sm={24} md={24}>
          <Divider>خيــارات</Divider>
        </Col>
        <Col xs={24} sm={24} md={24}>
          <IconButton icon={<Icon icon="plus" />} color="cyan" onClick={toggle}>
            إضافــه زياره و تشخيــص
          </IconButton>
        </Col>
        <Col xs={24} sm={24} md={24}>
          <Divider>الزيــارات و التخشــيصــات</Divider>
        </Col>
        <Col xs={24} sm={24} md={24}>
          <Timeline>
            {toDisplayDiagnoses.map(
              ({ diagDate, txt, uuid }: any, i: number) => (
                <Timeline.Item key={i}>
                  {moment(diagDate.toDate()).format('MM/DD/YYYY')}
                  <span dangerouslySetInnerHTML={{ __html: txt }}></span>
                  <Whisper placement="top" trigger="click" speaker={delSpeaker}>
                    <IconButton
                      icon={<Icon icon="trash" />}
                      color="red"
                      circle
                      size="xs"
                      loading={state.globalLoading}
                      onDoubleClick={() => deleteDiagnose(uuid)}
                    />
                  </Whisper>

                  <IconButton
                    style={{ margin: 10 }}
                    icon={<Icon icon="edit" />}
                    color="cyan"
                    loading={state.globalLoading}
                    circle
                    size="xs"
                    onClick={() => editDiagnose(uuid)}
                  />
                </Timeline.Item>
              )
            )}
          </Timeline>
        </Col>
      </Row>
    </Grid>
  )
}
