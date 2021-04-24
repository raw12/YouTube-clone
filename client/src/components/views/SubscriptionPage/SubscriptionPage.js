import React,{useEffect, useState} from 'react'
import {Card, Avatar,Col,Typography,Row} from 'antd';
import Axios from 'axios';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment'
const {Title} = Typography;
const {Meta} = Card;

function SubscriptionPage() {

    const [Video, setVideo] = useState([])


    useEffect(() => {

        const subscriptionVariables ={ 
            userForm : localStorage.getItem("userId")
        }

        Axios.post('/api/video/getSubscriptionVideos',subscriptionVariables)
        .then(response =>{
            if(response.data.success){
                console.log(response.data)
                setVideo(response.data.Videos)
            }else{
                alert('Fail to get video')
            }
        })
      
    }, [])


    const renderCards = Video.map((video, index) => {

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);
        // defautl value of duration is second

        return <Col lg={6} md={8} xs={24}>
            <div key={index} style={{ position: 'relative' }}>
                <a href={`/video/${video._id}`} >
                <img style={{ width: '100%' }} alt="thumbnail" src={`http://localhost:5000/${video.thumbnail}`} />
                <div className=" duration"
                    style={{ bottom: 0, right:0, position: 'absolute', margin: '4px', 
                    color: '#fff', backgroundColor: 'rgba(17, 17, 17, 0.8)', opacity: 0.8, 
                    padding: '2px 4px', borderRadius:'2px', letterSpacing:'0.5px', fontSize:'12px',
                    fontWeight:'500', lineHeight:'12px' }}>
                    <span>{minutes} : {seconds}</span>
                </div>
                </a>
            </div><br />
            <Meta
                avatar={
                    <Avatar 
                    style={{backgroundColor: '#87d068'}}
                    icon={<UserOutlined />}
                    src={video.writer.image} />
                }
                title={video.title}
            />
            <span>{video.writer.name} </span><br />
            <span style={{ marginLeft: '3rem' }}> {video.views}</span>
            - <span> {moment(video.createdAt).format("MMM Do YY")} </span>
        </Col>
        

    })

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2} > My Subscription </Title>
            <hr />

            <Row gutter={[16,16]}>
                {renderCards}
            </Row>
        </div>
    )
}

export default SubscriptionPage