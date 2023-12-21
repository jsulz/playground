import React, { useState } from 'react';
  
export default function PlaygroundsFirstComponent() {
    const [helloList, setHelloList] = useState([]);

    function addHello() {
        setHelloList(helloList.concat(<Hello key={helloList.length} />))
    }

    return (
        <div>
            <CreateHello clickHandle={() => addHello()} />
            {helloList}
        </div>
    );
}

function CreateHello({clickHandle}){
    return(
    <div>
        <h2>Say Hello!</h2>
        <input type="text" className="form-control" placeholder="Enter your name"></input>
        <button type="button" className="btn btn-primary" onClick={clickHandle}>Add</button>
    </div>
    )
}

function Hello(){
    return (
        <div>Hello</div>
    )
}