import React, { useMemo, createContext, useContext  } from 'react';

const PeerContext = createContext(null);
export const usePeer = () => useContext(PeerContext);

export const PeerProvider= (props) =>{
    const peer = useMemo(()=> new RTCPeerConnection({
        iceServers: [
            {
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:global.stun.twilio.com:3478"
                ],
            }
        ]
    }), []);

    const  getAnswer= async(offer) =>{
        if (offer) {
            await peer.setRemoteDescription(offer);
            const ans = await peer.createAnswer();
            await peer.setLocalDescription(new RTCSessionDescription(ans));
            return ans;
        }
    }

    const setLocalDescription = async(ans) =>{
        if (ans) {
            await peer.setRemoteDescription(new RTCSessionDescription(ans));
        }
    }

    const getOffer = async()=>{
        if(peer){
            const offer = await peer.createOffer();  // here is the problem
            await peer.setLocalDescription(new RTCSessionDescription(offer));
            return offer;
        }
    }
    return (
        <PeerContext.Provider value={{ peer, getAnswer, setLocalDescription, getOffer}}>
            {props.children}
        </PeerContext.Provider>
    )
}