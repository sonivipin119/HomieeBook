
pageSearch =(req, res, next) =>{
  let city = req.query.Location;
  let homesfind = Homiregister.find().then((homes)=>{
    homes.location = req.query.city;
  });
  if(city===""){
    homesfind = Homiregister.find();
  }
  res.render("index",
    {
      title:'homepage',
      currrpage:'home',
      registerhomes : homesfind,
    }
  )
}