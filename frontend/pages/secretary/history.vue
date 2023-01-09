<template>
  <v-main>
    <v-card-text>
      <v-row>
        <v-col sm="6" md="4">
          <date-picker v-model="currentAttendanceDate" />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card>
      <v-data-table :loading="load" loading-text="Loading... Please wait" :headers="headers" :items="attendance">
        <template v-slot:[`item.actions`]="{ item }" >
          <v-btn small @click="moreDetails(item)" outlined>
            <v-icon>mdi-chevron-down</v-icon>More details
          </v-btn>          
        </template>
      </v-data-table>
    </v-card>
    <history-details v-if="currentAttendance" v-model="detailsDialog" :attend="currentAttendance" :presence="presence" @dateChanged="dateChanged" />
  </v-main>
</template>

<script>
import DatePicker from '../../components/DatePicker.vue'
import HistoryDetails from '../../components/HistoryDetails.vue'
export default {
  components: { HistoryDetails, DatePicker },
  layout: "auth",
  data() {
    return {
      detailsDialog: false,
      headers: [
        {text: 'Date',value: 'date',},
        { text: 'Present', value: 'present' },
        { text: 'Absent', value: 'absent' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      attendance: [],
      currentAttendance: null,
      currentAttendanceDate: "",
      presence: []
    }
  },
  watch: {
    currentAttendanceDate(val) {
      this.dateChanged(val)
    }
  },
  created() {
    this.$fire.firestore.collection("attendance").get().then((snap)=>{
      const attendance = []
      snap.forEach((doc) =>{
        attendance.push({...doc.data(),id:doc.id})
      })
      this.attendance = attendance
      this.load = false
    })
  },
  methods: {
    dateChanged(val) {
      const date = val.replaceAll('-', '/')
      const attend = this.attendance.find((a) => a.date === date)
      if (attend) {
        this.moreDetails(attend)
      } else {
        alert('No record for given date.')
      }
    },
    async moreDetails(item) {
      this.currentAttendance = item
      const accountsSnap = await this.$fire.firestore.collection('accounts').get()
      const accounts = accountsSnap.docs.map((doc) => ({...doc.data(), uid: doc.id}))
      this.$fire.firestore.collection("attendance").doc(item.id).collection("presence").get().then((presenceSnap) =>{
        const presence = []
        presenceSnap.forEach((doc)=>{
          const account = accounts.find((acc) => acc.uid === doc.id)
          presence.push({...doc.data(), id:doc.id, account})
        })
        this.presence = presence
      })
      this.detailsDialog = true
    }
  }
}
</script>

<style lang="scss">
</style>