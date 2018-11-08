
///////////////web server project=>template-ing engine which let you render html in dinamic way,where you can inject values //////////////
//handlerbars view engine for express: handlebarsjs.com- npm hbs package
//npm install hbs@4.0.0 --save
//views folder is default folder for templates
const express=require('express');
const hbs=require('hbs');
const fs=require('fs');
//process.env - objekat koji cuva nase enviroment variable kao key-value parove
//heroku ce da postavi port,ali kada bi je pokrenuli lokalno ne bi bio definisan=>postavicemo default vrednost
const port=process.env.PORT || 3000;
//new express server app
var app= express();
//hbs.registerPartials-takes absolutpath folder where we put hbs partials files

hbs.registerPartials(__dirname +'\\views\\partials');

//nodemon will not watch hbs files =>nodemon server.js -e js,hbs
//-e :alows us to specify all extensions we want to watch

app.set('view engine','hbs')


//next-exists so you can tell express when your middleware function is done, this is useful because you can have as much middleware as you like registered with a single express app
//we use next to tell express when we are done
//so if we do something asynhronice,the middleware is not going to move on until we call next(); app can continue to run
//this means that if midleware doesnt call next handlers(app.get...) for each request never going to fire
//if we try to access to localhost:3000 the page will never return

//we will make log history with timestamp
app.use((req,res,next)=>{
  var now=new Date().toString();
  console.log(`${now}: ${req.method} ${req.url}`);
  var log=`${now}: ${req.method} ${req.url}`;
  fs.appendFile('server.log',log+'\n',(err)=>{if(err){ console.log('Unable to append to server.log');}});
  next();
});

// app.use((req,res,next)=>{
//   res.render('maintenance.hbs');
// });
app.use(express.static(__dirname+'\\public'));

//fja koja moze da se poziva unutar handlebar templejta
hbs.registerHelper('getCurrentYear',()=>{ return new Date().getFullYear();});
hbs.registerHelper('screamIt',(text)=>{  return text.toUpperCase(); });

//res.render-let us to render any of templates we set up with our current view engine
//1 argument:template, 2 argument:object
app.get('/about',(req,res)=>{
  res.render('about.hbs',{
  pageTitle:'About page',
});
});
app.get('/', (req,res)=>{
  res.render('home.hbs',{
  pageTitle:'Home page',
  welcomeMesage: ':) Welcome :)'
  });
  });
app.get('/projects',(req,res)=>{
  res.render('projects.hbs',{
    pageTitle:'Projects page'
  })
});

//app.listen-server starts listening, binds app to port of machine and waits for requests
//app.listen takes second opcional argument-function which will run when server is up

//heroku will tell your app which port to use,because that port will change as you deploy your app which means we will use an enviorment variable
//with enviroment variables heroku can set a variable on operating system,node app can read that variable and use it as a port
//we can see our enviroment variables with set comand on windows
app.listen(port,()=>{
  console.log(`Server is up on port ${port}.`);
});
