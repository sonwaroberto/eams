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
          <v-data-table :headers="headers" :loading="load" loading-text="Loading... Please wait" :items="accountsPresence" :items-per-page="5" class="elevation-1 flex-grow-1">
            <template #[`item.image`]="{ item }">
              <v-img :src="item.image || '/avatar.png'" width="40" height="40" />
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
        {text:'Photo' , value:'image'},
        {text:'Name' , value:'name'},
        {text:'Total Presence' , value:'totalPresence'},
        {text:'Total Absence' , value:'totalAbsence'}
      ],
      accounts: [],
      accountsPresence: []
    }
  },
  async created() {
    const snapAttendance = await this.$fire.firestore.collection('attendance').get()
    let presence = []
    for (const doc of snapAttendance.docs) {
      const snapPresence = await this.$fire.firestore.collection("attendance").doc(doc.id).collection("presence").get()
      presence = presence.concat(snapPresence.docs.map((d) => ({...d.data(), uid: d.id, date: doc.data().date })))
    }
    this.presence = presence
    this.accounts = (await this.$fire.firestore.collection('accounts').get()).docs
    this.changeDate()
    this.loadAccountsPresence()
  },
  methods: {
    loadAccountsPresence() {
      const date = this.year + (this.byMonth ? '/' + this.month : '')
      const presence = this.presence.filter((p) => p.date.startsWith(date))
      this.accountsPresence = this.accounts.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        totalPresence: presence.filter((p) => p.uid === doc.id && p.present).length,
        totalAbsence: presence.filter((p) => p.uid === doc.id && !p.present).length,
      }))
      this.load = false
    }
  }
}
</script>

<style lang="scss">
</style>