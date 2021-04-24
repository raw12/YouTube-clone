const { Router } = require('express');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { auth } = require("../middleware/auth");
const { User } = require("../models/User");
var ffmpeg = require("fluent-ffmpeg");
const { Video } =require("../models/Video");
const { Subscriber } = require("../models/Subscriber")


// storage multer config
let storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,"uploads/");
    },
    // where to save the video file

    filename: (req,file,cb) =>{
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    // get filename
    filefilter: (req,file,cb) => {
        const text = path.extname(file.originalname)
        if(ext != '.mp4'){   
            return cb(res.status(400).end('only mp4 is allowed'),false);
        }
        // filefiltering : only mp4 type 
        // ext != '.mp4' || ext != '.png'
        cb(null,true)
    }
});

const upload = multer({storage : storage}).single("file")


router.post('/uploadfiles', (req,res) => {

    // save video in server
    upload(req,res,err => { 
        if(err){
            return res.json({success:false,err})
        }
        return res.json({success:true, url:res.req.file.path, fileName:res.req.file.filename})
        // url : file path
    })
})



router.post('/thumbnail', (req,res) => {

    let filePath = ""
    let fileDuration = ""


    // get video information 
    ffmpeg.ffprobe(req.body.url, function(err,metadata){ 
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration
    });

   // create thumbnail
   ffmpeg(req.body.url)   // req.body.url = save path of video 
   .on('filenames',function (filenames) { 
       // create thumbnail file name
       console.log('Will generate ' + filenames.join(', '))
       console.log(filenames)
       filePath = "uploads/thumbnails/" + filenames[0]
   })
   // Attach an event handler function for one or more events to the selected elements.
   .on('end', function() { 
       // action after crate thumbnail 
       console.log('Screenshots taken')
       return res.json({success:true,url:filePath,fileDuration:fileDuration});
   })
   .on('error', function(err) { 
       // handling error while create thumbnail 
       console.log(err)
       return res.json({success:false,err});
   })
   .screenshot({
       // will take screenshots at 20%,40%,60% and 80% of the video
       count : 3,
       folder : 'uploads/thumbnails',
       size : '300x240',
       //'%b' : input basename (filename w/o extension)
       filename : 'thumbnail-%b.png'
   })
   
})


router.post('/uploadVideo', (req,res) => {
   // save video information 
   const video = new Video(req.body)
   // req.body = all variables which is delivery from client (writer,title,description,.......)
   video.save((err,doc) => {
       if(err)
       return res.status(400).json({success:false,err})
       res.status(200).json({success:true,doc})
   })
})

router.get('/getVideo', (req,res) => {
   
    // get video from DB
    Video.find()
        .populate('writer')
        // this fucntion work following
        // 1.get Vidoe data from /models/Video
        // 2.get writer -> User -> /models/User.js
        // 3.get all information of user from User.js
        // in this case .populate is needed to get User.js, if not then can get only writer Id
        .exec((err,video) =>{
            if(err) return res.status(400).send(err)
            return res.status(200).json({success:true,video})
        })

 })

 router.post('/getVideoDetail', (req,res) => {
    
    Video.findOne( {"_id" : req.body.videoId})
        .populate('writer')
        .exec((err,videoDetail) => {
            if(err) return res.status(400).send(err)
            return res.status(200).json({success:true,videoDetail})
        })
  
 })

 router.post('/getSubscriptionVideos', (req,res) => {

    // By using my id(userId from localstorage get subscribedUser)
    Subscriber.find({userForm : req.body.userForm})
        .exec((err,subscriberInfo) => {
            if(err) return res.status(400).send(err);

            // In subscribeInfo we can find the subscribedUser information 
            // push this information inth array called subscribedUser
            let subscribedUser = [];

            subscriberInfo.map((subscriber, i) => {
                subscribedUser.push(subscriber.userTo);
            })

            // get this subscribedUser 
            Video.find({ writer : { $in: subscribedUser } })
            // {writer : {req.body._id} } is wriong  (only for one)
            // because subscribedUser can be more than one.(It mean more than one userForm subscribe userTo)
            // $in can get more than one information 
                .populate('writer')
                .exec((err,Videos) => {
                    if(err) return res.status(400).send(err)
                    return res.status(200).json({success:true,Videos})
                })
        })
 })

module.exports = router;
