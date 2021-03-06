
import React from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import { connect } from 'react-redux'
import { isEmpty, isLoaded } from 'react-redux-firebase'
import { compose } from 'recompose'
import { Field, reduxForm } from 'redux-form'
import { pageSet } from '../../../actions/meetingPageActions'
import { filterDuplicate } from '../../../utils'
import SplashScreen from '../../SplashScreen'
import HybridSelect from '../components/HybridSelect'
import Toggle from '../components/Toggle'
import PropTypes from 'prop-types'

/**
 * Form to set the periods filter for finding available time slots for a meeting
 */
const PeriodsForm = ({periods, profile, handleSubmit, previousPage}) => {
  if (!isLoaded(periods) || !isLoaded(profile)) {
    return <SplashScreen/>
  }
  // avoid null values
  const filteredPeriods = periods ? filterDuplicate(Object.values(periods).filter(period => period), 'period') : []
  const canRebook = !isEmpty(profile) && profile.token.claims.teacher
  return (
  <Form onSubmit={handleSubmit}>
    <h5>What periods should we include in the search?</h5>
    <Form.Group>
      <Field
        name="periods"
        valueField='period'
        textField='name'
        data={filteredPeriods}
        filter='contains'
        component={HybridSelect}
      />
    </Form.Group>
    { canRebook ?
      <Form.Group>
        <Field 
          name="allowRebook"
          trueText="Show Booked"
          falseText="Hide Booked"
          component={Toggle}
        />
        <p className="text-muted">As a teacher, you may choose to ignore meeting members' other engagements (except for classes) when scheduling.</p>
      </Form.Group> :
      null
    }
    <ButtonGroup>
      <Button onClick={previousPage}>Previous</Button>
      <Button type='submit'>Next</Button>
    </ButtonGroup>
  </Form>
  )
}

PeriodsForm.propTypes = {
  periods: PropTypes.object,
  profile: PropTypes.object,
  /** Handler for form submission */
  handleSubmit: PropTypes.func.isRequired,
  /** Handler to navigate to the previous page of the form */
  previousPage: PropTypes.func.isRequired,
}

const form = 'scheduleMeetingSetupForm'
const enhance = compose(
  connect((state, props) => ({
    periods: state.firestore.data.periods,
    profile: state.firebase.profile,
  }), (dispatch) => ({
    previousPage: () => dispatch(pageSet('FREQUENCY'))
  })),
  reduxForm({
    form,
    destroyOnUnmount: false,
  }), 
  
)

export default enhance(PeriodsForm)