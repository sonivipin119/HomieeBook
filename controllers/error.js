exports.error404 =(req, res, next) => {
  res.status(404).render('404',{
    pageTitle : "Error occurred",
    currentPage : '404',
    isLoggedIn : req.isLoggedIn,
    user : req.session.user,
  });
}
exports.error500 = (err, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Server Error",
    currentPage: '500',
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};