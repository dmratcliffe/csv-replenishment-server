import { connect } from 'react-redux'
import ButtonList from '../components/buttonlist/ButtonList'
import { remFromList, addToList, toggleSelection, remFromSelection, setRemovedList } from '../redux/actions'
import { LIST_NAME_REPLEN, LIST_NAME_NEEDS } from '../functions/Constants'
import APICalls from '../functions/APICalls'
// import { seperateWomensMensUnisex } from '../functions/UsefulFunctions'



const mapStateToProps = (state) => ({
    item_list: state.lists[LIST_NAME_REPLEN] || [],
    selected: state.selected[LIST_NAME_REPLEN] || [],
    removed: state.removed[LIST_NAME_REPLEN] || []
})

const mapDispatchToProps = dispatch => {
    return {
        toggle_select: (item) => {
            dispatch(toggleSelection(LIST_NAME_REPLEN, item));
        },
        recover_removed: (items) => {
            items.forEach(item => {
                //add to list on server
                //if success add to list we are looking at
                dispatch(addToList(LIST_NAME_REPLEN, item))
                APICalls.Listing.add(LIST_NAME_REPLEN, item, ()=>{
                    //TODO: remove successful from list
                });
            });
            //set removed to remaining items in list (in case there was errors.)
                //this should result in emptyness.
            dispatch(setRemovedList(LIST_NAME_REPLEN, []))
        },
        buttons: [
            {
                name: "Remove",
                func: (items) => {
                    items.forEach(item => {
                        dispatch(remFromList(LIST_NAME_REPLEN, item))
                        dispatch(remFromSelection(LIST_NAME_REPLEN, item))
                        APICalls.Listing.remove(LIST_NAME_REPLEN, item, () => {
                        });
                    });
                    dispatch(setRemovedList(LIST_NAME_REPLEN, items))
                },
            },
            {
                name: "Need",
                func: (items) => {
                    items.forEach(item => {
                        dispatch(addToList(LIST_NAME_NEEDS, item))
                        dispatch(remFromList(LIST_NAME_REPLEN, item))
                        dispatch(remFromSelection(LIST_NAME_REPLEN, item))
                        APICalls.Listing.add(LIST_NAME_NEEDS, item, () => {
                            APICalls.Listing.remove(LIST_NAME_REPLEN, item, () => {
                            })
                        })
                    });
                },
            },
        ],
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonList);