import React, { useState,useEffect } from 'react'
import SingleComment from './SingleComment';

function ReplyComment(props) {

    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComments] = useState(false)
    useEffect(() => {
        
    
        let commentNumber = 0;

        props.CommentLists.map((comment) => {
            if( comment.responseTo === props.parentCommentId ) {
                commentNumber ++
            }
        })
        setChildCommentNumber(commentNumber)

    }, [props.CommentLists])
    // Reason to add props.CommentList in [] = recompile when props.CommentList is changed = if user reply to the comment , then the commentList is changed 
    // useEffect show the explicit component again

    const renderReplyComment = (parentCommentId) => 
        props.CommentLists.map((comment,index) => (
            <React.Fragment>
            {
                comment.responseTo === props.parentCommentId && 
                <div style={{width:'80%',marginLeft:'40px'}}>
                  <SingleComment refreshfunction={props.refreshfunction} comment={comment} key={index} videoId={props.videoId}/>
                  <ReplyComment refreshfunction={props.refreshfunction} CommentLists={props.CommentLists} parentCommentId={comment._id} videoId={props.videoId} />
                </div>
            }
        </React.Fragment>
        ))

        const onHandleChange = () => {
            setOpenReplyComments(!OpenReplyComments)    
        }

    return (
        <div>
            {ChildCommentNumber > 0 &&
               <p style={{fontSize:'14px', margin:0,color:'gray'}} onClick={onHandleChange}>
                  View {ChildCommentNumber} more comment(s)
               </p>
            }

            {OpenReplyComments && 
                renderReplyComment(props.parentCommentId)
            }
            
        </div>
    )
}

export default ReplyComment