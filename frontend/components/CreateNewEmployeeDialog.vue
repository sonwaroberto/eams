<template>
  <div>
    <v-dialog v-model="signupDialog" persistent max-width="400px">
      <v-card>
        <v-container fluid>
          <v-layout row wrap>
            <v-flex  mt-4> 
              <v-card-title>
                Create New Employee
              </v-card-title>
              <v-card-text>
                <VO ref="observer" tab="form" id="signUpForm">
                  <VP rules="required" v-slot="{ errors }" name="Full Name">
                    <v-text-field 
                      label="Full name" 
                      type="text" 
                      v-model="fullName"
                      :error-messages="errors"
                      ></v-text-field>
                  </VP>
                  <VP rules="required" v-slot="{ errors }" name="country">
                    <v-text-field 
                      label="country" 
                      type="text" 
                      v-model="country"
                      :error-messages="errors"
                      ></v-text-field>
                  </VP>
                  <VP rules="required|email" v-slot="{ errors }" name="email">
                    <v-text-field 
                      label="Email" 
                      type="email"
                      v-model="email"
                      :error-messages="errors"
                      ></v-text-field>
                  </VP>
                  <VP rules="required|confirmed:confirmation|max:12|min:6" v-slot="{ errors }" name="password">
                    <v-text-field 
                      label="Password"
                      type="password"
                      v-model="password"
                      :error-messages="errors"
                      ></v-text-field>
                  </VP>
                  <VP vid="confirmation" v-slot="{ errors }" name="Confirm Password">
                    <v-text-field
                      label="Confirm Password"
                      type="password"
                      v-model="confirmation"
                      :error-messages="errors"
                      ></v-text-field>
                  </VP>
                  <VP rules="required" v-slot="{ errors }" name="position">
                    <v-text-field 
                      label="position in the company"
                      type="text"
                      v-model="position"
                      :error-messages="errors"
                      ></v-text-field>
                  </VP>
                  <VP rules="required" v-slot="{ errors }" name="company name">
                    <v-text-field 
                      label="name of the company"
                      type="text"
                      v-model="companyName"
                      :error-messages="errors"
                      ></v-text-field>
                  </VP> 
                  <VP rules="size:300|required" v-slot="{ errors }" name="image" >
                    <v-file-input
                      accept="image/png, image/jpeg, image/bmp"
                      placeholder="Pick an avatar"
                      prepend-icon="mdi-camera"
                      label="Avatar"
                      :error-messages ="errors"
                      v-model="file"
                     ></v-file-input>
                      <v-avatar>
                        <img :src="preview || '/avatar.png'" alt="">
                      </v-avatar>  
                  </VP>
                  <v-checkbox v-model="admin" label="admin" class="flex-grow-1"></v-checkbox>
                  <VP v-if="admin" rules="required" v-slot="{ errors }" name="role admin">
                    <v-select 
                      v-model="role" 
                      :items="levels" 
                      label="Access Level"
                      :error-messages="errors"
                    ></v-select>
                  </VP>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="signupDialog = false">Close</v-btn>
                    <v-btn color="primary"  :loading="loading" @click="signUp()">Create</v-btn>
                  </v-card-actions>
                </VO>
              </v-card-text>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog v-model="networkError" width="300">
      <v-card>
        <v-card-title>
          404 Error
        </v-card-title>
        <v-card-text>
          {{networkErrors}}
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="networkError = false">Okay</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="verificationAdmin" persistent max-width="400px">
      <v-card>
        <v-card-title>
          Enter Your Password To Confirm That Your Are The Admin
        </v-card-title>   
        <v-card-text>
          <VO ref="observer" tag="form" id="verificationAdmin">
            <VP rules="required|max:12|min:6" v-slot="{ errors }" name="password">
              <v-text-field 
                label="Password"
                type="password"
                v-model="adminPassword"
                :error-messages="errors"
                ></v-text-field>
            </VP>
          </VO>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn  color="error darken-1" text @click="verificationAdmin = false,signupDialog= false">Close</v-btn>
          <v-btn color="primary" :loading="loading" @click="signUp()">Confirm</v-btn>
        </v-card-actions>
      </v-card>
  </v-dialog>
   <v-alert v-model="alert" dismissible shaped type="success"> New Employee Added Successfully</v-alert>
  </div>
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
      file:null,
      image:'',
      alert: false,
      adminPassword:'',
      adminEmail:'',
      verificationAdmin:false,
      networkError:false,
      networkErrors:'',
      loading:false,
      confirmation :'',
      fullName:'',
      country:'',
      email : '',
      password : '',
      position:'',
      admin:false,
      role:'',
      uid:'',
      workerRole:'',
      levels:["ADMIN","SECRETARY"] ,
      companyName:'',
      uidCurrentSecretary:'',
      secretaryExist:false
    }
  },
  computed: {
    signupDialog: {
      get() {return this.value},
      set(val) { this.$emit('input', val) }
    },
   preview() {
      return this.file ? URL.createObjectURL(this.file) : ""
    }
  },
  created() {
    if(this.$store.state.user != null){
      this.adminEmail =  this.$store.state.user.email
    }
  },
  async mounted() {
    let uid = ''
    this.$fire.firestore.collection('accounts').where("role", "==", "SECRETARY").onSnapshot(snap => {
      snap.forEach((doc) => {
        if (doc.exists) {
          uid = doc.id
          this.secretaryExist = true
        }else{
          console.log("No secretary yet")
        }
      })
      this.uidCurrentSecretary = uid
    })
  },
  methods:{
    async signUp() {
      const validInput = await this.$refs.observer.validate()
      if(!validInput) return
      this.verificationAdmin = true
      const user = this.$fire.auth.currentUser
      var credentials = this.$fireModule.auth.EmailAuthProvider.credential(
        this.adminEmail,
        this.adminPassword
      )
      if(this.adminPassword == '') return
      await user.reauthenticateWithCredential(credentials).then(async() => {
        this.loading = true
        this.verificationAdmin = false
        if (this.admin) {
          if (this.role == "ADMIN") {
            this.workerRole = "ADMIN"
          } else {
            this.workerRole = "SECRETARY"
          }
        } else {
          this.workerRole = "EMPLOYEE"
        }
        if(this.workerRole == "SECRETARY"){
          if(this.secretaryExist){
            if(confirm("There is already a Secretary, should we delete her and create a new Secretary?")){
              await this.$axios.$post('/deleteEmployee', {uid:this.uidCurrentSecretary})
              .then((res) => {
              })
              .catch((e) => {
                console.log(e)
              })
            }
            this.secretaryExist = false
          }
        }else {
          this.secretaryExist = false
        }
        if(this.secretaryExist == false) {
          await this.$fire.auth.createUserWithEmailAndPassword(this.email , this.password ).then(async(user) => {
            await this.upload()
            console.log(this.image)
            await this.$fire.firestore.collection("accounts").doc(user.user.uid).set({
              name: this.fullName,
              country: this.country,
              position: this.position,
              email: this.email,
              date: new Date(),
              company_name: this.companyName,
              password: this.password,
              image: this.image,
              role: this.workerRole
            })
            .catch((e) => {
              console.log(e)
            })
            this.uid = user.user.uid
            this.sendMailVerification()
            this.$axios.$post('/claims/admin', { admin:this.admin,role:this.role,uid:this.uid})
            .then ( data => {
            })
            .catch( (e) => {
              console.log("The error is ",e)
            })
            await this.$fire.auth.signInWithEmailAndPassword( this.adminEmail , this.adminPassword ).then( async (user) => {
              await this.saveIdToken()
              this.loading = false
              this.signupDialog = false
              this.verificationAdmin = false
              this.alert = true
            })
            .catch( (e) => {
              this.verificationAdmin = true
              this.loading = false
              console.log(e)
              if ( e.code == "auth/wrong-password") {
                this.$refs.observer.errors.password.push('password is not incorrect.')
              } else if(e.code == "auth/network-request-failed") {
                this.$refs.observer.errors.Email.push("A network error (such as timeout, interrupted connection or unreachable host) has occurred")
              }
            })
            .finally(() => {
              this.verificationAdmin = false
            })
          })
          .catch( (e) => {
            this.networkError = true
            console.log(e)
            if ( e.code == "auth/wrong-password" ) {
              this.networkErrors = 'The new user password is incorrect.'
            }else if ( e.code == "auth/email-already-in-use" ){
              this.networkErrors = 'The new user email is already in use.'
            }else if( e.code == "auth/network-request-failed" ) {
              this.networkErrors = "A network error (such as timeout, interrupted connection or unreachable host) has occurred"
            }
          })  
          .finally(() => {
            this.loading = false
          })
        }
      }).catch((e) => {
        this.loading = false
        this.networkError = true
        console.log(e)
        if ( e.code == "auth/wrong-password") {
          this.networkErrors = 'The password was incorrect.'
        }else if(e.code == "auth/network-request-failed") {
          this.networkErrors = "A network error (such as timeout, interrupted connection or unreachable host) has occurred"
        }
        console.log(e)
      })
      
    },
     upload() {
      if (this.file) {
        const ref = this.$fire.storage.ref().child(`images/employees/${this.file.name}`)
        return ref.put(this.file).then(async (snapshot) => {
          const url = await ref.getDownloadURL()
          this.image = url
        })
      } else {
        return false
      }
    },
  }
}
</script>

<style lang="scss">

</style>