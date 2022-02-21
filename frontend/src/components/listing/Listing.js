import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import './listing.css';

export default function Listing(props) {
    return (
        <div className="listing-container">
            <CSSTransitionGroup
                transitionName="list-ani"
                transitionEnterTimeout={250}
                transitionLeaveTimeout={250}
            >
                {
                    props.list.map(item => {
                        return (
                            <ListItem
                                func={() => props.tap_action(item)}
                                name={item.name} qty={item.inventory}
                                selected={props.selected.filter(selected => JSON.stringify(selected) === JSON.stringify(item)).length}
                                key={item.name}
                            />
                        )
                    })
                }
            </CSSTransitionGroup>
        </div>
    );
}

function ListItem(props) {
    var clean_qty = props.qty.replace(".00", "");
    return (
        <div className={`no-select list-item-row ${props.selected ? 'selected-list' : ''}`} onClick={props.func}>
            <span className="list-item-text">{props.name}</span>
            <span className={`list-item-qty ${clean_qty === '1' ? 'list-item-low' : ''}`}>{clean_qty}</span>
        </div>
    )
}
