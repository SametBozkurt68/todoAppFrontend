import { useState } from "react";

function MyButton(){
    const [count,setCount]=useState(0);



    return (
        <button onClick={setCount(count + 1)}>
            button{count}
        </button>
    )

}
export default MyButton