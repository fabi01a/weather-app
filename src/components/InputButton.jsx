import React from 'react';

function InputButton(props) {
    return(
        <section>
            <button onClick={props.onClick}>SEARCH</button>
        </section>
    );
};



export default InputButton;