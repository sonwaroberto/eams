const functions = require("firebase-functions")
const admin = require("firebase-admin")
const { user } = require("firebase-functions/v1/auth")
admin.initializeApp()

exports.adminRole = functions.https.onCall((data,context) => {
    return admin.auth().getUserByEmail(data.email).then( user =>{
        return admin.auth().setCustomUserClaims(user.uid, {
            admin: true
        })
    }).then(() => {
        return {
            message: `"Succes!" ${data.email} has been made an admin`
        }
    }).catch (e => {
        return e
    })
})