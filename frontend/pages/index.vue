<template>
  <div>
    <v-layout row wrap>
      <v-flex
        xs12
        sm10
        offset-sm1
        md4
        offset-md4
        mt-3
        class="d-flex align-center"
        style="height: calc(100vh - 48px)"
      >
        <div class="flex-grow-1">
          <v-img src="/logo.png" to="/" width="120" class="mx-auto" contain />
          <v-card class="mt-4">
            <v-card-title> Sign In Employee </v-card-title>
            <v-card-text>
              <VO ref="observer" tag="form" id="signIn">
                <VP rules="required|email" v-slot="{ errors }" name="Email">
                  <v-text-field
                    v-model="credential.email"
                    label="Email"
                    type="email"
                    :error-messages="errors"
                  ></v-text-field>
                </VP>
                <VP rules="required|min:6" v-slot="{ errors }" name="Password">
                  <v-text-field
                    v-model="credential.password"
                    label="Password"
                    type="password"
                    :error-messages="errors"
                  ></v-text-field>
                </VP>
                <v-btn
                  color="primary"
                  class="mt-2"
                  :loading="loading"
                  @click="signIn()"
                  >Log In</v-btn
                >
                <v-divider class="my-4"></v-divider>
                <a href="#" color="warning" text @click="resetDialog = true"
                  >Reset password</a
                >
              </VO>
            </v-card-text>
          </v-card>
        </div>
      </v-flex>
    </v-layout>
    <v-dialog v-model="emailVerifiedDialog" width="400">
      <v-card class="text-center" color="accent" dark>
        <v-card-title class="font-weight-thin">
          <h4>{{ textAccountVerified }}</h4>
        </v-card-title>
        <v-card-actions>
          <v-btn color="info" @click="sendVerification()" small>
            Send Mail Verification Again...</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn color="warning" @click="emailVerifiedDialog = false" small>
            close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <reset-dialog v-model="resetDialog" />
  </div>
</template>

<script>
import ResetDialog from "../components/ResetDialog.vue";
export default {
  components: { ResetDialog },
  name: "App",
  data() {
    return {
      loading: false,
      resetDialog: false,
      form: "",
      credential: {
        email: "",
        password: "",
      },
      emailVerifiedDialog: false,
      textAccountVerified: "Account Not Yet Verified...",
    };
  },
  methods: {
    async signIn() {
      const valid = await this.$refs.observer.validate();
      if (!valid) return;
      this.loading = true;
      const signInForm = document.querySelector("#signIn");
      this.form = signInForm;
      this.$fire.auth
        .signInWithEmailAndPassword(
          this.credential.email,
          this.credential.password
        )
        .then(async (user) => {
          await this.saveIdToken();
          signInForm.reset();
        })
        .catch((e) => {
          console.log(e);
          if (
            e.code == "auth/wrong-password" ||
            e.code == "auth/user-not-found"
          ) {
            this.$refs.observer.errors.Email.push(
              "Email or password was incorrect."
            );
            this.$refs.observer.errors.Password.push(
              "Email or password was incorrect."
            );
          } else if (e.code == "auth/network-request-failed") {
            this.$refs.observer.errors.Email.push(
              "A network error (such as timeout, interrupted connection or unreachable host) has occurred"
            );
          }
        })
        .finally(() => {
          this.loading = false;
          let user = this.$fire.auth.currentUser;
          if (!user) {
            console.log("no user");
          }
          if (user) {
            if (user.emailVerified == false) {
              this.emailVerifiedDialog = true;
            }
          }
        });
    },
    async sendVerification() {
      await this.sendMailVerification();
      await this.logOut();
      this.emailVerifiedDialog = false;
    },
  },
};
</script>

<style lang="scss"></style>
