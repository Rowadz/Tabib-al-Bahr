import React, { useState } from 'react'
import { useParams, Redirect } from 'react-router-dom'
import { useFirestoreDocData, useFirestore } from 'reactfire'
import {
  Grid,
  Row,
  Col,
  Form,
  FormGroup,
  ControlLabel,
  HelpBlock,
  Whisper,
  FormControl,
  DatePicker,
  PanelGroup,
  Popover,
  Button,
  Modal,
  List,
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
    complain: '',
    complain_edit: '',
    diagnosis_txt: '',
    diagnosis_txt_edit: '',
    clinical_examination: '',
    clinical_examination_edit: '',
    laboratories: '',
    laboratories_edit: '',
    x_rays: '',
    x_rays_edit: '',
    treatment: '',
    treatment_edit: '',
    redirectToEdit: false,
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
    patient_city,
    patient_city_extra,
    patient_phone,
    patient_disease_history,
    patient_medicine_history,
    patient_surgery_history,
    patient_educational_lvl,
    patient_family_history,
  } = useFirestoreDocData(patient)

  const age = !birth_of_date
    ? '--'
    : moment.duration(moment().diff(moment(birth_of_date.toDate(), 'MM-YYYY')))

  const years = age !== '--' ? (age as moment.Duration).years() : '--'
  const months = age !== '--' ? (age as moment.Duration).months() : '--'

  const toDisplayDiagnoses = (diagnoses || [])
    .sort(
      ({ diagDate: a }: any, { diagDate: b }: any) =>
        +moment(a.toDate()).format('X') - +moment(b.toDate()).format('X')
    )
    .map(
      ({
        complain,
        diagnosis_txt,
        clinical_examination,
        laboratories,
        x_rays,
        treatment,
        ...reset
      }: any) => ({
        complain: complain ? complain : '--',
        diagnosis_txt: diagnosis_txt ? diagnosis_txt : '--',
        clinical_examination: clinical_examination
          ? clinical_examination
          : '--',
        laboratories: laboratories ? laboratories : '--',
        x_rays: x_rays ? x_rays : '--',
        treatment: treatment ? treatment : '--',
        ...reset,
      })
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
      complain: state.edit ? state.complain_edit : state.complain,
      diagnosis_txt: state.edit
        ? state.diagnosis_txt_edit
        : state.diagnosis_txt,
      clinical_examination: state.edit
        ? state.clinical_examination_edit
        : state.clinical_examination,
      laboratories: state.edit ? state.laboratories_edit : state.laboratories,
      x_rays: state.edit ? state.x_rays_edit : state.x_rays,
      treatment: state.edit ? state.treatment_edit : state.treatment,
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
      complain_edit: diagnose.complain,
      diagnosis_txt_edit: diagnose.diagnosis_txt,
      clinical_examination_edit: diagnose.clinical_examination,
      laboratories_edit: diagnose.laboratories,
      x_rays_edit: diagnose.x_rays,
      treatment_edit: diagnose.treatment,
    })
  }

  const delSpeaker = (
    <Popover title="ملاحــظه !">
      <p>إضــغــط مرتين بسرعه للحــذف</p>
    </Popover>
  )

  if (state.redirectToEdit) return <Redirect to={`/patients/add/${id}`} />
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
          <Form onChange={(s) => setState({ ...state, ...s })}>
            <FormGroup>
              <ControlLabel>تاريخ الزيـارة</ControlLabel>
              <DatePicker
                value={
                  state.edit ? (state.editDiagDate as any) : state.diagDate
                }
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
                style={{ width: 280 }}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>الشكوى</ControlLabel>
              <FormControl
                name="complain"
                rows={5}
                componentClass="textarea"
                onChange={(complain_edit) =>
                  setState({ ...state, complain_edit, complain: complain_edit })
                }
                value={state.edit ? state.complain_edit : state.complain}
              />
              <HelpBlock>معلومة إختيارية</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>التشخيص</ControlLabel>
              <FormControl
                name="diagnosis_txt"
                rows={5}
                componentClass="textarea"
                onChange={(diagnosis_txt_edit) =>
                  setState({
                    ...state,
                    diagnosis_txt_edit,
                    diagnosis_txt: diagnosis_txt_edit,
                  })
                }
                value={
                  state.edit ? state.diagnosis_txt_edit : state.diagnosis_txt
                }
              />
              <HelpBlock>معلومة إختيارية</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>الفحص السريري</ControlLabel>
              <FormControl
                name="clinical_examination"
                rows={5}
                componentClass="textarea"
                onChange={(clinical_examination_edit) =>
                  setState({
                    ...state,
                    clinical_examination_edit,
                    clinical_examination: clinical_examination_edit,
                  })
                }
                value={
                  state.edit
                    ? state.clinical_examination_edit
                    : state.clinical_examination
                }
              />
              <HelpBlock>معلومة إختيارية</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>المختبرات</ControlLabel>
              <FormControl
                name="laboratories"
                rows={5}
                componentClass="textarea"
                onChange={(laboratories_edit) =>
                  setState({
                    ...state,
                    laboratories_edit,
                    laboratories: laboratories_edit,
                  })
                }
                value={
                  state.edit ? state.laboratories_edit : state.laboratories
                }
              />
              <HelpBlock>معلومة إختيارية</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>الأشعه</ControlLabel>
              <FormControl
                name="x_rays"
                rows={5}
                componentClass="textarea"
                onChange={(x_rays_edit) =>
                  setState({ ...state, x_rays_edit, x_rays: x_rays_edit })
                }
                value={state.edit ? state.x_rays_edit : state.x_rays}
              />
              <HelpBlock>معلومة إختيارية</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>العلاج</ControlLabel>
              <FormControl
                name="treatment"
                rows={5}
                componentClass="textarea"
                onChange={(treatment_edit) =>
                  setState({
                    ...state,
                    treatment_edit,
                    treatment: treatment_edit,
                  })
                }
                value={state.edit ? state.treatment_edit : state.treatment}
              />
              <HelpBlock>معلومة إختيارية</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>معلومات إضافيه</ControlLabel>
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
              disabled={!state.editDiagDate || state.globalLoading}
              loading={state.loading}
            >
              تعديــل
            </Button>
          ) : (
            <Button
              appearance="primary"
              onClick={addDiag}
              disabled={!state.diagDate}
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
              <h4>الرقم الوطني: {patient_ID ? patient_ID : '--'}</h4>
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
              <PanelGroup>
                <Panel header=" مدينه المريض:">
                  <h6>{patient_city ? patient_city : '--'}</h6>
                </Panel>
                <Panel header="معلومات إضافية عن السكن:">
                  {patient_city_extra ? patient_city_extra : '--'}
                </Panel>
                <Panel header="رقم الهاتف:">
                  {patient_phone ? patient_phone : '--'}
                </Panel>
                <Panel header="السيرة المرضية:">
                  {patient_disease_history ? patient_disease_history : '--'}
                </Panel>
                <Panel header="تاريخ الأدويه:">
                  {patient_medicine_history ? patient_medicine_history : '--'}
                </Panel>
                <Panel header="تاريخ العمليات:">
                  {patient_surgery_history ? patient_surgery_history : '--'}
                </Panel>
                <Panel header="المستوى التعليمي:">
                  {patient_educational_lvl ? patient_educational_lvl : '--'}
                </Panel>
                <Panel header="التاريخ المرضي للعائله:">
                  {patient_family_history ? patient_family_history : '--'}
                </Panel>
                <Panel header="معلومات اضافيه:">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: patient_extra_info ? patient_extra_info : '--',
                    }}
                  ></span>
                </Panel>
              </PanelGroup>
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
          <IconButton
            icon={<Icon icon="edit" />}
            color="orange"
            onClick={() => setState({ ...state, redirectToEdit: true })}
            style={{ marginRight: 10 }}
          >
            تعديل بيانات المريض
          </IconButton>
        </Col>
        <Col xs={24} sm={24} md={24}>
          <Divider>الزيــارات و التخشــيصــات</Divider>
        </Col>
        <Col xs={24} sm={24} md={24}>
          <Timeline>
            {toDisplayDiagnoses.map(
              (
                {
                  diagDate,
                  txt,
                  uuid,
                  complain,
                  diagnosis_txt,
                  clinical_examination,
                  laboratories,
                  x_rays,
                  treatment,
                }: any,
                i: number
              ) => (
                <Timeline.Item key={i}>
                  {moment(diagDate.toDate()).format('MM/DD/YYYY')}
                  <br />
                  <Icon icon="stethoscope" /> الشكوى: {complain}
                  <br />
                  <Icon icon="heartbeat" /> التشخيص: {diagnosis_txt}
                  <br />
                  <Icon icon="user-md" /> الفحص السريري: {clinical_examination}
                  <br />
                  <Icon icon="hospital-o" /> المختبرات: {laboratories}
                  <br />
                  <Icon icon="magic" /> المختبرات: {x_rays}
                  <br />
                  <Icon icon="heart" /> العلاج: {treatment}
                  <br />
                  <Icon icon="plus-square" /> معلومات إضافية:{' '}
                  <span
                    dangerouslySetInnerHTML={{ __html: txt ? txt : '--' }}
                  ></span>
                  <br />
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
