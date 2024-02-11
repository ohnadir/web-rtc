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
    console.log(otherUser);
    
    useEffect(()=>{
        if(userName===""){
            navigate(`/meeting/${meetingID}`);
        }
    },[userName])

    // navigate page name with room name; 
    const handleJoinRoom = useCallback( (data) => {
        const { email, room } = data;
    }, []);

    const addUser= useCallback((userID, connectionID)=>{
        setOtherUser(prev=> [...prev, {userID, connectionID}])
    }, [setOtherUser])

    const newConnectionInformation= useCallback( (data)=>{
        setOtherUser([]);
        for (let i = 0; i < data.length; i++) {
            const userID = data[i].user_id;
            const connectionID = data[i].connectionID;
            addUser(userID, connectionID);
        }
    }, [addUser])


    let localConnectionID;
    useEffect(() => {
        socket.on("connect", ()=>{
            socket.emit("user_info_to_singnaling_server", {
                userName: userName,
                meetingID : meetingID
            });
        });
        // localConnectionID= socket.id;

        socket.on("newConnectionInformation", data=>{newConnectionInformation(data);})

        socket.on("other-user-inform", data=>{addUser(data.otherUsersID, data.connectionID)})
        return () => {
            socket.off("room-join")
            socket.off("newConnectionInformation", data=>{newConnectionInformation(data);})
            socket.off("other-user-inform", data=>{addUser(data.otherUsersID, data.connectionID)})
        };
    }, [socket, newConnectionInformation, addUser]);
    return (
        <div>
            Stream
            <h1 className='text-center capitalize text-[#0071E3] text-[18px] font-medium'>
                { 
                    userName && userName
                }
                
            </h1>
            <div className='border border-red-300 h-[500px]'>
            {
                otherUser?.map((data, index)=>{
                    <div key={index} className='border border-red-300 w-10 h-10'>
                        <h1>{data?.userID}</h1>
                        <h1>{data?.connectionID}</h1>
                        <ReactPlayer
                            playing
                            muted
                            height="100px"
                            width="200px"
                            // url="https://www.youtube.com/watch?v=IAvw60x0Kn4&list=RDIAvw60x0Kn4&start_radio=1"
                        />
                                </div>
                
                })
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