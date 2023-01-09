<template>
  <v-main>
    <v-data-table :headers="headers" :items="employees" :search="search" class="elevation-5" 
    sort-by="position" :loading="load" loading-text="Loading... Please wait" >
      <template v-slot:top>
        <v-toolbar flat> 
          <v-toolbar-title>Employees Data</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field v-model="search" append-icon="mdi-magnify" label="Search Employee"
            single-line hide-details></v-text-field>
          <v-spacer></v-spacer>
          <v-btn color="primary" class="mb-2" @click="signupDialog = true">New Employee</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }" >
        <v-icon color="warning" small class="mr-2" @click="edit(item)"> mdi-pencil</v-icon>
        <v-icon color="error" small @click="deleteaccount(item)"> mdi-delete </v-icon>
        <v-icon color="info"  small @click="employeeProfile(item)">mdi-information</v-icon>
      </template>
    </v-data-table>

    <!-- Edit employee data -->
    <v-dialog v-model="editDialog" persistent max-width="300px">
      <v-card>
        <v-container fluid>
          <v-layout row wrap>
            <v-flex  mt-4>
              <v-card-title>
                Edit Employee Data
              </v-card-title>
              <v-card-text>
                <VO ref="observer" tab="form" id="signUpForm">
                  <VP rules="required" v-slot="{ errors }" name="Full Name">
                    <v-text-field 
                      label="Full name" 
                      type="text" 
                      v-model.lazy="editEmployeeData.name"
                      :error-messages="errors"
                      ></v-text-field>
                  </VP>
                  <VP rules="required" v-slot="{ errors }" name="country">
                    <v-text-field 
                      label="country" 
                      type="text" 
                      v-model.lazy="editEmployeeData.country"
                      :error-messages="errors"
                      ></v-text-field>
                  </VP>
                  <VP rules="required|email" v-slot="{ errors }" name="email">
                    <v-text-field 
                      label="Email" 
                      type="email"
                      v-model.lazy="editEmployeeData.email"
                      :error-messages="errors"
                      ></v-text-field>
                  </VP>
                  <VP rules="required" v-slot="{ errors }" name="position">
                    <v-text-field 
                      label="position in the company"
                      type="text"
                      v-model.lazy="editEmployeeData.position"
                      :error-messages="errors"
                      ></v-text-field>
                  </VP>
                  <VP rules="required" v-slot="{ errors }" name="company name">
                    <v-text-field 
                      label="name of the company"
                      type="text"
                      v-model.lazy="editEmployeeData.company_name"
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
                        <img :src="preview || editEmployeeData.image" alt="">
                      </v-avatar>  
                  </VP>
                  <v-checkbox v-model="editEmployeeData.admin" label="admin" class="flex-grow-1"></v-checkbox>
                  <VP v-if="editEmployeeData.admin" rules="required" v-slot="{ errors }" name="role admin">
                    <v-select 
                      v-model.lazy="editEmployeeData.role" 
                      :items="levels" 
                      label="Access Information Level"
                      :error-messages="errors"
                    ></v-select>
                  </VP>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="editDialog = false">cancel</v-btn>
                    <v-btn colorlevels="primary"  :loading="loading" @click="editEmployee()">Edit</v-btn>
                  </v-card-actions>
                </VO>
              </v-card-text>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog> 
    <!-- Employee details -->
    <v-dialog v-model="details" fullscreen  hide-overlay  transition="dialog-bottom-transition" scrollable >
      <v-card v-if="profile !=null && profile != [] && profile !=''">
        <v-toolbar flat dark color="primary">
          <v-btn  icon  dark  @click="details = !details">  <v-icon>mdi-close</v-icon>  </v-btn>
          <v-toolbar-title>{{profile.position}} {{profile.name}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-avatar> <img :src="profile.image" alt="" width="200"></v-avatar> 
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-list three-line  subheader>
            <v-subheader>User Specific Informations </v-subheader>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Employee </v-list-item-title>
                <v-avatar> <img :src="profile.image" alt="" width="200"></v-avatar>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Password</v-list-item-title>
                <v-list-item-subtitle>Require password for purchase or use password to restrict purchase</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list three-line  subheader>
            <v-subheader> User General Informations </v-subheader>
            <v-list-item>
              <v-list-item-action>
                <v-checkbox v-model="notifications"></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Notifications</v-list-item-title>
                <v-list-item-subtitle>Notify me about updates to apps or games that I downloaded</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-action>
                <v-checkbox v-model="sound"></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Sound</v-list-item-title>
                <v-list-item-subtitle>Auto-update apps at any time. Data charges may apply</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-action>
                <v-checkbox v-model="widgets"></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Auto-add widgets</v-list-item-title>
                <v-list-item-subtitle>Automatically add home screen widgets</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <div style="flex: 1 1 auto;"></div>
      </v-card>
    </v-dialog>
    <create-new-employee-dialog v-model="signupDialog"/>
    <v-dialog v-model="deleteAccount" width="400">
      <v-card v-if="!authLoading">
        <v-card-title style="word-break: break-word !important;" class="text-h5 info--text text-center">
          Are you sure you want to delete this account ?
        </v-card-title>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="error darken-2" text @click="deleteAccount = false"> close</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="deleteEmployee()" :loading="loading">delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script>
import CreateNewEmployeeDialog from '../../components/CreateNewEmployeeDialog.vue'
  export default {
  components: { CreateNewEmployeeDialog },
    layout:'auth',
    data: () => ({
      editDialog:false,
      loading:false,
      deleteAccount:false,
      employee:[],
      confirm:false,
      profile:[], 
      search:'',
      file:null,
      editEmployeeData:{
        name:'',
        country:'',
        email : '',
        position:'',
        company_name:'',
        admin:false,
        role:'',
        image:''
      },
      headers: [
        {text: 'Employee Name',align: 'start',value: 'name'},
        { text: 'Position', value: 'position' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      levels:["ADMIN","SECRETARY"] ,
      details: false,
      notifications: false,
      sound: true,
      widgets: false ,
      signupDialog: false,
    }),
    async created() {
      await this.getAllEmployees()
    }, 
    computed: {
      preview() {
        return this.file ? URL.createObjectURL(this.file) : ""
      }
    },
    methods: {
      edit(employee) {
        this.editDialog = true
        this.editEmployeeData = employee
      },
      async editEmployee() {
        const validInput = await this.$refs.observer.validate()
        if(!validInput) return
        if(this.upload) {
          this.$fire.firestore.collection('accounts').doc(this.editEmployeeData.id).update(this.editEmployeeData)
          this.editDialog = false
          let employee = this.editEmployeeData
          this.$axios.$post('/editEmployee', {admin:employee.admin,role:employee.role,uid:employee.id,email:employee.email})
          .then((res) => {
          })
          .catch((e) => {
            console.log(e)
          })
        }
      },
      deleteaccount(employee){
        this.deleteAccount = true
        this.employee = employee
      },
      deleteEmployee() {
        this.loading = true
        this.$axios.$post('/deleteEmployee', {uid:this.employee.id})
        .then((res) => {
          this.loading = false
          this.deleteAccount = false
        })
        .catch((e) => {
          this.loading = false
          this.deleteAccount = false
          console.log(e)
        }).finally(() =>{
          this.loading = false
          this.deleteAccount = false
          alert("user deleted successfully")
        })
      },
      employeeProfile(employee) {
        this.details = true
        this.profile = employee
      },
        upload() {
      if (this.file) {
        const ref = this.$fire.storage.ref().child(`images/employees/${this.file.name}`)
        console.log(ref)
        return ref.put(this.file).then(async (snapshot) => {
          const url = await ref.getDownloadURL()
          this.image = url
          console.log(this.image)
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