import React from 'react';
import './statusStrip.css';

/**
 * Currently the only use of this is to show selected.
 * In the future it might be useful to further generalize this class.
 */
export default function StatusStrip(props) {
    //TODO: tapping status-left unselects all?
    return (
        <div className="status-strip">
            <div className="status-cell status-left" >
                {props.number_selected || 0} selected
            </div>
            <div className="status-cell status-mid">
                {props.number_left} left
            </div>
            <div className="status-cell status-right" onClick={() => props.right_action()}>
                <span className={`tap-text ${props.number_removed ? `highlight-tap-text` : ''}`}>
                    {props.number_removed ? `UNDO (${props.number_removed})` : 'UNDO (0)'}
                </span>
            </div>
        </div>
    );
}
