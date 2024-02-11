import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import { FcConferenceCall } from "react-icons/fc";
import { FaArrowLeft } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Modals = ({modalOpen, setModalOpen }) => {
    const [meetingId, setMeetingId] = useState('');
    const navigate = useNavigate();
    const handleJoin =()=>{
        if(meetingId == ''  || meetingId.length < 8){
            alert("Invalied Meeting ID");
        } 
        else{
            navigate(`/meeting/${meetingId}`);
        }
    }
    return (
            <Modal
                width={350}
                centered
                footer={false}
                open={modalOpen}
                style={{padding:0, margin: 0}}
                onCancel={() => setModalOpen(false)}
            >   
                <div className='p-5'>
                    <FaArrowLeft className='cursor-pointer' size={16} color='#0071E3' onClick={() => setModalOpen(false)} />
                    <div className='mt-5 flex flex-row items-center gap-3 '> 
                        <FcConferenceCall  size={35}  color="#0071E3" />
                        <Input
                            name='meetingId'
                            onChange={(e)=>setMeetingId(e.target.value)}
                            placeholder="Meeting ID [Without Space]" 
                            style={{
                                border: "1px solid #0071E3",
                                height: "40px",
                                background: "white",
                                borderRadius: "8px",
                                outline: "none",
                            }}
                        />
                    </div>
                    <div onClick={handleJoin} className='bg-[#0071E3] cursor-pointer w-fit flex items-center gap-2 text-white px-4 py-1 rounded-md font-medium mt-5'>
                        <span>Join</span>
                        <IoSend className='text-white' />
                    </div>
                </div>
                        
            </Modal>
    )
}

export default Modals