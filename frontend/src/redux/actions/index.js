export const SET_NAV = "SET_NAV";
//------------------------------------------------
export const SET_LIST = "SET_LIST";
export const ADD_TO_LIST = "ADD_TO_LIST";
export const REM_FROM_LIST = "REM_FROM_LIST";
//------------------------------------------------
export const ADD_TO_SELECTION = "ADD_TO_SELECTION"; 
export const REM_FROM_SELECTION = "REM_FROM_SELECTION"; 
export const TOGGLE_SELECTION = "TOGGLE_SELECTION"; 
//------------------------------------------------
export const SET_REMOVED_LIST = "SET_REMOVED_LIST";
//------------------------------------------------



export var setNav = (page) => ({
    type: SET_NAV,
    page,
});
//------------------------------------------------
export var setList = (name, list) => ({
    type: SET_LIST,
    name, list,
});
export var addToList = (name, obj) => ({
    type: ADD_TO_LIST,
    name, obj,
});
export var remFromList = (name, obj) => ({
    type: REM_FROM_LIST,
    name, obj,
});
//------------------------------------------------
export var addToSelection = (name, obj) => ({
    type: ADD_TO_SELECTION,
    name, obj,
});
export var remFromSelection = (name, obj) => ({
    type: REM_FROM_SELECTION,
    name, obj,
});
export var toggleSelection = (name, obj) => ({
    type: TOGGLE_SELECTION,
    name, obj,
});
//------------------------------------------------
export var setRemovedList = (name, list) => ({
    type: SET_REMOVED_LIST,
    name, list,
});
//------------------------------------------------

