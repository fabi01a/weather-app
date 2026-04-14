import React from 'react';
// from .app import App;

function InputButton(props) {
    return(
        <section>
            <button onClick={props.onClick}>SEARCH</button>
        </section>
    );
};



export default InputButton;