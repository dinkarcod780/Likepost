var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer')
const userModel = require("../models/userSchema")
const passport = require("passport");

const postModel = require("../models/postSchema.js")

const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(userModel.authenticate()))
const upload = require("../utils/multer").single("view")
// const fs = require("fs");
// const path =require("path")
// const nodemailer = require("../utils/nodemaile");
// const sendMail = require('../utils/nodemaile');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/register", (req, res, next) => {
  res.render("register")
})

router.post("/register", upload, async (req, res, next) => {
  try {
    const profileimage = req.file.filename
    const { name, username, email, password } = req.body
    await userModel.register({ name, username, email, profileimage }, password)
    res.redirect("/login")
  } catch (error) {
    res.send(error)
  }
})

router.get("/login", (req, res, next) => {
  res.render("login")
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login"
}))

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/login")
}


router.get("/profile", isLoggedIn, (req, res, next) => {
  res.render("profile", { user: req.user })
})

router.get("/logout", (req, res, next) => {
  req.logout(function (error) {
    if (error) {
      return next(error)
    }
  })
  res.redirect("/login")
})

router.get("/post", isLoggedIn, (req, res, next) => {
  res.render("post")
});

router.post("/post", isLoggedIn, async (req, res, next) => {
  const loggedUser = await userModel.findOne({ username: req.session.passport.user })
  // console.log(loggedUser);
  const post = await postModel.create({
    title: req.body.title,
    caption: req.body.caption
  })
  post.user = loggedUser._id
  loggedUser.posts.push(post._id)
  await post.save()
  await loggedUser.save()
  // res.json(post)
  res.redirect("/feed")
})

router.get("/feed", isLoggedIn, async (req, res, next) => {
  const posts = await postModel.find().populate("user")
  //  res.send(posts)
  res.render("feed", { posts })
});

router.get("/like/:id", isLoggedIn, async (req, res, next) => {
  console.log(req.params.id);
  const post = await postModel.findOne({ _id: req.params.id }).populate("user")

console.log(post);


  if (post.likes.includes(req.user._id)) {
    // console.log("like kar chika hia");
    await post.likes.remove(req.user._id)
  } else {
    // console.log("like karnahia");
    await post.likes.push(req.user._id)
    await post.save()
    const transport = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        user: "dinkardiwakar0@gmail.com",
        pass: "qtwf fgzp ghks bkjd",
      }
    })
    const mailOptions = {
      from: 'instagram',
      to: post.user.email,
      subject: "soemone like your post",
      text: "someoen liked you post",
      html: `<a href="/">home</a>`
    }

    transport.sendMail(mailOptions, (err, info) => {
      res.redirect('/')
    })
  }

  await post.save()

  // try{
  //   const {id} = req.params
  //   const post = await post.findById(id)
  //   const userId = await post.populate('createdBy')
  //   if(!post.likes.includes(req.user._id)){
  //     await post.likes.push(req.user._id)
  //     req.user.likedPosts.push(id)
  //     sendmail(res,userId)
  //   }else{
  //     const idx =await post.likes.indexOf(req.user._id)
  //     post.likes.splice(idx,1)
  //     const idx2 =await req.user.liked.indexOf(id)
  //     req.user.likedPosts.splice(idx2,1)
  //   }

  //   req.user.save()
  //   post.save()

  //   res.redirect('/')
  // }catch(err){
  //   res.send(err)
  // }
})



module.exports = router;
