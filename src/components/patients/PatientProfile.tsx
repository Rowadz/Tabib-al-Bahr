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
} from 'rsuite'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

const { Header, Title, Body, Footer } = Modal

export default function PatientProfile() {
  const contentBlock = htmlToDraft('')
  const contentState = ContentState.createFromBlockArray(
    contentBlock.contentBlocks
  )
  const editorState = EditorState.createWithContent(contentState)
  const [state, setState] = useState({
    openModal: false,
    diagDate: undefined,
    editorState,
  })

  const { id } = useParams()
  const patient = useFirestore().collection('patients').doc(id)

  const { patient_name, patient_sex, patient_extra_info } = useFirestoreDocData(
    patient
  )
  const toggle = () => setState({ ...state, openModal: !state.openModal })
  const addDiag = async () => {
    const newData = {
      txt: JSON.stringify(state.editorState.getCurrentContent()),
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
  const txtChange = (editorState: any) => {
    setState({ ...state, editorState })
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
              <Editor
                onEditorStateChange={txtChange}
                editorStyle={{
                  border: '1px solid #ccc',
                  padding: 10,
                  height: 200,
                }}
                editorState={state.editorState}
                textAlignment="right"
                toolbar={{
                  options: [
                    'inline',
                    'blockType',
                    'fontSize',
                    'fontFamily',
                    'list',
                    'textAlign',
                    // 'colorPicker',
                    // 'link',
                    // 'embedded',
                    // 'emoji',
                    // 'image',
                    // 'remove',
                    'history',
                  ],
                  font: ['strikethrough', 'superscript', 'subscript'],
                  color: ['color'],
                  para: ['ul', 'ol', 'paragraph'],
                  image: {
                    alignmentEnabled: false,

                    alt: { present: true, mandatory: false },
                    previewImage: true,
                  },
                }}
              />
            </FormGroup>
          </Form>
        </Body>
        <Footer>
          <Button appearance="primary" onClick={addDiag}>
            إضافة
          </Button>
          <Button onClick={toggle} appearance="subtle">
            إغلاق
          </Button>
        </Footer>
      </Modal>
      <Row>
        <Col xs={24} sm={24} md={24} style={{ marginTop: 10 }}>
          <Panel shaded bordered bodyFill style={{ display: 'inline-block' }}>
            <Panel>
              <h4>الاسم: {patient_name}</h4>
              <h4>الجنس: {patient_sex}</h4>
              <h5>معلومات اضافيه: {patient_extra_info}</h5>
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
      </Row>
    </Grid>
  )
}
