import React, { useState } from 'react';
  
export default function PlaygroundsFirstComponent() {
    const [helloList, setHelloList] = useState([]);

    const addHello = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formJson = Object.fromEntries(formData.entries());
        if (formJson.name){
            setHelloList(helloList.concat(formJson.name));
        }
    }

    const clearHellos = () => {
        setHelloList([]);
    }

    return (
        <div>
            <CreateHello submitHandle={addHello} clearHandle={clearHellos} />
            <ul className="list-group">
                {helloList.map( (name, index) => (
                    <Hello key={index} name={name} />
                    ))
                }
            </ul>
        </div>
    );
}

const CreateHello = (props) => {
    const handleForm = (event) => {
        event.preventDefault();
        props.submitHandle(event);
    }

    return(
    <div>
        <form className="mb-3" onSubmit={handleForm}>
            <div className="row g-3">
                <input type="text" name="name" className="form-control" placeholder="Enter your name"></input>
                <button type="submit" className="col-3 me-2  btn btn-primary">Add Hello</button>
                <button type="reset" className="col-3 btn btn-primary" onClick={props.clearHandle}>Clear Hello(s)</button>
            </div>
        </form>
    </div>
    );
}

function Hello(props){
    return (
        <li className="list-group-item">Hello, world. It's me, {props.name}</li>
    );
}