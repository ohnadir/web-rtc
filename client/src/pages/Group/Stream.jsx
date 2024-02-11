import React, { useCallback, useEffect, useState } from 'react';
import ReactPlayer from "react-player";
import { useParams, useLocation, useNavigate  } from 'react-router-dom';
import { useSocket } from "../../providers/Sockets";
import { usePeer } from "../../providers/Peer"



const Stream = () => {
    const socket = useSocket();
    const { peer   } = usePeer();
    const navigate = useNavigate();
    const location = useLocation();
    const { meetingID } = useParams();
    const queryParams = new URLSearchParams(location.search);
    const userName = queryParams.get('username');
    const [otherUser, setOtherUser] = useState([]);
    const [myStream, setMyStream] = useState();
    
    useEffect(()=>{
        if(userName===""){
            navigate(`/meeting/${meetingID}`);
        }
    },[userName])

    // navigate page name with room name; 
    const handleJoinRoom = useCallback( (data) => {
        const { email, room } = data;
    }, []);

    const sendStreams = useCallback((stream) => {
        for (const track of stream.getTracks()) {
            peer.addTrack(track, stream);
        }
    }, []);

    const addUser= useCallback((userName, connectionID)=>{
        setOtherUser(prev=> [...prev, {userName, connectionID}]);
        
    }, [setOtherUser])

    const newConnectionInformation= useCallback( (data)=>{
        setOtherUser([]);
        for (let i = 0; i < data.length; i++) {
            const userName = data[i].userName;
            const connectionID = data[i].connectionID;
            addUser(userName, connectionID);
        }
    }, [addUser])

    const processMedia = async()=>{
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            setMyStream(stream);
            sendStreams(stream);
            // return stream;
        } catch (error) {
            console.error("Error accessing media devices:", error);
        }
    }
    let localConnectionID;
    useEffect(() => {
        socket.on("connect", ()=>{
            socket.emit("user_info_to_singnaling_server", {
                userName: userName,
                meetingID : meetingID
            });
            processMedia();
        });
        // localConnectionID= socket.id;
        

        socket.on("newConnectionInformation", data=>{newConnectionInformation(data);})

        socket.on("other-user-inform", data=>{
            addUser(data.otherUsersID, data.connectionID)
        })
        return () => {
            socket.off("room-join")
            socket.off("newConnectionInformation", data=>{newConnectionInformation(data);})
            socket.off("other-user-inform", data=>{addUser(data.otherUsersID, data.connectionID)})
        };
    }, [socket, newConnectionInformation]);

    return (
        <div className='max-w-7xl mx-auto h-screen py-10 px-6'>
            <h1 className='text-center capitalize text-[#0071E3] text-[18px] font-medium'>
                { 
                    userName && "User Name:- "+ userName   
                }
                
            </h1>
            <h3>{otherUser?.length}</h3>
            <div className='grid grid-cols-2 gap-10'>
                {
                    otherUser?.map((data, index)=>
                        <div key={index} className='shadow-2xl rounded-md  pb-[20px] px-5 '>
                            <h1 className='text-center mb-2 capitalize text-[#0071E3] text-[18px] font-medium'>{data?.userName}</h1>
                            <ReactPlayer
                                playing
                                muted
                                height="300px"
                                width="100%"
                                url="https://www.youtube.com/watch?v=rePN-VFo1Eo&list=PLHiZ4m8vCp9OkrURufHpGUUTBjJhO9Ghy"
                            />
                        </div>
                    )
                }
            </div>
            {/* <ReactPlayer
                playing
                muted
                height="100px"
                width="200px"
                url="https://www.youtube.com/watch?v=IAvw60x0Kn4&list=RDIAvw60x0Kn4&start_radio=1"
            /> */}
        </div>

    )
}

export default Stream