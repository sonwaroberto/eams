<template>
  <v-main>
    <div class="d-flex mt-6 align-center">
      <v-subheader>Employees' Attendance</v-subheader>
      <v-chip color="secondary" class="text-overline">{{ date }}</v-chip>
      <v-chip color="success" class="ml-4">
        <span class="text-overline mr-1">Start Time:</span>
        <span class="text-subtitle-1 font-weight-bold">9 am</span>
      </v-chip>
      <v-chip color="error" class="ml-4">
        <span class="text-overline mr-1">Close Time:</span>
        <span class="text-subtitle-1 font-weight-bold">6 pm</span>
      </v-chip>
      <v-spacer></v-spacer>
      <v-chip color="success" class="ml-4" v-if="!attendance">
        <span class="text-overline mr-1" @click="startAttendance()">Start</span>
      </v-chip>
      <v-chip v-if="active" color="error" class="ml-4">
        <span class="text-overline mr-1" @click="stopAttendance()">Close</span>
      </v-chip>
      <v-spacer></v-spacer>
    </div>
    <template v-if="attendance">
      <AttendanceCard v-for="p in present" :key="p.uid" :present="p" :active="active" />
    </template>
    <v-card v-else color="warning" dark width="320" class="text-center mx-auto mt-12">
      <v-icon size="200" class="mt-2">mdi-clock</v-icon>
      <v-card-title class="text-center d-block">
        Waiting for start time...
      </v-card-title>
    </v-card>
    <v-dialog v-model="AttendanceState" transition="dialog-bottom-transition" width="400">
      <v-card v-if="!authLoading" class="text-center" color="accent" dark>
        <v-card-title class="text-uppercase">
          <h3 v-if="!authLoading">{{textAttendance}}</h3>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="warning" @click="AttendanceState = false"> close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
  
</template>

<script>
export default {
  layout:'auth',
  data () {
    return {  
      date: '',
      attendance: null,
      active: false,
      present: [],
      accounts: [],
      AttendanceState:false,
      textAttendance :''
    }
  },
  async created() {
    this.date = new Date().toDateString()
    const accountsQuery = await this.$fire.firestore.collection('accounts').get()
    const accounts = accountsQuery.docs.map((doc) => ({...doc.data(), uid: doc.id}))
    this.$fire.firestore.collection("attendance")
        .where("date", "==" ,this.$moment().format('Y/M/D'))
        .onSnapshot((snap) => {
          if (snap.empty) {
            this.attendance = null
            return
          }
          const attendance = snap.docs[0]
          this.active = attendance.data().active
          this.attendance = {...attendance.data(), id: attendance.id}
          attendance.ref.collection('presence').onSnapshot((snap) => {
              const presence = []
              snap.forEach((doc) => {
                const account = accounts.find((acc) => acc.uid === doc.id)
                presence.push({...doc.data(), uid: doc.id, account})
                this.attendance = {...attendance, id:attendance.id}
              })
              this.present = presence
            })
        })
  },
  methods: {
    async startAttendance() {
      this.$axios.$post('/attendance/start', {})
        .then((res) => {
          this.textAttendance = "Attendance started !!!"
          this.AttendanceState = true
        })
        .catch((e) => {
          console.log(e)
          alert('Something went wrong!')
        })
    },
    async stopAttendance() {
      this.$axios.$post('/attendance/stop', {})
        .then((res) => {
          this.textAttendance = "Attendance stopped !!!" 
          this.AttendanceState =true
        })
        .catch((e) => {
          console.log(e)
          alert('Something went wrong!')
        })
    }
  }
}
</script>

<style lang="scss">
</style>