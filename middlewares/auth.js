export function requireStudent(req, res, next) {
  if (!req.session.user) return res.redirect("/users/login");
  if (req.session.user.role !== "student") return res.redirect("/users/login");
  next();
}

export function requireAdmin(req, res, next) {
  if (!req.session.user) return res.redirect("/users/login");
  if (req.session.user.role !== "admin") return res.redirect("/users/login");
  next();
}
