const db=require('../models/db');
const passport=require('passport');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

async function postSignUp(req,res){
    const errors=validationResult(req);
    if(!errors.isEmpty()){ return res.render("sign-up")};
    const {username,password,admin_rights}=req.body;
    const isAdmin= req.body.admin_rights==="on";
    try{
        const hashedPassword = await bcrypt.hash(password,10);
        await db.insertJoineeDetails(username,hashedPassword,isAdmin);
        return res.render("log-in");
    }catch(err){}
    res.render("sign-up");
}

async function postLogIn(req,res,next){
    const errors=validationResult(req);
    if(!errors.isEmpty()){return res.render("log-in")};
    const {username,password}=req.body;
    

    passport.authenticate("local", function (err, user, info) {
    if (err) return next(err); 
    if (!user) {
     
      return res.render("log-in", {
        errors: [{ msg: info.message }],
        oldData: req.body,
      });
    }

    req.logIn(user, function (err) {
      if (err) return next(err);
      return res.redirect("/"); 
    });

  })(req, res, next);
}

async function getLogOut(req,res,next){
    req.logout((err)=>{
        if(err){return next(err);}
        res.redirect("/")
    })
}

async function postMessage(req,res){
      if(!req.isAuthenticated()){
        return res.render("kindly-login");
      }
      await db.createMessage(req.body.message_title,req.body.message,req.user.id);
      res.redirect("/");
}

async function postEliteMember(req,res){
    if(req.body.passcode.toLowerCase()==="sword"){
        await db.changeMembershipStatus(req.user.id);
        res.send(`<h1>You have been Promoted to Elite Member Status, ${req.user.username}.<br>You now have access to usernames and timestamps<h1>&nbsp;&nbsp;&nbsp <h1><a href="/">Home</a></h1> `);
    }
}

async function getDeleteMessage(req,res){
    if(req.user && req.user.is_admin) {
        await db.deleteMessage(req.params.id);
       res.redirect("/");
    }
    else{
        res.send("<h1>Sorry! You don't have admin rights &nbsp;&nbsp;    <a href='/'>Home</a></h1>");
    }
    
}

module.exports={
    postSignUp,
    postLogIn,
    getLogOut,
    postMessage,
    postEliteMember,
    getDeleteMessage,
}