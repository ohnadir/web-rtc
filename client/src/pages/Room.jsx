import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import { useSocket } from "../providers/Sockets";
import { usePeer } from "../providers/Peer"

const RoomPage = () => {
    const socket = useSocket();
    const { peer, getAnswer, setLocalDescription, getOffer  } = usePeer();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState();
    const [remoteStream, setRemoteStream] = useState();

    const handleUserJoined = useCallback(({ email, id }) => {
        console.log(`Email ${email} joined room`);
        setRemoteSocketId(id);
    }, []);

    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        });

        const offer = await getOffer();
        socket.emit("user-call", { to: remoteSocketId, offer }); // here is the problem
        setMyStream(stream);

    }, [remoteSocketId, socket]);

    const handleIncommingCall = useCallback( async ({ from, offer }) => {
        setRemoteSocketId(from);
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        setMyStream(stream);
        console.log(`Incoming Call`, from, offer);
        const ans = await getAnswer(offer);  // here is the problem
        socket.emit("call-accepted", { to: from, ans });
        },
        [socket]
    );

    const sendStreams = useCallback(() => {

        for (const track of myStream.getTracks()) {
            peer.addTrack(track, myStream);
        }
    }, [myStream]);

    const handleCallAccepted = useCallback( ({ from, ans }) => {
            setLocalDescription(ans);
            console.log("Call Accepted!");
            sendStreams();
        },
        [sendStreams]
    );

    const handleNegoNeeded = useCallback(async () => {
        const offer = await getOffer();
        socket.emit("peer-nego-needed", { offer, to: remoteSocketId });
    }, [remoteSocketId, socket]);

    useEffect(() => {
        peer.addEventListener("negotiationneeded", handleNegoNeeded);
        return () => {
            peer.removeEventListener("negotiationneeded", handleNegoNeeded);
        };
    }, [handleNegoNeeded]);

    const handleNegoNeedIncomming = useCallback(
        async ({ from, offer }) => {
            const ans = await getAnswer(offer); // here is the problem
            socket.emit("peer-nego-done", { to: from, ans });
        },
        [socket]
    );

    const handleNegoNeedFinal = useCallback(async ({ ans }) => {
        await setLocalDescription(ans);
    }, []);

    useEffect(() => {
        peer.addEventListener("track", async (ev) => {
        const remoteStream = ev.streams;
        console.log("GOT TRACKS!!");
        setRemoteStream(remoteStream[0]);
        });
    }, []);

    useEffect(() => {
        socket.on("user-joined", handleUserJoined);
        socket.on("incomming-call", handleIncommingCall); 
        socket.on("call-accepted", handleCallAccepted);
        socket.on("peer-nego-needed", handleNegoNeedIncomming); // here is the problem
        socket.on("peer-nego-final", handleNegoNeedFinal);

        return () => {
        socket.off("user-joined", handleUserJoined);
        socket.off("incomming-call", handleIncommingCall);
        socket.off("call-accepted", handleCallAccepted);
        socket.off("peer-nego-needed", handleNegoNeedIncomming);
        socket.off("peer-nego-final", handleNegoNeedFinal);
        };
    }, [
        socket,
        handleUserJoined,
        handleIncommingCall,
        handleCallAccepted,
        handleNegoNeedIncomming,
        handleNegoNeedFinal,
    ]);

  return (
    <div>
        <h4 className="text-center text-2xl font-semibold text-[#0071E3] my-2">{remoteSocketId ? "Connected" : "No one in room"}</h4>
        <h1 className="text-center text-2xl font-semibold  text-[#0071E3] my-2">Room Page</h1>
        <br />
        {myStream && <button className="bg-[#0071E3] mx-auto my-4 font-semibold text-white rounded-lg px-5 py-1" onClick={sendStreams}>Send Stream</button>}
        <br />
        {remoteSocketId && <button className="bg-[#0071E3] font-semibold mb-4 text-white rounded-lg px-5 py-1" onClick={handleCallUser}>CALL</button>}

        <div className="flex items-center justify-between ">
            <div className="border border-[#0071E3] pb-5"> 
                {
                    myStream && (
                    <>
                        <h1 className="text-center my-2">My Stream</h1>
                        <ReactPlayer
                            playing
                            muted
                            height="100px"
                            width="200px"
                            url={myStream}
                        />
                    </>
                    )
                }
            </div>

            <div className="border border-[#0071E3] pb-5">
                {
                    remoteStream && (
                    <>
                        <h1 className="text-center my-2">Remote Stream</h1>
                        <ReactPlayer
                            playing
                            muted
                            height="100px"
                            width="200px"
                            url={remoteStream}
                        />
                    </>
                )}
            </div>
        </div>
    </div>
  );
};

export default RoomPage;
