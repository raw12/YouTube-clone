import React, { useState } from 'react'
import {useSelector} from 'react-redux'
import { Button,Input } from 'antd'
import Axios from 'axios';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';
const {TextArea} = Input;

function Comment(props) {

    const user = useSelector(state => state.user)  
    const [commentvalue, setcommentvalue] = useState("")

      const handleClick = (event) => { 
        setcommentvalue(event.currentTarget.value)
    }

    const onSubmit = (event) => { 
        event.preventDefault();
        // refresh(default) prevent

        const variable = {
            content : commentvalue,
            writer : user.userData._id, // redux 
            // use localstorage => writer : localstorage.getItem("userId")  
            videoId : props.videoId  
            // get videoId from parant(VideoDetailPage)
            // If you try to get videoId directly from this part "get params undefined error"


        }

        Axios.post('/api/comments/saveComment',variable)
            .then(response => {
                if(response.data.success){
                    setcommentvalue("")
                    props.refreshfunction(response.data.result)
                }else{
                    alert('Faild to submit')
                }
            })
    }

    return (
        <div>
            <br /> 
            <p> Replies</p>
            <hr/>

             {/* Text box with submit */}
            <form onSubmit={onSubmit}>
            <TextArea 
                style={{ width: '100%', borderRadius:'5px'}}
                onChange={handleClick}
                value={commentvalue}
                placeholder="write your comment"
                rows={4} 
            />
            <br/>
            <Button style={{ width:'10%', height:'35px',marginTop:'0.5rem',
                             backgroundColor:'#1890ff',color:'white',fontSize:'16px'}} onClick={onSubmit}>Submit</Button>            
            <br/><br/><br/><br/>             
            </form>

            {/* Comment Lists*/}
            {console.log('comment list ' ,props.CommentLists)}
            
            {props.CommentLists && props.CommentLists.map((comment,index) => (
                (!comment.responseTo && 
                    <React.Fragment>
                         <SingleComment refreshfunction={props.refreshfunction} comment={comment} key={index} videoId={props.videoId}/>
                         <ReplyComment refreshfunction={props.refreshfunction} parentCommentId={comment._id} videoId={props.videoId}  CommentLists={props.CommentLists} />
                    </React.Fragment>
              // when user open the page they can see first singlecomment not replyed commment
              // if they click view replycomment then show comment on it 
              // so in the explict rendering we are trying to get only comment with non responseTo = !comment.responseTo 
                )))}
        </div>
    )
}

export default Comment