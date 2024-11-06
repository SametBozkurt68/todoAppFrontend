function Name(){
   

    const user ={
        name: "sercan"
    }

    user.surname = "bozkurt"

    return(

        <h1>

       <span>{`${user.name} ${user.surname}`}</span><br/>
           
            {user.name}<br/>
            {user.surname}
        </h1>
    );


}

export default Name