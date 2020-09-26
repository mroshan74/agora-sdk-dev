import React, { useEffect, useState } from 'react'
import AgoraRTM from 'agora-rtm-sdk'

const client = AgoraRTM.createInstance('4b88997c353f432fbad18f5305e426a8')
function App() {
  const [user,setUser] = useState('')
  const [sent,setSent] = useState('')
  const [msg,setMsg] = useState('')
  const [msgArray,setMsgArray] = useState([{id: '', msg: ''}])

  const msgListener = (msg,sent) => {
     //let arr = this.msgArray
      console.log(msg,sent,'[Message received]')
      console.log(msgArray, 'client-on ARRAY')
      setMsgArray(msgArray.concat([{id: sent, msg: msg.text}]))
     /* Your code for handling the event of receiving a peer-to-peer message. */
  }
  // console.log('[USER-CURRENT]', user)
  useEffect(() => {
    client.on('MessageFromPeer', msgListener // text: text of the received message; peerId: User ID of the sender.
    )
    return () => {
      client.off('MessageFromPeer', msgListener)
      console.log('clean up listeners')
    }
  },[msgArray])
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
  }
  
  const handleMessage = (e) => {
    e.preventDefault()
    client.sendMessageToPeer(
      { text: msg, userName:user }, // An RtmMessage object.
      sent, // The user ID of the remote user.
      ).then(sendResult => {
        console.log(sendResult.hasPeerReceived ,'show something')
        if (sendResult.hasPeerReceived) {
          console.log(sendResult.hasPeerReceived ,'sent msg')
          /* Your code for handling the event that the remote user receives the message. */
          setMsg('')
        setMsgArray(msgArray.concat({id: user, msg}))
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
      <h2>Set Users</h2>
      <input type="text" value={user} onChange={(e)=>{setUser(e.target.value)}}/>
      <input type="text" value={sent} onChange={(e)=>{setSent(e.target.value)}}/>
      <input type="submit" value="users set"/>
    </form>
    <form onSubmit={handleMessage}>
      <h2>Message</h2>
      <input type="text" value={msg} onChange={(e)=>{setMsg(e.target.value)}}/>
      <input type="submit" value="sent message"/>
    </form>
    </div>
    
  )
  useEffect(() => {
    console.log('[MsgArray]', msgArray)
  },[msgArray])
  
  return (
    <div className="App">
      {form()}
      {msgArray.map((msg,i) => {
        return <div key={i}>
          <p><span style={{color:'red'}}>{msg.id}:</span>
          <span style={{color:'blue'}}>{msg.msg}</span></p>
        </div>
      })}
    </div>
  )
}

export default App
