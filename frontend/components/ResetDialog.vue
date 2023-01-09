<template>
  <!-- Reset Password -->
  <v-dialog v-model="dialog" persistent max-width="400px">
    <v-card>
      <v-card-title>
        Reset Your Password
      </v-card-title>   
      <v-card-text>
         <VO ref="observer" tag="form" id="resetPassword">
          <VP rules="required|email" v-slot="{ errors }" name="Email">
            <v-text-field
              v-model="credential.email"
              label="Email"
              type="email"
              :error-messages="errors"
            ></v-text-field>
          </VP>
        </VO>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn  color="error darken-1" text @click="dialog = false">Close</v-btn>
        <v-btn color="primary" :loading="loading" @click="resetPassword()">Reset Password</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      credential: {
        email: '',
      }
    }
  },
  computed: {
    dialog: {
      get() { return this.value },
      set(val) { this.$emit('input', val) }
    }
  },
  methods: {
    resetPassword() {
      this.loading = true
      const resetDialog = document.querySelector("#resetPassword")
      this.$fire.auth.sendPasswordResetEmail(this.credential.email).then(() => {
        alert("password reset email send successfully")
        alert("visit your account to confirm your password")
        resetDialog.reset()
        this.dialog = false
      })
      .catch( (e) => {
        console.log(e)
        this.loading = false
        this.dialog = true
         if ( e.code == "auth/user-not-found" || e.code == "auth/argument-error" ) {
          this.$refs.observer.errors.Email.push('Email was incorrect.')
        } else if(e.code == "auth/network-request-failed") {
          this.$refs.observer.errors.Email.push("A network error (such as timeout, interrupted connection or unreachable host) has occurred")
        }
      
      })
      .finally(() => {
        this.loading = false
      })
    },
  }
}
</script>