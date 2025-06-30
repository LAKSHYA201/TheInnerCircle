const bcrypt=require("bcryptjs");
const pool=require('./models/pool');
const path=require("node:path");
const express=require("express");
const { body, validationResult } = require("express-validator");
const session = require("express-session");
const passport=require("passport");
const LocalStrategy = require('passport-local').Strategy;
const controllers= require('./controllers/main')
const app=express();
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({secret:"topSecret",resave:false,saveUninitialized:false}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(async(username,password,done)=>{
    try{
         const{rows}=await pool.query("SELECT * FROM users WHERE username=$1",[username]);
         const user = rows[0];
         if(!user){
            return done(null,false,{message:"Incorrect username"});
         }
         const match=await bcrypt.compare(password,user.password);
         if(!match){
            return done(null,false,{message:"incorrect password"});
         }
         return done(null,user);
    }catch(err){
        return done(err);
    }
}));
passport.serializeUser((user,done)=>{
    done(null,user.id);
});
passport.deserializeUser(async(id,done)=>{
    try{
        const{rows}=await pool.query("SELECT * FROM users WHERE id = $1",[id]);
        const user=rows[0];
        done(null,user);
    }catch(err){
        done(err);
    }
});
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user; 
  next();
});
app.use(express.urlencoded({ extended: true }));

app.get("/",async(req,res)=>{
   const {rows} = await pool.query("SELECT messages.id, messages.title, messages.text, messages.timestamp, users.username, users.is_admin FROM messages JOIN users ON messages.user_id = users.id ORDER BY messages.timestamp DESC;")
     res.render("index",{isAuthenticated:req.isAuthenticated(),user:req.user,rows:rows});
})

app.get("/sign-up",(req,res)=>{
    res.render("sign-up");
})

app.post("/sign-up",[
    body('username').trim().escape().notEmpty().withMessage("username is required").isLength({min:3}).withMessage("Username must be at least 3 characters"),
    body('password').trim().escape().notEmpty().withMessage('Password must be at least 6 characters'),
],controllers.postSignUp);

app.get("/log-in",(req,res)=>{
    res.render("log-in");
})

app.post("/log-in",[
    body('username').trim().escape().notEmpty().withMessage("username is required").isLength({min:3}).withMessage("Username must be at least 3 characters"),
    body('password').trim().escape().notEmpty().withMessage('Password must be at least 6 characters'),
],controllers.postLogIn);

app.get("/log-out",controllers.getLogOut);

app.get("/create-message",(req,res)=>{
    res.render("create-message");
})

app.post("/create-message",[
    body('message').trim().escape().isLength({min:1}).withMessage('Message Cannot be empty'),
    body('message-title').trim().escape().isLength({min:1})
],
controllers.postMessage);

app.get("/elite-member",(req,res)=>{
    res.render("elite-member");
})
app.post("/elite-member",[
    body('passcode').trim().escape().isLength({min:1}).withMessage('Passcode Cannot be empty'),
],controllers.postEliteMember);

app.get('/delete-message/:id',controllers.getDeleteMessage);



app.listen(3000,()=>{
    console.log("App listening on port 3000");
})