import dateLib from 'date-and-time'
import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'
import { compose } from 'recompose'
import { notificationClosed } from '../../actions/notificationsActions'
import { dayMap } from '../../utils'
import SplashScreen from '../SplashScreen'

const BookRoomSuccess = ({data: {room, period, name, date}, periods, rooms, closeNotification}) => {
  if (!isLoaded(periods) || !isLoaded(rooms)) {
    return <SplashScreen/>
  }
  const dateObj = dateLib.parse(date, 'MM/DD/YYYY')
  const periodObj = periods[period]
  return (
    <Modal
      size="lg"
      centered
      show={true}
    >
      <Modal.Body>
        <h5>You have successfully booked a room</h5>
        <p>You have booked room&nbsp;
          <Button className="inline-link" variant="link" href={`Room/${room}`}>
            {rooms[room].name}
          </Button>
          &nbsp;on {`${dayMap[periodObj.day]} ${periodObj.name}, ${dateLib.format(dateObj, 'MMMM DD')}, for ${name}.`}
        </p>
        <p>An event will be created on your Google Calendar to mark this booking.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={closeNotification}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

const enhance = compose(
  firestoreConnect([{
    collection: 'periods',
  }, {
    collection: 'rooms',
  }]),
  connect(state => ({
    data: state.notifications.data,
    periods: state.firestore.data.periods,
    rooms: state.firestore.data.rooms,
  }), dispatch => ({
    closeNotification: () => dispatch(notificationClosed()),
  }))
)

export default enhance(BookRoomSuccess)