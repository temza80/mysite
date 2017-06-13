exports.post=function()
{
  var redirect=req.session.beforeLogin;
  req.session.destroy();
  res.redirect(redirect);
};