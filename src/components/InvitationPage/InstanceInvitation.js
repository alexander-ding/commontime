import React from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import { connect } from 'react-redux'
import { firestoreConnect, isEmpty, isLoaded } from 'react-redux-firebase'
import { compose } from 'recompose'
import { acceptInvitation, declineInvitation } from '../../actions/invitationPageActions'
import { dayMap } from '../../utils'
import NotFoundPage from '../NotFoundPage'
import SplashScreen from '../SplashScreen'
import date from 'date-and-time'
import PropTypes from 'prop-types'

/**
 * Component to display an invitation to a one-off meeting
 */
const InstanceInvitation = ({creator, invitee, instanceID, periods, rooms, instances, handleAccept, handleDecline}) => {
  if (!isLoaded(periods) || !isLoaded(rooms) || !isLoaded(instances)) {
    return <SplashScreen/>
  }

  // if the instance pointed to by the invitation is not found, return 404
  if (isEmpty(instances) || !instances[instanceID]) {
    return <NotFoundPage/>
  }

  const instance = instances[instanceID]
  const period = periods[instance.period] ? periods[instance.period] : {}
  const room = instance.room ?
    (rooms[instance.room] ? rooms[instance.room] : {}) :
    { name: instance.roomName }
  const instanceDate = date.parse(instance.date, 'MM/DD/YYYY')
  return (<div className="main text-center">
    <h3>Invitation</h3>
    <p>{`${creator.name} has invited you, ${invitee.name}, to a meeting on ${dayMap[instanceDate.getDay()]} ${period.name}, ${date.format(instanceDate, 'MMMM DD')}${
      room.name ? `, in ${room.name}` : null
    }, for ${instance.name}.`}</p>
    <ButtonGroup>
      <Button onClick={handleAccept} variant="success">Accept</Button>
      <Button onClick={handleDecline} variant="danger">Decline</Button>
    </ButtonGroup>
  </div>)
}

InstanceInvitation.propTypes = {
  /** Creator of the invitation */
  creator: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  /** The invited user */
  invitee: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  /** ID of the invitation's instance */
  instanceID: PropTypes.string.isRequired,
  periods: PropTypes.object,
  rooms: PropTypes.object,
  instances: PropTypes.object,
  /** Handler for accepting the invitation */
  handleAccept: PropTypes.func.isRequired,
  /** Handler for declining the invitation */
  handleDecline: PropTypes.func.isRequired,
}

const enhance = compose(
  connect((state, props) => ({
    periods: state.firestore.data.periods,
    rooms: state.firestore.data.rooms,
    instances: state.firestore.data.instances,
  }), (dispatch, props) => ({
    handleAccept: () => dispatch(acceptInvitation(props.invitationID)),
    handleDecline: () => dispatch(declineInvitation(props.invitationID)),
  })),
  firestoreConnect(props => [
    { collection: 'periods' },
    { collection: 'rooms'},
    { collection: 'instances', doc: props.instanceID },
  ]),
)

export default enhance(InstanceInvitation)