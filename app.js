const express = require('express');
const PORT = process.env.PORT || 3000;
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyparser = require('body-parser');

const sequelize = require('./api/util/database');

const {get404} = require('./api/controller/404');
const blogRoutes = require('./api/routes/blog');
const productRoutes = require('./api/routes/product');


//flash message
const flash = require('connect-flash');
const session = require('express-session');


const app = express();
//PASSPORT CONFIG
require('./api/config/passport')(passport);

//db config
// const db = require('./api/config/keys').MongoURI;
// mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
//     .then(()=>{
//         console.log('MongoDb Connected');
//     })
//     .catch(err =>{
//         console.log(err);
//     });



//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
//try

//bodyparser
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json({}));

//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

  //PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global vars
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})




//routes
//users
app.use('/', require('./api/routes/index'));
app.use('/users', require('./api/routes/users'));

app.use(require('./api/routes/send'));


//posting a new blog
app.use('/blogs', blogRoutes);

//posting product
app.use('/products', productRoutes);


//error code
app.use(get404);

sequelize
.sync()

.then((result) =>{
    // console.log(result);
    app.listen(PORT, console.log(`Server Started on Port ${PORT}`));
    console.log('MySql Server Connected')
})

.catch((err) => {
    console.log(err);
})


//degozo