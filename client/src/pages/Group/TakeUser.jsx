import React, {  useState } from 'react'
import {  Input } from 'antd';
import { useNavigate, useParams } from "react-router-dom";

const TakeUser = () => {
    const { meetingID } = useParams()
    const navigate = useNavigate();
    const [userName, setUserName] = useState('')
    const handleMeeting=()=>{
        navigate(`/stream/${meetingID}?username=${userName}`);
    }
    return (
        <div 
            className='
                bg-slate-400 
                w-screen 
                h-screen 
                flex 
                items-center 
                justify-center
            '
        >
            <div className='bg-white w-fit rounded-lg gap-5 p-8'>
                <Input
                    name='meetingId'
                    onChange={(e)=>setUserName(e.target.value)}
                    placeholder="User Name" 
                    style={{
                        border: "1px solid #0071E3",
                        height: "40px",
                        background: "white",
                        borderRadius: "8px",
                        outline: "none",
                        marginBottom : "20px"
                    }}
                />
                <div className='w-full flex items-end justify-end'>
                    <button 
                        onClick={handleMeeting} 
                        className='
                            bg-[#0071E3] 
                            px-5 
                            py-[4px] 
                            rounded-lg 
                            text-white 
                            font-medium 
                            text-[17px]
                        '
                    >
                        Start Stream
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TakeUser;