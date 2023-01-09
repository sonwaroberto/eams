import Vue from 'vue'

Vue.mixin({
  data() {
    return{
      employees:[],
      load:true,
      years: [],
      months: [],
      year: 0,
      month: 0,
      byMonth: false,
    }
  },
  computed: {
    authLoading() { return this.$store.state.isAuthLoading }
  },
	methods: {
	  logOut() { 
      this.$fire.auth.signOut().then(() => {
        this.$store.commit('SET_USER', null)
        this.$store.commit('SET_ACCOUNT', null)
        this.$store.commit('SET_TOKEN', null)
      })
    },
    sendMailVerification() {
      const user = 	this.$fire.auth.currentUser
      user.sendEmailVerification().then(function() {
         console.log("send mail verification to " + user.email) 
      }).catch( (e) => {
        console.log("verification error",e)
      })
    },
    async saveIdToken() {
      const idToken = await this.$fire.auth.currentUser.getIdToken(true)
      .catch( (e) => {
        console.log("The error is ",e)
      })
      localStorage.setItem('idToken', idToken)
      localStorage.setItem('tokenExpires', new Date().getTime() + 3600000)
      this.$store.commit('SET_TOKEN', idToken)
    },
    getAllEmployees() {
      this.$fire.firestore.collection('accounts').onSnapshot(snap => {
        const employees = []
        snap.forEach((doc) => {
          if (doc.exists) {
            employees.push({...doc.data(), id:doc.id})
            this.load = false
          }
        })
        this.employees = employees
      })
    },
    changeDate() {
      const date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth()
      this.year = year
      this.month = month + 1
      while (year >= 2020) {
        this.years.push(year)
        year--
      }
      while (month >= 0) {
        this.months.push(month + 1)
        month--
      }
    } 
  },
  watch: {
    year(val) {
      if (val)
        this.loadAccountsPresence()
    },
    month(val) {
      if (val)
        this.loadAccountsPresence()
    },
    byMonth(val) {
      this.loadAccountsPresence()
    }
  },
})