import React, { useState, useEffect } from 'react'
import RingLoader from 'react-spinners/RingLoader'
import { Grid, Row, Col } from 'rsuite'
import ReactEcharts from 'echarts-for-react'
import * as firebase from 'firebase'
import { Patient } from '../patients/patients.interface'

export default function MaleToFemale() {
  const [state, setState] = useState({ loading: true, dataToViz: [] as any[] })

  useEffect(() => {
    const db = firebase.firestore()
    const arr: any[] = []
    const males = { name: 'ذكـــر', value: 0 }
    const females = { name: 'أنثـــى', value: 0 }
    db.collection('patients')
      .get()
      .then((data) => {
        data.forEach((pat) => {
          const { patient_sex } = pat.data()
          if (patient_sex === 'ذكـــر') males.value++
          else females.value++
        })
        arr.push(males, females)
        setState({ ...state, loading: false, dataToViz: arr })
      })
  }, [])

  return (
    <Grid style={{ textAlign: 'center' }}>
      {state.loading ? (
        <span
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <RingLoader size={150} color={'#406c75'} loading={true} />
        </span>
      ) : (
        ''
      )}
      {state.loading ? (
        ''
      ) : (
        <Row>
          <Col xs={24} sm={24} md={24}>
            <ReactEcharts
              option={
                {
                  height: 500,
                  title: {
                    text: 'نسبة الذكور للإناث',
                    subtext: 'المرضى',
                    left: 'center',
                  },
                  color: ['#509799', '#FFACBB'],
                  tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)',
                  },
                  legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    right: 10,
                    top: 20,
                    bottom: 20,
                  },
                  series: [
                    {
                      name: 'العدد و النسبة',
                      type: 'pie',
                      radius: '80%',
                      center: ['50%', '50%'],
                      data: state.dataToViz,
                      emphasis: {
                        itemStyle: {
                          show: false,
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)',
                        },
                      },
                    },
                  ],
                } as any
              }
            />
          </Col>
        </Row>
      )}
    </Grid>
  )
}
