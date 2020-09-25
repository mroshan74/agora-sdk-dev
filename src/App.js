import React, { useEffect, useState } from 'react'
import AgoraRTM from 'agora-rtm-sdk'

const client = AgoraRTM.createInstance('4b88997c353f432fbad18f5305e426a8')
function App() {
  const [user,setUser] = useState('')
  const [sent,setSent] = useState('')
  const [msg,setMsg] = useState('')
  console.log('[USER-CURRENT]', user)
  const handleSubmit = (e) => {
    e.preventDefault()
    client.on('ConnectionStateChanged', (newState, reason) => {
      console.log('on connection state changed to ' + newState + ' reason: ' + reason)
    })
    client.login({ token: null, uid: user }).then(() => {
      console.log('AgoraRTM client login success');
    }).catch(err => {
      console.log('AgoraRTM client login failure', err);
    })
    client.on('MessageFromPeer', ({ text }, sent) => { // text: text of the received message; peerId: User ID of the sender.
      console.log(text)
      /* Your code for handling the event of receiving a peer-to-peer message. */
      })
  }

  const handleMessage = (e) => {
    e.preventDefault()
    client.sendMessageToPeer(
      { text: msg }, // An RtmMessage object.
      sent, // The user ID of the remote user.
      ).then(sendResult => {
        console.log(sendResult.hasPeerReceived ,'show something')
      if (sendResult.hasPeerReceived) {
      /* Your code for handling the event that the remote user receives the message. */
      } else {
      /* Your code for handling the event that the message is received by the server but the remote user cannot be reached. */
      }
      }).catch(error => {
      /* Your code for handling the event of a message send failure. */
      })
  }

  const form = () => (
    <div>
    <form onSubmit={handleSubmit}>
      <input type="text" value={user} onChange={(e)=>{setUser(e.target.value)}}/>
      <input type="text" value={sent} onChange={(e)=>{setSent(e.target.value)}}/>
      <input type="submit" value="users set"/>
    </form>
    <form onSubmit={handleMessage}>
      <input type="text" value={msg} onChange={(e)=>{setMsg(e.target.value)}}/>
      <input type="submit" value="sent message"/>
    </form>
    </div>
  )
  useEffect(() => {
    
  },[])
  
  return (
    <div className="App">
      {form()}
    </div>
  )
}

export default App
