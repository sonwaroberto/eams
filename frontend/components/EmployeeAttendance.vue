<template>
  <v-main>
    <v-card>
      <v-card-text>
        <v-row>
          <v-col class="d-flex mx-4 mt-4 align-center" cols="12" sm="12">
            <v-select v-model="year" :items="years" label="Year" class="flex-grow-0" solo></v-select>
            <v-select v-if="byMonth" v-model="month" :items="months" label="Month" class="flex-grow-0 mx-4 " solo></v-select>
            <v-spacer></v-spacer>
             <v-switch v-model="byMonth" label="By Month" class="pa-3"></v-switch>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text>
        <v-row class="px-4">
          <v-data-table :headers="headers" :loading="load" loading-text="Loading... Please wait" :items="accountPresence" :items-per-page="5" class="elevation-1 flex-grow-1">
            <template #[`item.checkIn`]="{ item }">
              <template v-if="item.checkIn != null">
                {{$moment(item.checkIn.toDate()).format('h:m:s a')}}
              </template>
            </template>
             <template #[`item.checkOut`]="{ item }">
               <template v-if="item.checkOut != null">
                {{$moment(item.checkOut.toDate()).format('h:m:s a')}}
               </template>
            </template>
            <template #[`item.present`]="{ item }">
              <template v-if="item.present">
                 <span class="pa-4 success rounded-circle d-inline-block"></span>
              </template>
              <template v-else>
                <span class="pa-4 error rounded-circle d-inline-block"></span>
              </template>
            </template>
          </v-data-table>
        </v-row>
      </v-card-text>
    </v-card>
  </v-main>
</template>
<script>
export default {
  name: "App",
  layout: "auth",
  data() {
    return {
      headers:[
        {text:'Date' , value:'date'},
        {text:'Status' , value:'present'},
        {text:'check In', value:'checkIn'},
        {text:'check Out', value:'checkOut'}
      ],
      accounts: [],
      accountPresence: []
    }
  },
  async mounted() {
    if(this.$store.state.account != null) {
      const employeeId = this.$store.state.account.id
      const snapAttendance = await this.$fire.firestore.collection('attendance').get()
      let presence = []
      for (const doc of snapAttendance.docs) {
        let date = doc.data().date
        const snapPresence = await this.$fire.firestore.collection("attendance").doc(doc.id).collection("presence")
          .doc(employeeId).get()
        presence.push({...snapPresence.data(), uid: snapPresence.id,date})
      }
      this.accountPresence = presence
      this.accounts = presence
      this.load = false
      this.changeDate()
      this.loadAccountsPresence()
    }
  },
  methods: {
    loadAccountsPresence() {
      const date = this.year + (this.byMonth ? '/' + this.month : '')
      const presence = this.accounts.filter((p) => p.date.startsWith(date))
      this.accountPresence = presence
    }
  }
}
</script>

<style lang="scss">
</style>