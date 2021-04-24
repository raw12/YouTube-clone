import React,{useEffect,useState} from 'react'
import {Tooltip} from 'antd';
import Icon from "@ant-design/icons"
import Axios from 'axios';

function LikeDisLike(props) {


    let variable = {}

    if(props.video){
        variable = {videoId:props.videoId, userId:props.userId}   // come from VideoDetail
    } else {
        variable = {commentId:props.commentId, userId:props.userId}   // comes from singlecomments
    }

    const [Likes, setLikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [Dislikes, setDislikes] = useState(0)
    const [DislikeAction, setDislikeAction] = useState(null)
  

    useEffect(() => {

        Axios.post('/api/like/getLikes',variable)
            .then(response => {
                if(response.data.success){
                    // how many time get like 
                    setLikes(response.data.like.length)
                    // Whether I click like button
                    response.data.like.map(like => {
                        if(like.userId === props.userId){
                            setLikeAction('liked')
                        }
                    }) 
                }else{
                    alert('fail to get Like information')
                }
            })



        Axios.post('/api/like/getDislikes',variable)
        .then(response => {
            if(response.data.success){
                setDislikes(response.data.dislike.length)
                response.data.dislike.map(dislike => {
                    if(dislike.userId === props.userId){
                        setDislikeAction('disliked')
                    }
                }) 
            }else{
                alert('fail to get dislike information')
            }
        })
     
    }, [])


    const onLike = () => { 
        if(LikeAction === null){
         // null mean wasn't clicked
        Axios.post('/api/like/uplike',variable)
            .then(response => {
                if(response.data.success){
                    setLikes(Likes + 1)
                    setLikeAction('liked')

                    if(DislikeAction !== null){
                        setDislikeAction(null)
                        setDislikes(Dislikes-1)
                    }
                }else{
                    alert('fail to uplike')
                }
            })
        } else { 
            Axios.post('/api/like/unlike',variable)
            .then(response => {
                if(response.data.success){
                    setLikeAction(null)
                    setLikes(Likes-1)
                }else{
                    alert('fail to unlike')
                }
            })
        }
      
    }



    const onDislike = () => {

        if (DislikeAction !== null) {
            Axios.post('/api/like/unDisLike', variable)
                .then(response => {
                    if (response.data.success) {
                        setDislikes(Dislikes - 1)
                        setDislikeAction(null)
                    } else {
                        alert('Failed to decrease dislike')
                    }
                })

        } else {

            Axios.post('/api/like/upDisLike', variable)
                .then(response => {
                    if (response.data.success) {

                        setDislikes(Dislikes + 1)
                        setDislikeAction('disliked')

                        //If dislike button is already clicked
                        if(LikeAction !== null ) {
                            setLikeAction(null)
                            setLikes(Likes - 1)
                        }
                    } else {
                        alert('Failed to increase dislike')
                    }
                })


        }


    }
  
  
    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like"
                        theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                        onClick={onLike}
                         />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Likes} </span>
            </span>

            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon
                        type="dislike"
                        theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
                        onClick={onDislike}
                    />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Dislikes} </span>
            </span>
        </div>
    )
}

export default LikeDisLike