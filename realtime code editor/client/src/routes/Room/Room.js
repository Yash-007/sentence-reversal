import React, { useEffect, useState } from 'react'
import AceEditor from 'react-ace';
import { Toaster, toast } from 'react-hot-toast';
import './Room.css'

import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-typescript'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/mode-java'
import 'ace-builds/src-noconflict/mode-yaml'
import 'ace-builds/src-noconflict/mode-golang'
import 'ace-builds/src-noconflict/mode-html'
import 'ace-builds/src-noconflict/mode-css'

import 'ace-builds/src-noconflict/keybinding-emacs';
import 'ace-builds/src-noconflict/keybinding-vim';

import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';
import { useNavigate, useParams } from 'react-router-dom';


function Room({socket}) {
 const navigate = useNavigate();
 const {roomId}= useParams();
 const languagesAvailable= ["javascript", "typescript", "java", "python", "yaml", "golang", "html", "css"]

 const codeKeybindingsAvailable= ["default", "emacs", "vim"];

 const [language, setLanguage] = useState("javascript");
 const [codeKeybinding, setCodeKeybinding] = useState(undefined);
 const [fetchedUsers, setFetchedUsers] = useState([]);
 const [fetchedCode, setFetchedCode] = useState("");

 const handleLanguageChange=(e)=>{
  setLanguage(e.target.value);
  socket.emit("update language", {roomId, languageUsed: e.target.value})
  socket.emit("syncing the language", {roomId});
 }

 const onCodeChange=(newValue)=>{
  setFetchedCode(newValue);
  socket.emit("update code", {roomId, code: newValue})
  socket.emit("syncing the code", {roomId});
 }


 const handleCodeKeyBindingChange=(e)=>{
  setCodeKeybinding(e.target.value==="default" ? undefined :
   e.target.value);
 }

 function copyToClipboard(text){
    try {
      navigator.clipboard.writeText(text);
      toast.success("Room ID copied");
    } catch (exp) {
      console.error(exp);
    }
  }
 const generateUserColor =(user)=>{
  let hash =0;
  for(let strIndex= 0; strIndex< user.length; strIndex++){
    hash= user.charCodeAt(strIndex) + ((hash << 5)- hash);
  }
  let color= '#';
  for(let index=0; index<3; index++){
    let value = (hash >> (index * 8)) & 0xff;
    color+= value.toString(16).padStart(2,'0');
  }
  return color;
 }

 const handleLeave= (e)=>{
   socket.disconnect();
   !socket.connected && navigate("/",{
    replace: true,
    state: {}
   });
 }


  
  useEffect(()=> {
    socket.on("updating client list", ({userslist})=>{
      setFetchedUsers(userslist);
    })

    socket.on("on language change", ({languageUsed})=>{
      setLanguage(languageUsed);
    })

    socket.on("on code change", ({code})=>{
      setFetchedCode(code);
    })

    socket.on("new member joined", ({username})=>{
      toast(`${username} joined`);
    })

    socket.on("member left", ({username})=>{
      toast(`${username} left`);
    })

  }, [socket]);
 
  return (
    <div className='room'>
      <div className='roomSidebar'>
        <div className='roomSidebarUsersWrapper'>
             <div className='languageFieldWrapper'>
                <select className='languageField'
                 name="language" id="language" value={language}
                  onChange={handleLanguageChange}>
                 {
                  languagesAvailable.map((eachLanguage)=>(
                    <option key={eachLanguage} value={eachLanguage}>{eachLanguage}</option>
                  ))
                 }
                 </select>
             </div>

             <div className='languageFieldWrapper'>
                <select className='languageField'
                 name="codeKeyBinding" id="codeKeyBinding" value={codeKeybinding}
                  onChange= {handleCodeKeyBindingChange}>
                 {
                  codeKeybindingsAvailable.map((each)=>(
                    <option key={each} value={each}>{each}</option>
                  ))
                 } 
                 </select>
             </div>

             <p>Connected Users: </p>
             <div className='roomSidebarUsers'>
              {
                fetchedUsers.map((eachUser)=>(
                  <div key={eachUser} className='roomSidebarUsersEach'>
                    <div className='roomSidebarUsersEachAvatar'
                     style={{backgroundColor: `${generateUserColor(eachUser)}`}}
                    >
                      {eachUser.slice(0,2).toUpperCase()}
                    </div>
                    <div className='roomSidebarUsersEachName'>
                      {eachUser} 
                    </div>
                  </div>
                ))
              }
             </div>

             <button className='roomSidebarCopyBtn' onClick={()=>{
              copyToClipboard(roomId);
             }}>Copy Room ID
             </button>

             <button className='roomSidebarBtn' onClick={handleLeave}>Leave</button>
        </div>
      </div>

      <AceEditor
        placeholder="Write your code here."
        className="roomCodeEditor"
        mode={language}
        keyboardHandler={codeKeybinding}
        theme="monokai"
        name="collabEditor"
        width="auto"
        height="auto"
        value={fetchedCode}
        onChange={onCodeChange}
        fontSize={15}
        showPrintMargin={true}
        showGutter={true}
        // highlightActiveLine={true}
        // enableLiveAutocompletion={true}
        // enableBasicAutocompletion={false}
        // enableSnippets={false}
        // wrapEnabled={true}
        tabSize={2}
        editorProps={{
          $blockScrolling: true
        }}
        setOptions={{ useWorker: false }}
      />
      <Toaster />

    </div>
  )
}

export default Room