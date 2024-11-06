import { useState } from "react";

function MyButton(){
    const [count,setCount]= useState(0);
    function handclick(){
        setCount (count+1)
    }
    return(
        <button onClick={handclick}>
            Clicked {count} times
        </button>
    );
}

export default MyButton
