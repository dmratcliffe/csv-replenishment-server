import React from 'react';
import { PAGE_REPLENISHMENT, PAGE_NEED_FROM_BACK, PAGE_SCANNER } from '../../functions/Constants';
import ReplenList from '../../containers/ReplenList';
import NeedsList from '../../containers/NeedsList';

import { connect } from 'react-redux'

function NavController(props) {
    switch (props.page) {
        case PAGE_REPLENISHMENT:
            return (<ReplenList />);
        case PAGE_NEED_FROM_BACK:
            return (<NeedsList />);
        case PAGE_SCANNER:
            return (<></>); //Update broke scanner, removed....
        default:
            return "";
    }
}

const mapStateToProps = (state) => ({
    page: state.nav
})


export default connect(mapStateToProps)(NavController);
