import React, { useEffect, useRef, useState } from 'react'
import './Home.css';
import Profile from '../Profile/Profile';
import { randomWords } from './array';
import { useSelector } from 'react-redux';
// import Profile from '../Profile/';

import { Link, NavLink, useNavigate } from 'react-router-dom'
import Navbar from './Navbar';
import { AddData } from '../api calls/data';
import { message } from 'antd';
import { GetCurrentUser } from '../api calls/users';

function Timer(props) {

  const { time, setTime, noOfCorrectWords, setStartCounting, userInput, setUserInput,currentUser } = props;
  const addData=async(speed)=>{
    try {
      const response = await AddData({speed})
      if(response.success){
        message.success(response.message);
      }
      else
      message.error(response.message); 
    } catch (error) {
       message.error(error.message); 
    }
  }

  const minutes = (60 - time) / 60;
  const speed = (noOfCorrectWords / minutes) || 0;
  
  useEffect(() => {
    let id;
    if (props.startCounting) {
      id = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000)
    }
    return () => {
      clearInterval(id);
    }

  }, [props.startCounting])

  const handleRefresh = () => {
    window.location.reload();
  }
  if (time === 0) {
    setStartCounting(false);
    setUserInput("Completed");
  }
  if(userInput === "Completed" && currentUser){
    addData(speed);
  }

  return (<>

    <div className='top-bar'>
      <div className='upper-bar'>
        <p> <b> Time:  </b>{time} Sec</p>
        <p><b>Speed:</b> {speed.toFixed(2)} WPM</p>
      </div>
      <div className='button-container'>
        {<button onClick={handleRefresh} className='myButton'>Refresh</button>}
      </div>
    </div>
  </>)

}


function Word(props) {
  const { word, rightWords, index, activeWordIndex } = props;
  if (index === activeWordIndex) {
    return <b className='word'>{word} </b>
  }
  else if (rightWords[index] === 1) {
    return <span className='correct word'> {word} </span>
  }
  else if (rightWords[index] === 0) {
    return <span className='incorrect word'> {word} </span>
  }
  else
    return <span className='word'>{word} </span>
}

Word = React.memo(Word);


function Home(props) {
  const [time, setTime] = useState(60);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [currentWord, setCurrentWord] = useState([]);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [rightWords, setRightWords] = useState([]);
  const [startCounting, setStartCounting] = useState(false);
  const [currentUser, SetCurrentUser] = useState();
  const { color } = props;

  const getCurrentUser = async () => {
    try {
      const response = await GetCurrentUser();
      if (response.success) {
        SetCurrentUser(response.data.username);
      }
      else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      localStorage.removeItem("token");
    }
  }

  useEffect(() => {
    getCurrentUser()

    const getRandomWord = () => {
      // Get a random word from the word pool
      const randomIndex = Math.floor(Math.random() * randomWords.length);
      return randomWords[randomIndex];
    };

    const getAllWords = () => {
      let a = []
      for (let i = 0; i <= 150; i++) {
        a.push(getRandomWord());
      }
      setCurrentWord(a);
    }
    inputRef.current.focus();
    getAllWords();
  }, [])

  const processInput = (value) => {
    if (activeWordIndex === currentWord.length) {
      return;
    }
    if (!startCounting) {
      setStartCounting(true);
    }
    if (value.endsWith(' ')) {

      setRightWords((data) => {
        const temp = [...data];
        const word = value.trim();
        if (word === currentWord[activeWordIndex])
          temp.push(1);
        else
          temp.push(0);

        return temp;
      })

      setActiveWordIndex((index) => index + 1);
      setUserInput("");

      if (activeWordIndex === currentWord.length - 1) {
        setStartCounting(false);
        setUserInput("Completed");
        return;
      }
    }
    else {
      setUserInput(value);
    }
  }

  return (
    <>
      <div style={{ color: color.color, backgroundColor: color.bgColor, height: "100vh" }}>
        <Navbar></Navbar>
        <div className='middle-container'>
          <Timer
            startCounting={startCounting}
            time={time}
            setTime={setTime}
            noOfCorrectWords={rightWords.filter((value) => value === 1).length}
            setStartCounting={setStartCounting}
            userInput= {userInput}
            setUserInput={setUserInput}
            currentUser={currentUser}
          ></Timer>
          <div className='input-container'>
            <input ref={inputRef} className='input' placeholder='Start Typing' type='text' value={userInput} onChange={(e) => { e.persist(); processInput(e.target.value) }} />
          </div>
          <div className='text-area'>
            <div className='text-container' autoFocus
              style={{ color: (color.bgColor === "#872341" || color.bgColor === "#164863" || color.bgColor === "#577D86") ? color.color : "white" }}>
              <p className='para'>{
                currentWord.map((word, index) => {

                  return <Word
                    word={word}
                    rightWords={rightWords}
                    index={index}
                    activeWordIndex={activeWordIndex}>
                  </Word>
                })
              }</p>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default Home