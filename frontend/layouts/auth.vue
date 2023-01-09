<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon v-if="!authLoading"  class="hidden-md-and-up"  @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="!authLoading">
        <template v-if="$store.state.user">
          <v-btn text id="account" @click =" viewAccountDialog = true ">
            <v-icon class="d-flex d-sm-none">mdi-account</v-icon>
            <v-btn  class="d-none d-sm-flex">Account</v-btn>
          </v-btn>
          <v-btn text id="logout">
            <v-icon class="d-flex d-sm-none">mdi-logout</v-icon>
            <v-btn type="submit" @click="logOut()" class="d-none d-sm-flex">Log Out</v-btn>
          </v-btn>
          <v-list-item-avatar v-if="image !=''">
            <v-img  :src="image" to="/" width="80" class="mx-auto"/>
          </v-list-item-avatar>
          <v-list-item-avatar v-else>
            <v-img src="/avatar.png"/>
          </v-list-item-avatar>
        </template>
      </v-toolbar-items>
    </v-app-bar>
    <v-navigation-drawer disable-resize-watcher v-if="!authLoading" dark color="grey darken-3"
     v-model="drawer" app floating :permanent="$vuetify.breakpoint.mdAndUp" :mini-variant.sync="shortMenu">
      <v-app-bar-nav-icon v-if="!authLoading"  class="hidden-md-and-up"  @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <router-link to="/"><v-img src="/logo.png" to="/" width="80" class="mx-auto" contain/></router-link>
      <v-list-item class="px-2" @click="shortMenu =!shortMenu">
        <v-btn small v-if="$store.state.account != null && !shortMenu">{{$store.state.account.position}} {{$store.state.account.name}}</v-btn>  
        <v-btn icon small>
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>  
      </v-list-item>
      <v-divider></v-divider>
      <v-list v-model="shortMenu">
        <template v-if="role == 'ADMIN' ">
          <v-list-item v-for="adminMenu in adminMenus" :key="adminMenu.title" link :to="adminMenu.href">
            <v-list-item-icon>
              <v-icon>{{ adminMenu.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ adminMenu.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <template v-else-if="role == 'SECRETARY' ">
          <v-list-item v-for="secretaryMenu in secretaryMenus" :key="secretaryMenu.title" link :to="secretaryMenu.href">
            <v-list-item-icon>
              <v-icon>{{ secretaryMenu.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ secretaryMenu.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <template v-else>
         <v-list-item v-for="employeeMenu in employeeMenus" :key="employeeMenu.title" link :to="employeeMenu.href">
            <v-list-item-icon>
              <v-icon>{{ employeeMenu.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ employeeMenu.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <nuxt v-if="!authLoading"/>
    <v-row v-else justify="center" align="center" style="height: 100vh;">
      <v-progress-circular  :size="70"  :width="7"  color="black" indeterminate></v-progress-circular>
    </v-row>
    <v-footer app color="primary darken-3 justify-center" dark>
      EAMS &copy;2021
    </v-footer>
    <view-account-dialog v-model="viewAccountDialog"/>
  </v-app>
</template>

<script>
import ViewAccountDialog from '../components/ViewAccountDialog.vue'
export default {
  components: { ViewAccountDialog },
  name: "auth",
  middleware: ['auth'],
  data() {
    return {
      viewAccountDialog: false,
      drawer: true,
      shortMenu: false,
      role:'',
      image:'',
      adminMenus: [
        { title:"Employees", href:"./employee", icon:"mdi-account-group-outline" },
        { title:"Attendance", href:"./workers", icon:"mdi-clock-start" },
      ],
      secretaryMenus: [
        { title:'Attendance', href:"./attendance", icon:'mdi-clock-start'},
        { title: 'History',href:"./history", icon: 'mdi-history' },
        { title: 'Workers',href:"./workers", icon: 'mdi-briefcase' },
      ],
      employeeMenus: [
        { title: 'Dashboard',href:"./dashboard", icon: 'mdi-view-dashboard' },
      ]
    }
  },
  async mounted() {
    this.$fire.auth.onAuthStateChanged(async user  => {
      const idToken = localStorage.getItem('idToken')
      const expires = localStorage.getItem('tokenExpires')
      if (user) {
          const { claims } = await user.getIdTokenResult()
          this.role = claims.role
          const account = await this.$fire.firestore.collection("accounts").doc(user.uid).get()
          this.image = account.data().image
          this.$store.commit('SET_ACCOUNT', {...account.data(), id: account.id})
          this.$store.commit('SET_USER', {uid: user.uid, email: user.email})
          if (idToken && expires) {
            const now = new Date().getTime()
            if (now < parseInt(expires)) 
              this.$store.commit('SET_TOKEN', idToken)
            else {
              localStorage.removeItem('idToken')
              localStorage.removeItem('tokenExpires')
              this.saveIdToken()
            }
          } else {
            this.saveIdToken()
          }
      } else {
        // user is not logged-in
        if (idToken && expires) {
          localStorage.removeItem('idToken')
          localStorage.removeItem('tokenExpires')
        }
      }
      this.$store.commit('SET_AUTH_LOADING', false)
    })
  }
}
</script>

<style>

</style>