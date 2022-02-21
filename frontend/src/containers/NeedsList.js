import { connect } from 'react-redux'
import ButtonList from '../components/buttonlist/ButtonList'
import { remFromList, addToList, toggleSelection, remFromSelection, setList, setRemovedList } from '../redux/actions'
import { LIST_NAME_NEEDS } from '../functions/Constants'
import APICalls from '../functions/APICalls'
// import { seperateWomensMensUnisex } from '../functions/UsefulFunctions'



const mapStateToProps = (state) => ({
    item_list: state.lists[LIST_NAME_NEEDS] || [],
    selected: state.selected[LIST_NAME_NEEDS] || [],
    removed: state.removed[LIST_NAME_NEEDS] || []
})

const mapDispatchToProps = dispatch => {
    return {
        toggle_select: (item) => {
            dispatch(toggleSelection(LIST_NAME_NEEDS, item));
        },
        recover_removed: (items) => {
            items.forEach(item => {
                //add to list on server
                //if success add to list we are looking at
                APICalls.Listing.add(LIST_NAME_NEEDS, item, ()=>{
                    dispatch(addToList(LIST_NAME_NEEDS, item))
                    //TODO: remove successful from list
                });
            });
            //set removed to remaining items in list (in case there was errors.)
                //this should result in emptyness.
            dispatch(setRemovedList(LIST_NAME_NEEDS, []))
        },
        buttons: [
            {
                name: "Remove",
                func: (items) => {
                    items.forEach(item => {
                        APICalls.Listing.remove(LIST_NAME_NEEDS, item, (data) => {
                            dispatch(remFromList(LIST_NAME_NEEDS, item))
                            dispatch(remFromSelection(LIST_NAME_NEEDS, item))
                        })

                    });
                    dispatch(setRemovedList(LIST_NAME_NEEDS, items))
                },
            },
            {
                name: "Refresh",
                func: () => {
                    APICalls.Listing.list(LIST_NAME_NEEDS, (data) => dispatch(setList(LIST_NAME_NEEDS, data)));
                },
            },
        ],
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonList);