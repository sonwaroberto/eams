<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable
  >
    <v-card light>
      <v-toolbar flat class="flex-grow-0 mt-6">
        <date-picker v-model="attendanceDate"/>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="dialog = !dialog" small fab elevation="1">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="flex-grow-0">
        <v-row>
          <v-col
            col="12"
            sm="12"
            v-for="present in presence"
            :key="present.uid"
          >
            <AttendanceCard :present="present" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import DatePicker from './DatePicker.vue';
export default {
  components: { DatePicker },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    attend: {
      type: Object,
      required: true,
    },
    presence: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      attendanceDate: ''
    }
  },
  watch: {
    attendanceDate(val) {
      this.$emit('dateChanged', val)
    }
  },
  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    }
  },
  created() {
    this.attendanceDate = this.attend.date.replaceAll('/', '-')
  }
}
</script>