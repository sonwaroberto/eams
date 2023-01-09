const admin = require("firebase-admin")

module.exports = async (req, res, next) => {
  if (!req.headers || !req.headers.authorization || 
    !req.headers.authorization.startsWith('Bearer')){
      res.status(401).send('Unauthorized')
      return
    }
  const idToken = req.headers.authorization.split(' ')[1]
  try{
    const decodedIdToken = await admin.auth().verifyIdToken(idToken)
    req.user = decodedIdToken
    next()
    return
  }catch(e) {
    res.status(401).send("Unauthorized")
    return
  }
}