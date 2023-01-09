import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
import { Application, Request, Response } from 'express'
import * as express from "express"
import * as cors from 'cors'
const auth = require('../auth')
import * as moment from 'moment'

let serviceAccount = require("../serviceAccountKey.json")
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

let app: Application = express()
app.use(express.json())

app.use(cors({origin: true}))

app.get('/', (req: Request, res: Response) => {
  console.log(res)
  res.send('hello world!')
  return
});

async function startAttendance() {
  const today = moment().format('Y/M/D')
  const ref = await db.collection("attendance").add({
    date: today,
    present: 0,
    absent: 0,
    active:true
  })
  const accounts = await db.collection('accounts').where('role', '==', 'EMPLOYEE').get()
  accounts.forEach((doc) => {
    ref.collection('presence').doc(doc.id).set({
      present: false,
      checkIn: null,
      checkOut: null
    })
  })
}

async function stopAttendance() {
  const today = moment().format('Y/M/D')
  const attendanceQuery = await db.collection('attendance').where('date', '==', today).get()
  if (attendanceQuery.empty) return
  const attendance = attendanceQuery.docs[0]
  const notCheckedOut = await attendance.ref.collection('presence').where('present', '==', true).where('checkOut', '==', null).get()
  notCheckedOut.forEach((doc) => {
    doc.ref.update({checkOut: moment()})
  })
  const absent = await attendance.ref.collection('presence').where('present', '==', false).get()
  
  attendance.ref.update({ active: false, absent: absent.size })
}

app.post('/attendance/start', auth,  (req: Request, res: Response) => {
  startAttendance()
  res.send('started')
})  

app.post('/attendance/stop', auth,  (req: Request, res: Response) => {
  stopAttendance()
  res.send('stopped')
})  

app.post('/claims/admin', auth,  (req: Request, res: Response) => {
  const { uid, admin: isAdmin, role } = req.body
  if(isAdmin) {
    admin.auth().setCustomUserClaims(uid, { admin: true, role })
    .then(() => {
      console.log(`${uid} has been made an admin`)
    }).catch((e) => {
      console.log("The error is ", e)
      res.send("Something went wrong")
      return
    })
  } else {
    res.send('created successfully!!')  
    return
  }
  return
})  

app.post("/deleteEmployee", auth, (req: Request, res:Response) => {
  admin.auth().deleteUser(req.body.uid)
  admin.firestore().collection("accounts").doc(req.body.uid).delete()
  .then(() => {
    console.log('Successfully deleted user')
    res.end()
  })
  .catch((error) => {
    console.log('Error deleting user:', error);
    res.end()
  }).finally(()=>{
    res.end()
  });
})
app.get("/login", function (req: Request, res: Response) {
  console.log(req)
  res.json(req)
  return
})

app.post('/editEmployee', auth,  (req: Request, res: Response) => {
  admin.auth().updateUser(req.body.uid, {
    email: req.body.email,
  })
  if(req.body.admin) {
    admin.auth().setCustomUserClaims(req.body.uid, { admin: true, role: req.body.role })
    .then(() => {
      console.log(`${req.body.uid} has been made an admin`)
      return
    }).catch((e) => {
      console.log("The erro is ", e)
      res.send("Something went wrong")
      return
    })
  } else {
    res.send('created successfully!!')  
  }
})  


export const api = functions.https.onRequest(app);