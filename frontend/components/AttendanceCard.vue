<template>
  <v-card class="d-flex mx-4 mt-4">
    <v-img :src="present.account.image || '/avatar.png'" width="56" height="64"/>
    <v-card-text class="d-flex">
      <span class="text-subtitle-1">{{present.account.name}}</span>
      <v-divider vertical class="mx-4"></v-divider>
      <div>
        <span class="text-overline">Check In:</span>
        <span v-if="present.checkIn != null" class="text-subtitle-1 font-weight-bold">{{$moment(present.checkIn.toDate()).format('h:m:s a')}}</span>
      </div>
      <v-divider vertical class="mx-4"></v-divider>
      <div>
        <span class="text-overline">Check Out:</span>
        <span v-if="present.checkOut != null" class="text-subtitle-1 font-weight-bold">{{$moment(present.checkOut.toDate()).format('h:m:s a')}}</span>
      </div>
    </v-card-text>
    <v-card-actions>
      <template v-if="!present.present">
        <v-chip color="error" class="mr-4">Absent</v-chip>
        <v-btn v-if="active" color="success" small outlined @click="checkIn(present.uid)"> <v-icon class="mr-2">mdi-clock</v-icon> Check In</v-btn>
      </template>
      <template v-else>
        <v-chip color="success" class="mr-4">Present</v-chip>
        <v-btn v-if="active && present.checkOut == null" color="success" small outlined @click="checkOut(present.uid)"> <v-icon class="mr-2">mdi-clock</v-icon> Check Out</v-btn>
      </template>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    present: {
      type: Object,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async checkIn(uid) {
      const attendanceQuery = await this.$fire.firestore.collection("attendance")
        .where("date", "==" ,this.$moment().format('Y/M/D')).get()
      if (!attendanceQuery.empty) {
        const attendance = attendanceQuery.docs[0]
        attendance.ref.update({
          present: this.$fireModule.firestore.FieldValue.increment(1)
        })
        attendance.ref.collection('presence').doc(uid).update({
          present: true,
          checkIn: new Date()
        })
      }
    },
    async checkOut(uid) {
      const attendanceQuery = await this.$fire.firestore.collection("attendance")
        .where("date", "==" ,this.$moment().format('Y/M/D')).get()
      if (!attendanceQuery.empty) {
        const attendance = attendanceQuery.docs[0]
        attendance.ref.collection('presence').doc(uid).update({
          checkOut: new Date()
        })
      }
    }
  }
}
</script>