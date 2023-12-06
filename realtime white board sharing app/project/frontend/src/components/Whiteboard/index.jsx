import React, { useEffect, useLayoutEffect, useState } from 'react'
import rough from 'roughjs';

const roughGenerator= rough.generator();

function Whiteboard({canvasRef, ctxRef, elements,setElements}) {
 const [isDrawing, setIsDrawing] = useState(false);
 
 useLayoutEffect(()=>{
  const roughCanvas = rough.canvas(canvasRef.current);
  elements.forEach((element)=> {
    roughCanvas.linearPath(element.path);
  })
 },[elements])
 
 useEffect(()=>{
  const canvas= canvasRef.current;
  const ctx= canvas.getContext("2d");

  ctxRef.current=ctx;
 }, []);  



 const handleMouseDown=(e)=>{
  const x= e.clientX; 
  const y= e.clientY; 
  console.log({x,y});

  const {offsetX, offsetY} = e.nativeEvent;

  setElements((prevElements)=> [
    ...prevElements,
    {
      type: "pencil",
      offsetX,
      offsetY,
      path: [[offsetX,offsetY]],
      stroke: "black",
      strokeWidth: 5,
    },
  ])

  setIsDrawing(true);
 }


 const handleMouseMove=(e)=>{
   const {offsetX, offsetY} = e.nativeEvent;
   const x= e.clientX; 
   const y= e.clientY; 
   console.log({x,y});

  if(isDrawing){
    const {path} = elements[elements.length-1];
    const newPath = [...path, [offsetX,offsetY] ];
     
    setElements((prevElements)=>{
      prevElements.map((ele,index)=>{
        if(index==elements.length-1){
          return {
            ...ele,
            path: newPath,
          }
        }
        else 
        return ele;
      });
    });
  }
 }
 const handleMouseUp=(e)=>{
  const x= e.clientX; 
  const y= e.clientY; 
  console.log({x,y});
  const {offsetX, offsetY} = e.nativeEvent;
  // console.log(offsetX,offsetY);
  
  setIsDrawing(false);
}

const handleTouchStart = (e) => {
  const x= e.clientX; 
  const y= e.clientY; 
  console.log({x,y});
  console.log("touch start");
  const { touches } = e.nativeEvent;
  if (touches.length === 1) {
    const { pageX, pageY } = touches[0];
    // console.log(pageX, pageY);

    // setIsDrawing(true);
    
  setElements((prevElements)=> [
    ...prevElements,
    {
      type: "pencil",
      pageX,
      pageY,
      path: [[pageX,pageY]],
      stroke: "black",
      strokeWidth: 5,
    },
  ])

  setIsDrawing(true);
  }
}
 const handleTouchMove = (e) => {
  const { touches } = e.nativeEvent;
  const x= e.clientX; 
  const y= e.clientY; 
  console.log({x,y});
  // console.log(e.nativeEvent);
  if (touches.length === 1) {
    // console.log(touches[0]);
    const { pageX, pageY } = touches[0];
    // if(isDrawing)
    // console.log(pageX, pageY);

    if(isDrawing){
      const {path} = elements[elements.length-1];
      const newPath = [...path, [pageX,pageY] ];
       
      setElements((prevElements)=>
        prevElements.map((ele,index)=>{
          if(index===elements.length- 1){
            return {
              ...ele,
              path: newPath,
            }
          }
          else 
          return ele;
        })
      );
    }
  }
}

const handleTouchEnd = (e) => {
  console.log('Touch end');
  const x= e.clientX; 
  const y= e.clientY; 
  console.log({x,y});
  setIsDrawing(false);
}

  return (
    <>
    {JSON.stringify(elements)}
    <canvas 
     ref={canvasRef}
     className='border border-dark border-3 h-100 w-100'
    //  onMouseDown={handleMouseDown}
    //  onMouseMove={handleMouseMove}
    //  onMouseUp={handleMouseUp}
     onTouchMove={handleTouchMove}
     onTouchStart={handleTouchStart}
     onTouchEnd={handleTouchEnd}
    >
    </canvas>
    </>
  )
}

export default Whiteboard