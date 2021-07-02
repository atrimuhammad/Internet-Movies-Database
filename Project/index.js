const fs=require("fs")
const Express = require('express')
const app = Express()
// var publicDir = require('path').join(__dirname,'/imgs');
app.use(Express.static('imgs'));

app.use(Express.urlencoded({extended: true}));
app.use(Express.json())

const http=require('http')
const path=require('path')
const port=process.env.PORT || 3000
const mongoose=require('mongoose');
const { db } = require('./User');
const { dbmovie }=require('./Movie');
const User = require('./User');
const Movie = require('./Movie');
const uri = "mongodb+srv://Zaid:Zaid123@cluster0.2evtr.mongodb.net/signuptable?retryWrites=true&w=majority";
mongoose.connect(uri,{useNewUrlParser:true,useUnifiedTopology:true})
.then(result=>{
    console.log("Connected To DB")
})

  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'indexhtml'));
  });

  app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname, 'login.html'));
  });
  app.get('/signup', function(req, res) {
    res.sendFile(path.join(__dirname, 'signup.html'));
  });

  app.get('/searchmovie', function(req, res) {
    res.sendFile(path.join(__dirname, 'search.html'));
  });

  app.get('/upload',function(req,res){
    res.sendFile(path.join(__dirname,'upload.html'))
  });

  app.get('/dashboard',function(req,res){
  res.sendFile(path.join(__dirname,'dashboard.html'))
  });
  app.get('/adminpanel',function(req,res){
    res.sendFile(path.join(__dirname,'adminpanel.html'))
  });

  app.get('/details',function(req,res){
    res.sendFile(path.join(__dirname,'details.html'))
  });

  app.get('/imgs', function(req, res){
    var publicDir = require('path').join(__dirname,'/imgs');
    app.use(Express.static('imgs'));
    res.sendFile(path.join(__dirname, 'halloween-movies-1600459548.jpg'))
  });

  app.post('/details',function(req,res){

    db.collection('movies').find({ moviename: {$regex : ".*"+req.body.moviename+".*"}}).toArray(function(err, movie) {
      console.log('Movie Found!');

      if(err) {
        console.log('THIS IS ERROR RESPONSE')
        res.json(err)
      }
      if (movie){
        console.log('Found')
        console.log(movie)
        res.render('result2.pug', { moviename: movie[0].moviename, description: movie[0].description, rating: movie[0].rating, writer: movie[0].writer, director: movie[0].director, producer: movie[0].producer, cast: movie[0].cast});

      } else {
        console.log("Not Found");
        res.json({data: "Movie Not Found"});
      }
      res.end();
});
});

  app.post('/login',(req,res)=>{
      const user_login=new User();
      console.log("Email:- "+ req.body.email)
      console.log("Password:- "+ req.body.password)

      db.collection('users').findOne({ email: req.body.email}, function(err, user) {
        console.log('User found ');
        // In case the user not found
        if(err) {
          console.log('THIS IS ERROR RESPONSE')
          res.json(err)
        }
        if(user.email=="abc@gmail.com" && user.password=='zaid')
        {
          res.redirect('/adminpanel')
        }
        else{
          if (user && user.password ===req.body.password){
            console.log('User and password is correct')
            res.redirect('/dashboard')
          } else {
            console.log("Credentials wrong");
            res.json({data: "Login invalid"});
          }
        }
        res.end();
 });
  })

  app.post('/signup',(req,res)=>{
      var mfirstname=req.body.firstname
      var mlastname=req.body.lastname
      var memail=req.body.email
      var mpassword=req.body.password
      const newusertable=new User({
            firstname:mfirstname,
            lastname:mlastname,
            email:memail,
            password:mpassword
      });
      newusertable.save().then(()=>{
        res.send("Sign Up Successful")
      }).catch(()=>{
          res.send("Database Not Updated, Please Avoid Any Duplicate Entry")
      })

    })
  app.post('/delete',(req,res)=> {
      var memail=req.body.email
      var mpassword=req.body.email
      const user_delete=new User({
          email:memail,
          password:mpassword
      })
      db.collection('users').deleteOne({ email: user_delete.email}, function(err, user) {
        console.log('User Found And Removed From Database');
        res.send("User Removed From Database")
        // In case the user not found
        if(err) {
          console.log('THIS IS ERROR RESPONSE')
          res.json(err)
        }
    })
});

app.post('/uploadmovie', (req, res)=> {
  var mmoviename = req.body.moviename
  var mimage=req.body.movieimage
  var mdescription = req.body.description
  var mrating = req.body.rating
  var mwriter = req.body.writer
  var mdirector = req.body.director
  var mproducer = req.body.producer
  var mcast = req.body.cast
  console.log(mmoviename)
  const newmovie=new Movie({
    moviename:mmoviename,
    movieimage:mimage,
    description:mdescription,
    rating:mrating,
    writer:mwriter,
    director:mdirector,
    producer:mproducer,
    cast:mcast
  })


newmovie.save().then(()=>{
  res.send("Movie Added Sucessfully")
}).catch(()=>{
    res.send("Database Not Updated, Please Avoid Any Duplicate Entry")
})
});



app.post('/searchmovie', (req, res)=> {
  const movie_search=new Movie();
      console.log("Movie: "+ req.body.moviename)

      db.collection('movies').find({ moviename: {$regex : ".*"+req.body.moviename+".*"}}).toArray(function(err, movie) {
        console.log('Movie Found!');

        if(err) {
          console.log('THIS IS ERROR RESPONSE')
          res.json(err)
        }
        if (movie){
          console.log('Found')
          console.log(movie)
          console.log(movie.length)
          for (var i = 0; i < movie.length; i++) {
            res.render('result.pug', { name: movie[i].moviename, desc: movie[i].description, rate: movie[i].rating, write: movie[i].writer, direct: movie[i].director, prod: movie[i].producer, cas: movie[i].cast});
          }
        } else {
          console.log("Not Found");
          res.json({data: "Movie Not Found"});
        }
        res.end();
 });
})


app.post("/upload", function (req, res) {
  const newmovieupload=new Movie({
  moviename:req.body.moviename,
  movieimage:req.body.movieimage,
  description:req.body.description,
  rating:req.body.rating,
  writer:req.body.writer,
  director:req.body.director,
  producer:req.body.producer,
  cast:req.body.cast
});
newmovieupload.save().then(()=>{
  res.send("Movie Inserted Successful")
}).catch(()=>{
    res.send("Database Not Updated, Please Avoid Any Duplicate Entry")
})


})

app.listen(3000, () => console.log('listening on port 3000!'));
