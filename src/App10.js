function MyButton(){
    function handclick(){
        alert ('You clıcked me!')
    }

    return(
        <button onClick={handclick}>
            click me
        </button>
    )
};

export default MyButton