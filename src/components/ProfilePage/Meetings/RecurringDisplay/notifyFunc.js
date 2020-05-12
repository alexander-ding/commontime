import React from 'react' 
import { Popover } from 'react-bootstrap'
import RecurringInviteForm from '../../../forms/RecurringInviteForm'

const notifyFunc = (instance, instanceID, handleSubmit) => {
  return <Popover>
    <Popover.Title>Add people to the meeting</Popover.Title>
    <Popover.Content>
      <RecurringInviteForm onSubmit={handleSubmit} instanceID={instanceID} instance={instance}/>
    </Popover.Content>
  </Popover>
}

export default notifyFunc