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
  HelpBlock,
  DatePicker,
  Button,
  Modal,
  Panel,
  IconButton,
  Icon,
  Divider,
  Timeline,
} from 'rsuite'

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
  })

  const { id } = useParams()
  const patient = useFirestore().collection('patients').doc(id)

  const {
    patient_name,
    patient_sex,
    patient_extra_info,
    diagnoses,
  } = useFirestoreDocData(patient)
  const toDisplayDiagnoses = (diagnoses || []).sort(
    ({ diagDate: a }: any, { diagDate: b }: any) =>
      +moment(a.toDate()).format('X') - +moment(b.toDate()).format('X')
  )

  console.log(toDisplayDiagnoses)

  const toggle = () => setState({ ...state, openModal: !state.openModal })
  const addDiag = async () => {
    const newData = {
      txt: state.txt,
      diagDate: state.diagDate,
    }
    let oldDiagnoses = ((await patient.get()).data() as any).diagnoses
    if (!oldDiagnoses) oldDiagnoses = []

    patient.update({
      diagnoses: [...oldDiagnoses, newData],
    })
  }
  const dateChage = (
    value: Date,
    event: React.SyntheticEvent<HTMLElement, Event>
  ) => {
    setState({ ...state, diagDate: value as any })
  }
  const txtChange = (txt: any) => {
    setState({ ...state, txt })
  }

  return (
    <Grid style={{ padding: 70 }}>
      <Modal show={state.openModal} onHide={toggle}>
        <Header>
          <Title>إضافة زيــارة أو تشــخيــص لـــ ` {patient_name} `</Title>
        </Header>
        <Body>
          <Form>
            <FormGroup>
              <ControlLabel>تاريخ الزيـارة</ControlLabel>
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
                name="coming_date"
                style={{ width: '100%' }}
              />
              <HelpBlock tooltip>هذه العلومه إختياريه</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>التشـــيخــص</ControlLabel>
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
                  direction: 'rtl',
                }}
                onModelChange={txtChange}
              />
            </FormGroup>
          </Form>
        </Body>
        <Footer>
          <Button
            appearance="primary"
            onClick={addDiag}
            disabled={!(state.txt && state.diagDate)}
          >
            إضافة
          </Button>
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
              <h5>
                معلومات اضافيه:
                <Divider />
                <span
                  dangerouslySetInnerHTML={{
                    __html: patient_extra_info ? patient_extra_info : 'لا يوجد',
                  }}
                ></span>
              </h5>
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
            {toDisplayDiagnoses.map(({ diagDate, txt }: any, i: number) => (
              <Timeline.Item key={i}>
                {moment(diagDate.toDate()).format('MM/DD/YYYY')}
                <span dangerouslySetInnerHTML={{ __html: txt }}></span>
                <IconButton
                  icon={<Icon icon="trash" />}
                  color="red"
                  circle
                  size="xs"
                />
                <IconButton
                  style={{ margin: 10 }}
                  icon={<Icon icon="edit" />}
                  color="cyan"
                  circle
                  size="xs"
                />
              </Timeline.Item>
            ))}
          </Timeline>
        </Col>
      </Row>
    </Grid>
  )
}
