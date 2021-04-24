import React,{useEffect,useState} from 'react'
import {Row,Col,Avatar , List} from 'antd';
import Axios from 'axios';
import SideVideo from './SideVideo';
import { UserOutlined } from '@ant-design/icons';
import Subscribe from './Subscriber';
import Comment from './Comment';
import LikeDisLike from './LikeDisLike';

function VideoDetailPage(props) {
    
    const videoId = props.match.params.videoId
    const variable = {videoId: videoId}
    const [CommentLists, setCommentLists] = useState([])
    const [VideoDetail, setVideoDetail] = useState([])

    useEffect(() => {
     
        Axios.post('/api/video/getVideoDetail',variable)
            .then(response => {
                if(response.data.success){
                    //console.log(response.data.videoDetail)
                    setVideoDetail(response.data.videoDetail)
                }else{
                    alert('Fail to get video from db')
                }
            })


        Axios.post('/api/comments/getComments',variable)
        .then(response => {
            if(response.data.success){
                setCommentLists(response.data.comments)
            }else { 
                alert('fail to get comment')
            }
        })

    }, [])


    const refreshfunction = (newComment) => {
        setCommentLists(CommentLists.concat(newComment))
    }

    // refreshfucntion helps to update comment and replycomment. 
    // you can see refreshfunction={refreshfunction} below which is the part of Comment component 
    // so we can call refreshfunction in Comment.js. 
    // In Comment.js axios.post we can see props.refreshfunction.(response.data.result)
    // so these data comes into this method and merge with CommentList (concat function) so that we can refresh the comment 
    // These method should be defined in Vedetailpage because VideoDetailpage is the parent component of single comment and comment 

    if (VideoDetail.writer) {
        console.log(VideoDetail)

        // const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id} userForm={localStorage.getItem('userId')}/>

        return (
            <Row>
                <Col lg={18} xs={24}>
                    <div className="postPage" style={{ width: '100%', padding: '3rem 4em' }}>
                        <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls></video>

                        <List.Item >
                            <List.Item.Meta
                                avatar={
                                <Avatar style={{backgroundColor: '#87d068'}}
                                        icon={<UserOutlined />}
                                        src={VideoDetail.writer && VideoDetail.writer.image} 
                                        />
                                    }
                                title={<a href="https://ant.design">Title : {VideoDetail.title}</a>}
                                description={<a href="https://ant.design"> Description : {VideoDetail.description}</a>}
                            />
                            <div></div>
                        </List.Item>

                        {/*Comment */}                  
                        <Comment refreshfunction={refreshfunction} CommentLists={CommentLists} videoId={videoId}/>

                    </div>
                </Col>
                <Col lg={6} xs={24}>
                    <SideVideo />

                </Col>
            </Row>
        )

    } else {
        return (
            <div>Loading...</div>
        )
    }
}

export default VideoDetailPage;