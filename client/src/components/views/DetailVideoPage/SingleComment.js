import React,{useState} from 'react'
import {Comment, Avatar,Button,Input} from 'antd';
import Axios from 'axios';
import {useSelector} from 'react-redux'
import LikeDisLike from './LikeDisLike';
const {TextArea} = Input;

function SingleComment(props) {

    const user = useSelector(state => state.user)
    const [OpenReply, setOpenReply] = useState(false)  // true false = > &&   , null / notnull => ? 
    const [commentValue, setcommentValue] = useState("")
    
    const onClickReplayOpen = () => {
        setOpenReply(!OpenReply)
    }
   
    const actions = [
        <LikeDisLike userId={localStorage.getItem("userId")} commentId={props.comment._id} />,
        <span onClick={onClickReplayOpen} key="comment-basic-reply-to">Reply to</span>
    ]

    const handleClick = (event) => {
        setcommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => { 
        event.preventDefault();
        // refresh(default) prevent

        const variable = {
            content : commentValue,
            writer : user.userData._id, 
            videoId : props.videoId,
            responseTo : props.comment._id
        }

        Axios.post('/api/comments/saveComment',variable)
            .then(response => {
                if(response.data.success){
                    setcommentValue("")
                    setOpenReply(!OpenReply) // or setOpenReply(false)
                    props.refreshfunction(response.data.result)
                }else{
                    alert('Faild to submit')
                }
            })
    }

     return (
        <div>
            {console.log(props.comment)}
            <Comment
                actions={actions}
                author={props.comment._id.name}
                avatar={<Avatar
                        src={props.comment._id.image}
                        alt="image"/>}
                content={<p> {props.comment.content}</p>}
            />
            
        {OpenReply && 
            <form onSubmit={onSubmit}>
            <TextArea 
                style={{ width: '100%', borderRadius:'5px'}}
                onChange={handleClick}
                value={commentValue}
                placeholder="write your comment"
                rows={4} 
            />
            <br/>
            <Button style={{ width:'10%', height:'35px',marginTop:'0.5rem',
                             backgroundColor:'#1890ff',color:'white',fontSize:'16px'}} onClick={onSubmit}>Submit</Button>            
             <br/><br/><br/><br/>                 
            </form>
        }
        </div>
    )
}

export default SingleComment