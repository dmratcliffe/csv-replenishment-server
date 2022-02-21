import React from 'react';
import './buttons.css'

export default function Buttons(props) {
    return (
        <div className="buttons-container">
            {props.list.map(button => {
                return (
                    <Button key={button.name} 
                    func={() => props.func_param ? button.func(props.func_param) : button.func()} 
                    name={`${button.name}`}
                    selected={button.name === props.selected}/>
                )
            })}
        </div>
    );
}

function Button(props) {
    return (
        <div className={`button-container ${props.selected ? 'selected' : ''}`} onClick={props.func}>
            <span className="button-text no-select">{props.name}</span>
        </div>
    )
}