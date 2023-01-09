export default function ({ app, route, store, redirect, $fire }) {
  return $fire.auth.onAuthStateChanged(async (user) => {
    console.log("route", route.path);
    if (user) {
      const { claims } = await user.getIdTokenResult();
      if (claims.role == "ADMIN") {
        redirect("/admin/employee");
      } else if (claims.role == "SECRETARY") {
        redirect("/secretary/attendance");
      } else {
        redirect("/employee/dashboard");
      }
    }
  });
}
