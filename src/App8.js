const user = {
    name: 'Samet Bozkurt',
    imageurl:'https://i.imgur.com/yXOvdOSs.jpg',
    imagesize:90,
};


export default function Profile(){
    return(
        <>
        <img classname="avatar"/> 
            <h1>
                {user.name}

            </h1>
            <img
                className="avatar"
                src={user.imageurl}
                alt={'Photo of' + user.name}     
                style={{
                    width: user.imagesize,
                    height: user.imagesize
                }}
                />
        
        </>
    );
}


