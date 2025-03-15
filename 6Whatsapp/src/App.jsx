import { useEffect, useState, useSyncExternalStore } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [message, setMessage] = useState([]);
  const [username, setUsername] = useState("");
  const [ws, setWs] = useState(null);
  const [inp, setInp] = useState("");
  const [room, setRoom] = useState("");
  const [joinedroom, setJoinedroom] = useState("");
  const [typing, setTyping] = useState("");


  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:4001`);
    
    socket.onopen = () => {
      console.log(`connected`);
    }
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data);
      if(data.type === "welcome") {
        setUsername(data.username);
      } else if(data.type === "message") {
        setMessage((prev) => [...prev, `${data.sender}:${data.msg}`]);
      } else if(data.type === "joinroom") {
        setMessage((prev) => [...prev, `${data.msg}`]);
        if(data.room) {
          setJoinedroom(data.room);
        }
      } else if(data.type === "typing") {
        setTyping(data.typer);
      } else if(data.type === "stopTyping") {
        setTyping("");
      } else if(data.type === "leaveroom") {
        setMessage((prev) => [...prev, `${data.msg}`])
      } else if(data.type === "history") {
        const history = data.msg.map((msgs) => (
          `${msgs.sender}:${msgs.content}`
        ))
        setMessage(history);
      }
    }
    socket.onclose = () =>{
      console.log(`disconnected`);
    }

    setWs(socket);
    return () => socket.close();
  }, [])

  function send () {
    if(ws && joinedroom && inp) {
      ws.send(JSON.stringify({
        type: "message",
        msg: inp,
        room: joinedroom
      }))
      setInp("");
    }
  }
  function joinroom() {
    if(room && ws) {
      ws.send(JSON.stringify({
        type: "joinroom",
        room: room
      }))
    }
  }
  function handleTyping() {
    if(ws && joinedroom) {
      ws.send(JSON.stringify({
        type: "typing",
        room: joinedroom,
      }))

      setTimeout(() => {
        ws.send(JSON.stringify({
          type: "stopTyping",
          room: joinedroom
        }))
      }, 2000);
    }
  }
  function leaveroom() {
    if(ws && joinedroom) {
      ws.send(JSON.stringify({
        type: "leaveroom",
        room: joinedroom
      }))
      setJoinedroom("");
    }
  }
  return (
    <>
      {username && <h2>{username}</h2>}
      <input type="text" onChange={(e) => {setRoom(e.target.value)}}
      placeholder='enter room' />
      <button onClick={joinroom}>join room</button>
      <button onClick={leaveroom}>leave room</button>

      {joinedroom && <h2>{username} joined {joinedroom}</h2>}

      <input type="text" onChange={(e) => {
        setInp(e.target.value)
        handleTyping()
      }}
      placeholder='enter msg' />
      <button onClick={send}>send</button>
      {
        message.map((msg, idx) => (
          <h2 key={idx}>{msg}</h2>
        ))
      }

      {typing && <h2>{typing} .....</h2>}
    </>
  )
}

export default App
