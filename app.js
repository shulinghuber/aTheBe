const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');



mongoose.connect('mongodb://localhost/nodekb',{ useNewUrlParser: true });
let db =  mongoose.connection;

// check connection
db.once('open', () => console.log('Connected to MongoDB'));
// check for db errors
db.on('error', (err) => console.log(err));
// Init App
const app = express();
const port = 3000;
let Article = require('./models/article');

// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// public folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Message Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Home Route
app.get('/', (req, res) => {
  Article.find({}, (err, articles) => {
    if(err){
      console.log(err);
    }
    else{
      res.render('index', {
        title:'Articles',
        articles: articles
      });
    }    
  });  
});

let articles = require('./routes/articles');
app.use('/articles', articles);

// Start
app.listen(port, () => console.log(`Example app listening on port ${port}!`));