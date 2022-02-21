import { combineReducers } from "redux";
import { SET_NAV, SET_LIST, ADD_TO_LIST, REM_FROM_LIST, ADD_TO_SELECTION, REM_FROM_SELECTION, TOGGLE_SELECTION, SET_REMOVED_LIST } from "../actions";
import { PAGE_REPLENISHMENT } from "../../functions/Constants";
import { seperateWomensMensUnisex } from "../../functions/UsefulFunctions";

export default combineReducers({
    nav,
    lists,
    selected,
    removed,
});


/**
 * This reducer will hold all of the lists from the backend
 * It should have capability to add, remove, and set a list.
 */
function lists(state = {}, action) {

    console.log("Action:", action)
    var final_list = undefined;
    var new_list = {};
    switch (action.type) {
        case SET_LIST: //Replace a whole named list in state
            new_list[action.name] = action.list
            final_list = Object.assign({}, state, new_list);
            break;
        case ADD_TO_LIST: //Add to a named list in state
            new_list[action.name] = [...(state[action.name] || []), action.obj];
            final_list = Object.assign({}, state, new_list);
            break;
        case REM_FROM_LIST: //Filter out an object from a named list in state.
            new_list[action.name] = state[action.name].filter(list_obj => {
                //TODO: This should compare keys, not the object... Works for now.
                //If there problems deleteing, check here.
                return JSON.stringify(list_obj) !== JSON.stringify(action.obj);
            })
            final_list = Object.assign({}, state, new_list);
            break;
        default:
            return state;
    }
    //sort items on add...
    final_list[action.name] = seperateWomensMensUnisex(final_list[action.name]);
    return final_list;
}

/**
 * This reducer simply sets the navigation page.
 * Anything that is shown / hidden should probably exist in here.
 * Right now that's just he page selection.
 */
function nav(state = PAGE_REPLENISHMENT, action) {
    switch (action.type) {
        case SET_NAV:
            return action.page
        default:
            return state;
    }
}

/**
 * A list of selected objects. The list name should match
 * the list it references. IE: Replen selections should be in Replen
 */
function selected(state = {}, action) {
    var new_list = {};
    switch (action.type) {
        case ADD_TO_SELECTION:
            new_list[action.name] = [...(state[action.name] || []), action.obj];
            return Object.assign({}, state, new_list);
        case REM_FROM_SELECTION:
            new_list[action.name] = state[action.name].filter(list_obj => {
                //TODO: This should compare keys, not the object... Works for now.
                //If there problems deleteing, check here.
                return JSON.stringify(list_obj) !== JSON.stringify(action.obj);
            })
            return Object.assign({}, state, new_list);
        case TOGGLE_SELECTION:
            var removed_flag = false;

            new_list[action.name] = (state[action.name]||[]).filter(list_obj => {
                //TODO: This should compare keys, not the object... Works for now.
                //If there problems deleteing, check here.
                var str_list_obj = JSON.stringify(list_obj);
                var str_action_obj = JSON.stringify(action.obj);

                if(str_list_obj === str_action_obj)
                    removed_flag = true;

                return  str_list_obj !== str_action_obj;
            })

            // console.log("Look at me!!", new_list, removed_flag);

            if(!removed_flag)
                new_list[action.name] = [...new_list[action.name], action.obj];
            return Object.assign({}, state, new_list);
        default:
            return state;
    }
}


/**
 * Manage the 'removed' states. This makes the undo function work (at least, for removed items)
 * Removed actions consits of one right now, which has a name and a replacement list.
 * Simply overwrite the existing state, of that named list.
 */

 function removed(state = {}, action){
    switch (action.type) {
        case SET_REMOVED_LIST:
            var removed_list = {};
            removed_list[action.name] = action.list;
            
            return Object.assign({}, state, removed_list);
        default:
            return state;
    }
 }