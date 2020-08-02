import React from 'react'
import { Navbar, Nav, Icon } from 'rsuite'
const { Header, Body } = Navbar
const { Item } = Nav

export default function AppNav() {
  return (
    <Navbar>
      <Header></Header>
      <Body>
        <Nav>
          <Item eventKey="1" icon={<Icon icon="home" />}>
            الصفحه الرئيسيه
          </Item>
          <Item eventKey="2" icon={<Icon icon="stethoscope" />}>
            المـــرضى
          </Item>
          <Item eventKey="3" icon={<Icon icon="user-md" />}>
            الحكـــماء
          </Item>
        </Nav>
        <Nav pullRight>
          <Item eventKey="3" icon={<Icon icon="pie-chart" />}>
            إحصــائـــيات
          </Item>
        </Nav>
      </Body>
    </Navbar>
  )
}
