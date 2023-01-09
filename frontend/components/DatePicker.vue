<template>
  <div>
    <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="auto"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="date"
          label="Date Picker"
          prepend-icon="mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="date"
        :max="new Date().toISOString().substr(0, 10)"
        min="1950-01-01"
      ></v-date-picker>
    </v-menu>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: String,
        required: true
      }
    },
    data: () => ({
      menu: false,
    }),
    computed: {
      date: {
        get() { return this.value },
        set(val) { this.$emit('input', val) }
      }
    }
  }
</script>