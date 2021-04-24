import React,{useState,useEffect} from 'react'
import Axios from 'axios'


function SideVideo() {
    
    
    const [sideVideos, setsideVideos] = useState([])
    
    
    useEffect(() => {

        Axios.get('/api/video/getVideo')
        .then(response =>{
            if(response.data.success){
                console.log(response.data)
                setsideVideos(response.data.video)
            }else{
                alert('Fail to get video')
            }
        })
      
    }, [])

    
        
    const renderSideVideo = sideVideos.map((video,index) => {

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);


        return <div key={index} style={{display:'flex',marginBottom:'1rem', padding:'3rem 2rem'}}>
        <div style={{width:'40%',marginRight:'1rem'}}>
        <a href={`${video._id}`} style={{color:'blue'}} >
            <img style={{width:'100%', height:'100%'}} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail"/>
        </a>
        </div>
        
        <div style={{width:'50%'}}>
            <a href={`${video._id}`} style={{color:'gray'}}>
                <span style={{fontSize:'1rem', color:'black'}}>{video.title}</span><br />
                <span>{video.writer.name}</span><br />
                <span>{video.views} view</span><br />
                <span>runtime [{minutes} : {seconds}]</span>
            </a>
        </div>
    </div>
    })
    
    return (

        <React.Fragment>
          {renderSideVideo}
        </React.Fragment>
      
    )
}

export default SideVideo