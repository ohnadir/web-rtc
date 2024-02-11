import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Modal from './Modal';

const GroupHome = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();
    const handleMeetingId = () =>{
        const number = Math.floor(Math.random() * 100000000);
        navigate(`/meeting/${number}`);
    }
    const handleJoinMeeting = ()=>{
        setModalOpen(true)
    }
    return (
        <div className='bg-slate-400 w-screen h-screen flex items-center justify-center'>
            <div className='bg-white w-fit rounded-lg flex gap-5 p-8'>
                <button onClick={handleMeetingId } className='bg-[#0071E3] px-10 py-[4px] rounded-lg text-white font-medium text-[17px]'>Host</button>
                <button onClick={handleJoinMeeting} className='bg-[#0071E3] px-10 py-[4px] rounded-lg text-white font-medium text-[17px]'>Join</button>
            </div>

            <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}/>
        </div>
    )
}

export default GroupHome;