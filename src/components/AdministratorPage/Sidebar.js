import React from 'react'
import { Nav } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import { connect } from 'react-redux'
import { administratorSidebarCollapsedToggled } from '../../actions/administratorActions'
import DashboardIcon from '@material-ui/icons/Dashboard'
import BuildIcon from '@material-ui/icons/Build'
import WarningIcon from '@material-ui/icons/Warning'
import MenuBookIcon from '@material-ui/icons/MenuBook'
import PeopleIcon from '@material-ui/icons/People'
import EventBusyIcon from '@material-ui/icons/EventBusy'
import PropTypes from 'prop-types'

/**
 * Component to display a collapsible sidebar to navigate under
 * the administrator page
 */
const Sidebar = ({location, collapsed, toggleCollapsed}) => {
  const pathname = location.pathname.replace("/Administrator", "")
  return (
    <div className={"sidebar d-flex flex-row "  + (collapsed ? "collapsed" : "show")}>
    <Nav activeKey={pathname} className="sidebar-sticky flex-column flex-grow-1">
      <Nav.Item>
        <Nav.Link href="/Administrator/Dashboard" eventKey="/Dashboard">
          <span className="sidebar-link-icon">
            <DashboardIcon fontSize="small"/>
            Dashboard
          </span>
          
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/Administrator/Courses" eventKey="/Courses">
          <span className="sidebar-link-icon">
            <MenuBookIcon fontSize="small"/>
            Courses
          </span>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/Administrator/Users" eventKey="/Users">
          <span className="sidebar-link-icon">
            <PeopleIcon fontSize="small"/>
            Users
          </span>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/Administrator/Exceptions" eventKey="/Exceptions">
          <span className="sidebar-link-icon">
            <EventBusyIcon fontSize="small"/>
            Exceptions
          </span>
        </Nav.Link>
      </Nav.Item>
      <div className="sidebar-divider"/>
      <Nav.Item>
        <Nav.Link href="/Administrator/Annual" eventKey="/Annual">
          <span className="sidebar-link-icon">
            <BuildIcon fontSize="small"/>
            Annual
          </span>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/Administrator/DangerZone" eventKey="/DangerZone">
        <span className="sidebar-link-icon">
            <WarningIcon fontSize="small"/>
            Danger Zone
          </span>
        </Nav.Link>
      </Nav.Item>
    </Nav>
    <div className="sidebar-toggle">
      <div className="toggle-wrapper d-flex justify-content-center align-items-center" onClick={toggleCollapsed}>
      { collapsed ? 
        <ArrowRightIcon fontSize="small"/> :
        <ArrowLeftIcon fontSize="small"/>
      }
      </div>
    </div>
    
    </div>
  )
}

Sidebar.propTypes = {
  /** router-supplied location object */
  location: PropTypes.object.isRequired,
  /** whether the sidebar is collapsed */
  collapsed: PropTypes.bool.isRequired,
  /** handler to toggle visibility of the sidebar */
  toggleCollapsed: PropTypes.func.isRequired,
}

const enhance = compose(
  withRouter,
  connect((state) => ({
    collapsed: state.administratorPage.sidebarCollapsed,
  }), (dispatch) => ({
    toggleCollapsed: () => dispatch(administratorSidebarCollapsedToggled()),
  }))
)

export default enhance(Sidebar)