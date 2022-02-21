
import { connect } from 'react-redux'
import Buttons from '../components/buttons/Buttons'
import { setNav, setList } from '../redux/actions'
import { PAGE_REPLENISHMENT, PAGE_NEED_FROM_BACK, PAGE_SCANNER, LIST_NAME_REPLEN, LIST_NAME_NEEDS } from '../functions/Constants'
import APICalls from '../functions/APICalls'

const mapStateToProps = (state) => ({
    selected: state.nav,
})

const mapDispatchToProps = (dispatch) => {
    return {
        list: [
            {
                name: PAGE_REPLENISHMENT,
                func: ()=>{
                    APICalls.Listing.list(LIST_NAME_REPLEN, (data) => dispatch(setList(LIST_NAME_REPLEN, data)));
                    dispatch(setNav(PAGE_REPLENISHMENT))
                },
            },
            {
                name: PAGE_NEED_FROM_BACK,
                func: ()=>{
                    APICalls.Listing.list(LIST_NAME_NEEDS, (data) => dispatch(setList(LIST_NAME_NEEDS, data)));
                    dispatch(setNav(PAGE_NEED_FROM_BACK))
                },
            },
            {
                name: PAGE_SCANNER,
                func: ()=>{

                    dispatch(setNav(PAGE_SCANNER))
                },
            },
        ],
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Buttons);