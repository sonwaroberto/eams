<template>
  <v-app>
    <nuxt/>
    <v-footer app color="primary darken-3 justify-center" dark>
      EAMS &copy;2021
    </v-footer>
  </v-app>
</template>
  
<script>
export default {
  name: "App",
  middleware: ['guest'],
}
</script>

<style lang="scss"></style>