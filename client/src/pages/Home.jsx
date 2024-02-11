import React, { useCallback, useEffect, useState } from 'react';
import { Input } from 'antd';
import { HiOutlineMail } from "react-icons/hi";
import { FaRestroom } from "react-icons/fa6";
import { useSocket } from "../providers/Sockets";
import { useNavigate } from "react-router-dom"
const Home = () => {
    const socket = useSocket();
    const navigate = useNavigate()
    const [auth, setAuth] = useState();
    const handleChange=(e)=>{
        setAuth(prev=>({...prev,  [e.target.name]: e.target.value}))
    }
    
    // submit form for joining room;

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        socket.emit("room-join", { email: auth?.email, room:auth?.room });
    },[auth?.email, auth?.room, socket]);


    // navigate page name with room name; 
    const handleJoinRoom = useCallback( (data) => {
        const { email, room } = data;
        navigate(`/room/${room}`);
    }, [navigate]);


    useEffect(() => {
        socket.on("room-join", handleJoinRoom);
        return () => {socket.off("room-join", handleJoinRoom)};
    }, [socket, handleJoinRoom]);

    return (
        <div className='max-w-7xl mx-auto py-10 px-6'>
            <div
                className='
                    grid 
                    grid-cols-1 
                    gap-3 
                    max-w-[700px] 
                    shadow-md 
                    p-4
                    mx-auto 
                    border
                    rounded-xl
                '
            >
                <form className='grid grid-cols-1 gap-5' onSubmit={handleSubmit}>
                    <h1 
                        className='
                            text-2xl 
                            text-[#0071E3] 
                            mb-5 
                            font-bold 
                            text-center
                        '
                    >
                        One to One 
                    </h1>
                    <Input
                        name='email'
                        onChange={handleChange} 
                        placeholder="Enter Your Valid Email" 
                        prefix={<HiOutlineMail size={24} className='mr-2' color="#0071E3" />} 
                        style={{
                            border: "1px solid #0071E3",
                            height: "52px",
                            background: "white",
                            borderRadius: "8px",
                            outline: "none",
                        }}
                    />
                    <Input
                        name='room'
                        onChange={handleChange} 
                        placeholder="Enter Your Room" 
                        prefix={<FaRestroom className='mr-2' size={24} color="#0071E3" />} 
                        style={{
                            border: "1px solid #0071E3",
                            height: "52px",
                            background: "white",
                            borderRadius: "8px",
                            outline: "none",
                        }}
                    />
                    <button type='submit' className='w-full bg-[#0071E3] h-[46px] text-white font-medium rounded-lg'>Join</button>
                </form>
            </div>
        </div>
    )
}

export default Home