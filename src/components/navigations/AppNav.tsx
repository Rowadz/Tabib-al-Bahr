import React from 'react'
import { Navbar, Nav, Icon } from 'rsuite'
import { NavLink } from 'react-router-dom'
const { Header, Body } = Navbar
const { Item } = Nav

export default function AppNav() {
  return (
    <Navbar style={{ boxShadow: '0px 2px 10px #406C75' }}>
      <Header></Header>
      <Body>
        <Nav>
          <NavLink to="/" activeClassName="active-route" exact={true}>
            <Item eventKey="1" icon={<Icon icon="home" />}>
              الصفحه الرئيسيه
            </Item>
          </NavLink>
          <NavLink to="/patients" activeClassName="active-route">
            <Item eventKey="2" icon={<Icon icon="stethoscope" />}>
              المـــرضى
            </Item>
          </NavLink>
          {/* <NavLink to="/doctors" activeClassName="active-route">
            <Item eventKey="3" icon={<Icon icon="user-md" />}>
              الأطبـــاء
            </Item>
          </NavLink> */}
        </Nav>
        {/* <Nav pullRight>
          <NavLink to="/analytics" activeClassName="active-route">
            <Item eventKey="3" icon={<Icon icon="pie-chart" />}>
              إحصــائـــيات
            </Item>
          </NavLink>
        </Nav> */}
      </Body>
    </Navbar>
  )
}
