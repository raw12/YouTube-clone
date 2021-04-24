const express = require('express');
const router = express.Router();
const { Like } = require("../models/Like")
const { Dislike } = require("../models/Dislike")


router.post('/getLikes' ,(req,res) => {

    let variable = {}
    if(req.body.videoId){
        variable = {videoId : req.body.videoId}
    } else {
        variable = {commentId : req.body.commentId}
    }
    
    Like.find(variable)
        .exec((err,like) => {
            if(err) return res.status(400).send(err)
            return res.status(200).json({success:true,like})
        })
})


router.post('/getDislikes' ,(req,res) => {

    let variable = {}
    if(req.body.videoId){
        variable = {videoId : req.body.videoId}
    } else {
        variable = {commentId : req.body.commentId}
    }
    
    Dislike.find(variable)
        .exec((err,dislike) => {
            if(err) return res.status(400).send(err)
            return res.status(200).json({success:true,dislike})
        })
})


router.post('/uplike' ,(req,res) => {

    let variable = {}
    if(req.body.videoId){
        variable = {videoId : req.body.videoId, userId:req.body.userId}
    } else {
        variable = {commentId : req.body.commentId,userId:req.body.userId}
    }
    

    // save click information into Like collection  

    const like = new Like(variable)
    like.save((err,likeResult) => {
        if(err) return res.status(400).json({success:false,err})
    })

    // if dislike button is already clicked then dislike -1 
    Dislike.findOneAndDelete(variable)
        .exec((err,dislikeResult) => {
            if(err) res.status(400).json({success:false,err})
            return res.status(200).json({success:true,dislikeResult})
        })   
})




router.post('/unlike' ,(req,res) => {

    let variable = {}
    if(req.body.videoId){
        variable = {videoId : req.body.videoId,userId:req.body.userId}
    } else {
        variable = {commentId : req.body.commentId,userId:req.body.userId}
    }

    Like.findOneAndDelete(variable)
        .exec((err,result) => {
            if(err) res.status(400).json({success:false,err})
            return res.status(200).json({success:true,result})
        }) 
})



router.post('/updislike' ,(req,res) => {

    let variable = {}
    if(req.body.videoId){
        variable = {videoId : req.body.videoId,userId:req.body.userId}
    } else {
        variable = {commentId : req.body.commentId,userId:req.body.userId}
    }
    
    // save click information into Dislike collection  
    const dislike = new Dislike(variable)
    dislike.save((err,dislikeResult) => {
        if(err) return res.status(400).json({success:false,err})

    })
    
    // if like button is already clicked then like -1
    Like.findOneAndDelete(variable)
        .exec((err,likeResult) => {
            if(err) return res.status(400).json({success:false,err})
            return res.status(200).json({success:true,likeResult})
        }) 
})


router.post('/undislike' ,(req,res) => {

    let variable = {}
    if(req.body.videoId){
        variable = {videoId : req.body.videoId,userId:req.body.userId}
    } else {
        variable = {commentId : req.body.commentId,userId:req.body.userId}
    }
    
    Dislike.findOneAndDelete(variable)
        .exec((err,result) => {
            if(err) return res.status(400).json({success:false,err})
            return res.status(200).json({success:true,result})
        }) 



})




module.exports = router;