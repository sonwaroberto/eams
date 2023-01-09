<template>
  <v-dialog v-model="viewAccountDialog" width="400">
    <v-card v-if="!authLoading">
      <v-card-title class="text-h5 info--text grey lighten-2">
      Account Information
      </v-card-title>
      <v-card-text class="d-flex align-center justify-center" style="position: relative;top: 10px;">
        <template v-if="$store.state.user">
          <h2>Login as  <b class="warning--text">{{$store.state.account.role}}</b></h2>
          <!-- <h4>admin :  {{$store.state.account.position}}</h4> -->
          <!-- <h4>employee :  {{$store.state.account.name}}</h4>  -->
        </template>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error darken-2" text @click="viewAccountDialog = false"> close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      require: true
    }
  },
  computed: {
    viewAccountDialog: {
      get() { return this.value },
      set(val) { this.$emit('input', val) }
    }
  }
    
}
</script>