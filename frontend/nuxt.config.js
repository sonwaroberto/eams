import colors from "vuetify/es5/util/colors";
export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s",
    title: "EAMS",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  //components
  components: true,
  server: {
    host: "0",
  },
  ssr: false,

  target: "static",

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ["~/plugins/vee-validate", "~/plugins/global-mixin"],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
    "@nuxtjs/moment",
  ],
  router: {},

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    "@nuxtjs/axios",
    [
      "@nuxtjs/firebase",
      {
        config: {
          apiKey: "AIzaSyCiLrn7tYIZVsyllBYsaQb6tkJZ8KsPQe0",
          authDomain: "employee-attendance-db.firebaseapp.com",
          projectId: "employee-attendance-db",
          storageBucket: "employee-attendance-db.appspot.com",
          messagingSenderId: "263380339417",
          appId: "1:263380339417:web:86d3e93527c22065df0cc8",
          measurementId: "G-9FBC7TGY0E",
        },
        services: {
          auth: true,
          firestore: true,
          functions: true,
          storage: true,
          database: true,
          messaging: true,
          performance: true,
          analytics: true,
          remoteConfig: true,
        },
      },
    ],
  ],

  axios: {
    baseURL: "http://localhost:5001/employee-c942f/us-central1/api",
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: colors.teal.base,
          accent: colors.cyan.lighten1,
          secondary: colors.purple.base,
          info: colors.blue.lighten1,
          warning: colors.orange.lighten1,
          error: colors.deepOrange.lighten1,
          success: colors.green.lighten1,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};
