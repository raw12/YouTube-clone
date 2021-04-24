import React , {useState , useEffect} from "react";
import { Form, Input, Button, Checkbox, message, Typography } from 'antd';
import {useSelector} from 'react-redux';
import { CaretDownFilled } from '@ant-design/icons';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { duration } from "moment";
const {Title} = Typography;
const {TextArea} = Input;


const PrivateOptions = [
    {value:0,label:"private"},
    {value:1,label:"public"} 
]


const CategoryOptions = [
    {value:0, label:"Film & Animation"},
    {value:1, label:"Autos & Vehicle"},
    {value:2, label:"Music"},
    {value:3, label:"Pets & Animals"}
]



function VideoUploadPage(props) {
    const user = useSelector(state => state.user);  // get user state by using redux 
    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)  // private = 0 , public = 1
    const [Category, setCategory] = useState("Film & Animation")  // private = 0 , public = 1
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")


    //=====OnChange function=====///
    const onTitleChange = (event) => { 
        //console.log(event.currentTarget)
        setVideoTitle(event.currentTarget.value)
    }

    
    const onDescriptionChange = (event) => { 
        //console.log(event.currentTarget)
        setDescription(event.currentTarget.value)
    }

    const onPrivateChange = (event) => { 
        //console.log(event.currentTarget)
        setPrivate(event.currentTarget.value)
    }

    const onCategoryChange = (event) => { 
        //console.log(event.currentTarget)
        setCategory(event.currentTarget.value)
    }

    const onDrop = (files) => {

        // following code is needed to send file to backend in order to avoid error
        let formData = new FormData();
        const config = { 
            header : {'content-type' : 'multipart/form-data'}
        }
        formData.append("file",files[0])  // get first file = get only one file 
        console.log(files)

        Axios.post('/api/video/uploadfiles',formData,config)
            .then(response => {
                if(response.data.success){
                    console.log(response.data)
                    setFilePath(response.data.url)

                    let variable = { 
                        url: response.data.url,
                        fileName: response.data.fileName
                    }

                    Axios.post('/api/video/thumbnail',variable)
                        .then(response => {
                            if(response.data.success){
                                console.log(response.data)
                                setDuration(response.data.fileDuration)
                                setThumbnailPath(response.data.url)
                            }else { 
                                alert('Fail to create thumbnail')
                            }
                        })
                }
                
                else {
                    alert('Failed to upload video')
                }
            })

    }
    // reference : https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget


    const onSubmit = (event) => { 
        event.preventDefault();
        // refresh(default setting) prevent 

        if(user.userData && !user.userData.isAuth) {
            return alert('Please Log in First');
        }

        if( VideoTitle === "" || Description === "" ||
           Category === "" || FilePath === "" ||
           Duration === "" || ThumbnailPath === ""){
               return alert('Please first fill all the boxes');
           }

        const variable = {
            writer: user.userData._id,
            title:VideoTitle,
            description : Description,
            privacy : Private,
            filePath: FilePath,
            category :Category,
            duration :Duration,
            thumbnail :ThumbnailPath,
        }
        Axios.post('/api/video/uploadVideo',variable)
            .then(response => {
                if(response.data.success){
                    message.success("successfully upload video")
                    setTimeout(() =>{
                        props.history.push('/')
                    },3000)
                }else{
                    alert('Fail to submit')
                }
            })
    }

    return (
        <div style={{maxWidth:'700px',margin:'2rem auto'}}>
            <div style={{ textAlign:'center',marginBottom:'2rem'}}>
                <Title level={2}>Upload video</Title>
            </div>


            <Form onSubmit={onSubmit}>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    {/*Drop zone , multiple = number of upload file in one time*/}

                    <Dropzone
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={10000000000}>
                        {({ getRootProps, getInputProps }) => (
                            <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                {...getRootProps()}>
                        
                                <input {...getInputProps()} />
                                <CaretDownFilled  type="plus" style={{ fontSize: '3rem' }} />

                            </div>
                        )}
                    </Dropzone>
                    {/* Thumbnail */}
                    {ThumbnailPath && 
                        <div>
                            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail"/>
                        </div>
                    }
                
                </div>

                <br />
                <br />
                <label>Title</label>
                <Input 
                
                    onChange={onTitleChange}
                    value = {VideoTitle}
                
                />
                <br />
                <br />
                <label>Description</label>

                <TextArea
                    onChange={onDescriptionChange}
                    value = {Description}
                />
                <br />
                <br />

                <select onChange={onPrivateChange}>
                    {PrivateOptions.map((item,index) => (
                    <option key={index} value={item.value}>{item.label}</option>
                    ))}

                </select>
                <br />
                <br />

                <select onChange={onCategoryChange}>
                    {CategoryOptions.map((options,index) =>(
                         <option key={index} value={options.value}>{options.label}</option>
                    ))}
                </select>
                <br />
                <br />

                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>

            </Form>


        </div>
    )
}


export default VideoUploadPage;