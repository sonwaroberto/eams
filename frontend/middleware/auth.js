export default function ({ app, route, store, redirect, $fire, $axios }) {
  console.log("route", route.path);
  return $fire.auth.onAuthStateChanged(async (user) => {
    if (!user) {
      redirect("/");
    }
    if (user) {
      // if(user.emailVerified) {
      const { claims } = await user.getIdTokenResult();
      console.log(claims.role);
      if (claims.role == "ADMIN") {
        if (!route.path.startsWith("/admin")) redirect("/admin/employee");
      } else if (claims.role == "SECRETARY") {
        if (!route.path.startsWith("/secretary"))
          redirect("/secretary/attendance");
      } else if (!route.path.startsWith("/employee")) {
        redirect("/employee/dashboard");
      }
      const idToken = await $fire.auth.currentUser.getIdToken(true);
      store.commit("SET_TOKEN", idToken);
      $axios.setToken(idToken, "Bearer");
      // }else {
      //   redirect("/")
      // }
    }
  });
}
