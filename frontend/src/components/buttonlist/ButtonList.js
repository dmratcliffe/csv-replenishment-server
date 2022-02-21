import React from 'react';
import Listing from '../listing/Listing';
import Buttons from '../buttons/Buttons';
import './buttonList.css'
import StatusStrip from '../StatusStrip/StatusStrip';

export default function ButtonList(props) {
    return (
        <div className="button-list-container">

            <Listing
                tap_action={(item) => { props.toggle_select(item) }}
                list={props.item_list}
                selected={props.selected}
            />

            <StatusStrip 
                number_selected={props.selected.length}
                number_removed={props.removed.length}
                right_action={()=>props.recover_removed(props.removed)}
                number_left={props.item_list.length}
            />

            <Buttons
                selected=""
                list={props.buttons}
                func_param={props.selected}
            />
        </div>
    );
}
