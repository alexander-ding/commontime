/**
 * Firebase Functions for sending emails of various purposes
 */

const functions = require('firebase-functions')
const { sendEmail } = require('./utils/email')
const { getInstance, getUserPresetByID, getPeriod, getRoom } = require('./utils/db')
const { dayMap } = require('./utils/constants')
const admin = require('firebase-admin')
const sentry = require("@sentry/node")
const date = require('date-and-time')
const db = admin.firestore()

/**
 * Firebase Function to send an email notifying the user that their room
 * has been rebooked
 */

// TO BE REWRITTEN AS ASYNC (AND SIMPLIFIED DRASTICALLY)
exports.roomRebooked = functions.https.onCall((data, context) => {
  try {
  if (!context.auth.token.admin && !context.auth.token.teacher) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins and teachers can rebook rooms')
  }

  let instance = null
  let by = null
  try {
    instance = data.instance
    by = data.by
  } catch (e) {
    throw new functions.https.HttpsError('invalid-argument', "Must supply instance and by arguments")
  }

  // gather relevant information
  const getUser = db.collection('users').where('id', '==', instance.creator).get().then(doc => {
    if (doc.empty) {
      throw new functions.https.HttpsError('invalid-argument', "Instance creator does not exist")
    }
    if (doc.size > 1) {
      throw new Error("Database has multiple users with the same ID")
    }
    const data = doc.docs[0].data()
    return data
  })

  const getByUser = db.collection('users').where('id', '==', by).get().then(doc => {
    if (doc.empty) {
      throw new functions.https.HttpsError('invalid-argument', "The user rebooking the room does not exist")
    }
    if (doc.size > 1) {
      throw new Error("Database has multiple users with the same ID")
    }
    const data = doc.docs[0].data()
    return data
  })
  
  const getRoom = db.collection('rooms').doc(instance.room).get().then(doc => {
    if (!doc.exists) {
      throw new functions.https.HttpsError('invalid-argument', 'Instance room does not exist')
    }
    return doc.data()
  })

  const getPeriod = db.collection('periods').doc(instance.period).get().then(doc => {
    if (!doc.exists) {
      throw new functions.https.HttpsError('invalid-argument', 'Instance period does not exist')
    }
    return doc.data()
  })

  

  return Promise.all([getUser, getByUser, getRoom, getPeriod]).then(([user, byUser, room, period]) => {
    return sendEmail(user.email, "roomRebooked", {
      roomName: room.name,
      periodName: period.name,
      date: instance.date,
      byName: byUser.name,
    })
  })
  } catch (error) {
    if (!error.code) sentry.captureException(error)
    throw error
  }
})

/**
 * Firebase Function to send an email confirming that their booking is
 * successful
 */
exports.meetingScheduled = functions.https.onCall(async (data, context) => {
  try {
  if (!context.auth.token.admin && !context.auth.token.teacher) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins and teachers can notify meetings.')
  }

  let instanceID = null
  let person = null
  try {
    instanceID = data.instanceID
    person = data.person
  } catch (e) {
    throw new functions.https.HttpsError('invalid-argument', "Must supply instanceID and person arguments.")
  }

  // gather relevant information

  const instance = await getInstance(instanceID) 
  if (Object.keys(instance).length === 0 && instance.constructor === Object) {
    throw new functions.https.HttpsError('not-found', `Instance ${instanceID} not found.`)
  }

  const participant = await getUserPresetByID(person)
  if (Object.keys(participant).length === 0 && participant.constructor === Object) {
    throw new functions.https.HttpsError('not-found', `User preset ${person} not found.`)
  }

  const creator = await getUserPresetByID(instance.creator)
  if (Object.keys(creator).length === 0 && creator.constructor === Object) {
    // this shouldn't happen even if the input is malformed
    throw new Error('not-found', `Instance creator, ${instance.creator}, not found.`)
  }

  const period = await getPeriod(instance.period)
  if (Object.keys(period).length === 0 && period.constructor === Object) {
    // this shouldn't happen even if the input is malformed
    throw new Error(`Period ${instance.period} not found.`)
  }

  let roomName = null
  if (instance.room) {
    const room = await getRoom(instance.room)
    if (Object.keys(room).length === 0 && room.constructor === Object) {
      // this shouldn't happen even if the input is malformed
      throw new Error(`Room ${instance.room} not found.`)
    }
    roomName = room.name
  } else {
    roomName = instance.roomName
  }
  await sendEmail(participant.email, 'oneoffMeetingNotify', {
    creatorName: creator.name,
    dayName: dayMap[period.day],
    periodName: period.name,
    dateName: date.format(date.parse(instance.date, 'MM/DD/YYYY'), 'MMMM DD'),
    roomName: roomName,
    name: instance.name,
  })
  } catch (error) {
    if (!error.code) sentry.captureException(error)
    throw error
  }
})

/**
 * Firebase Function to send an email confirming that their booking of
 * a recurring meeting is successful
 */
exports.recurringMeetingScheduled = functions.https.onCall(async (data, context) => {
  try {
  if (!context.auth.token.admin && !context.auth.token.teacher) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins and teachers can notify meetings')
  }

  let recurringID = null
  let person = null
  try {
    recurringID = data.recurringID
    person = data.person
  } catch (e) {
    throw new functions.https.HttpsError('invalid-argument', "Must supply recurringID and person arguments.")
  }

  // gather relevant information

  const recurring = await db.collection('recurrings').doc(recurringID).get().then(doc => {
    if (!doc.exists) {
      throw new functions.https.HttpsError('invalid-argument', `Recurring ${recurringID} not found.`)
    }
    return doc.data()
  })

  const participant = await db.collection('userPreset').where('id', '==', person).get().then(doc => {
    if (doc.empty) {
      throw new functions.https.HttpsError('invalid-argument', `Person ${person} not found.`)
    }
    if (doc.size > 1) {
      throw new functions.https.HttpsError('internal', "Database has multiple users with the same ID.")
    }
    const data = doc.docs[0].data()
    return data
  })

  const creator = await db.collection('userPreset').where('id', '==', recurring.creator).get().then(doc => {
    if (doc.empty) {
      throw new functions.https.HttpsError('invalid-argument', `Instance creator, ${recurring.creator}, does not exist.`)
    }
    if (doc.size > 1) {
      throw new functions.https.HttpsError('internal', "Database has multiple users with the same ID.")
    }
    const data = doc.docs[0].data()
    return data
  })
  
  const period = await db.collection('periods').doc(recurring.period).get().then(doc => {
    if (!doc.exists) {
      throw new functions.https.HttpsError('internal', "Period pointed by recurring event not found.")
    }
    return doc.data()
  })

  const roomName = recurring.room ?
    await db.collection('rooms').doc(recurring.room).get().then(doc => {
      if (!doc.exists) {
        throw new functions.https.HttpsError('internal', "Room pointed by recurring event not found.")
      }
      return doc.data().name
    }) : recurring.roomName

  return sendEmail(participant.email, 'recurringMeetingNotify', {
    creatorName: creator.name,
    dayName: dayMap[period.day],
    periodName: period.name,
    roomName: roomName,
    name: recurring.name,
  })
  } catch (error) {
    if (!error.code) sentry.captureException(error)
    throw error
  }
})