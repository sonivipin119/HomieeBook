exports.error404 =(req, res, next) => {
  res.status(404).render('404',{
    pageTitle : "Error occurred",
    currentPage : '404',
    isLoggedIn : req.isLoggedIn,
    user : req.session.user,
  });
}
exports.error500 = (err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).render("500", {
    pageTitle: "Error!",
    isLoggedIn: req.isLoggedIn || false,
    user: req.session ? req.session.user : null,
  });
};

