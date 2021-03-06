import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'
import date from 'date-and-time'
import React from 'react'
import { Button, Card, Col, Row, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { connect } from 'react-redux'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'
import { compose } from 'recompose'
import { acceptInstanceInvitation, declineInvitation } from '../../../../actions/meetingPageActions'
import { dayMap } from '../../../../utils'
import SplashScreen from '../../../SplashScreen'
import PropTypes from 'prop-types'

/**
 * Component to display an invitation to a one-off meeting
 */
const InstanceDisplay = ({periods, rooms, instance, acceptInvitation, declineInvitation}) => {
  if (!isLoaded(instance) || !instance) {
    return <SplashScreen/>
  }
  const periodName = periods[instance.period].name
  const roomName = instance.room ? rooms[instance.room].name : instance.roomName
  const dateObj = date.parse(instance.date, 'MM/DD/YYYY')
  const dayName = dayMap[dateObj.getDay()]
  const dateName = date.format(dateObj, 'MMMM DD')
  return <Card className="mb-2">
    <Card.Body>
      <Row className="mx-0 p-0">
      <Col className="p-0">
      <Row className="mx-0 p-0">
      <Col className="p-0">
        <h5 className="d-inline">{instance.name}</h5>
        <div className="d-inline pl-1">{instance.room ? 
          <Button className="inline-link" variant="link" href={`/Room/${instance.room}`}>{roomName}</Button> :
          roomName
        }</div>  
      </Col>
      </Row>
      <Row className="mx-0 p-0">
        {`${dayName} ${periodName}, ${dateName}`}
      </Row>
      </Col>
      <OverlayTrigger
        placement="top-start"
        overlay={
          <Tooltip>
            Accept
          </Tooltip>
        }
      >
      <Button variant="link" className='mx-0 p-0 ml-auto d-flex justify-content-center align-items-center' style={{lineHeight: '0 !important'}} onClick={acceptInvitation}>
        <CheckIcon/>
      </Button>
      </OverlayTrigger>
      <OverlayTrigger
        placement="top-start"
        overlay={
          <Tooltip>
            Decline
          </Tooltip>
        }
      >
      <Button variant="link" className='mx-0 p-0 ml-auto d-flex justify-content-center align-items-center' style={{lineHeight: '0 !important'}} onClick={declineInvitation}>
        <CloseIcon/>
      </Button>
      </OverlayTrigger>
      </Row>
    </Card.Body>
  </Card>
}

InstanceDisplay.propTypes = {
  periods: PropTypes.object,
  rooms: PropTypes.object,
  instance: PropTypes.object,
  /** Handler to accept the invitation */
  acceptInvitation: PropTypes.func.isRequired,
  /** Handler to decline the invitation */
  declineInvitation: PropTypes.func.isRequired,
}

const enhance = compose(
  firestoreConnect(props => [{
    collection: 'instances',
    doc: props.invitation.instanceID,
    storeAs: `${props.invitationID}Instances`,
  }]),
  connect((state, props) => ({
    periods: state.firestore.data.periods,
    rooms: state.firestore.data.rooms,
    profile: state.firebase.profile,
    instance: state.firestore.data[`${props.invitationID}Instances`],
  }), (dispatch, props) => ({
    acceptInvitation: () => dispatch(acceptInstanceInvitation(props.invitationID, props.invitation)),
    declineInvitation: () => dispatch(declineInvitation(props.invitationID)),
  }))
)

export default enhance(InstanceDisplay)