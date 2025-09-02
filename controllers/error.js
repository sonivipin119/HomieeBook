exports.error404 =(req, res, next) => {
  res.status(404).render('404',{
    pageTitle : "Error occurred",
    currentPage : '404',
    isLoggedIn : req.isLoggedIn,
    user : req.session.user,
  });
}
exports.error500 = (err, req, res, next) => {
  console.error("500 handler triggered:", err.message);
  res.status(500).rendre('500',{
    pageTitle : "Error occurred",
    currentPage : '500',
    isLoggedIn : req.isLoggedIn,
    user : req.session.user,
  });
};

