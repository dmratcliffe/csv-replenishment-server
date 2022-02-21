import React from 'react';
import './app.css';
import {Provider} from 'react-redux';
import { createStore } from 'redux';
import reducers from './redux/reducers';
import ButtonsNav from './containers/ButtonsNav';
import { setList } from './redux/actions';
import NavController from './components/nav/NavController';
import { PAGE_REPLENISHMENT, LIST_NAME_MASTER, LIST_NAME_NEEDS, LIST_NAME_REPLEN } from './functions/Constants';

import navheight from 'browsernavbarheight'; //note: this is a css variable to solve some mobile browser issues.
import APICalls from './functions/APICalls';

const store = createStore(reducers);
const unsubscribe = store.subscribe(() => console.log("Store:", store.getState())); //for debugging

//test data for frontend.
var data = [{ "name": "Archaeopteryx Tank Womens Black XL", "code": "L07179600050", "inventory": "1.00" }, { "name": "Archaeopteryx T-Shirt SS Mens Black M", "code": "L07179300030", "inventory": "2.00" }, { "name": "Archaeopteryx T-Shirt SS Mens Black S", "code": "L07179300020", "inventory": "2.00" }, { "name": "Archaeopteryx T-Shirt SS Mens Sambal L", "code": "L07278400040", "inventory": "5.00" }, { "name": "Archaeopteryx T-Shirt SS Mens Sambal M", "code": "L07278400030", "inventory": "1.00" }, { "name": "ArcWord T-Shirt SS Mens 24K Black S", "code": "L07276700020", "inventory": "2.00" }, { "name": "ArcWord T-Shirt SS Womens Black L", "code": "L07178900040", "inventory": "2.00" }, { "name": "ArcWord T-Shirt SS Womens Morganite M", "code": "L07278300030", "inventory": "7.00" }, { "name": "ArcWord T-Shirt SS Womens Morganite XL", "code": "L07278300050", "inventory": "4.00" }, { "name": "Atom LT Hoody Mens Pilot M", "code": "L07126500030", "inventory": "15.00" }, { "name": "Atom LT Hoody Mens Pilot S", "code": "L07126500020", "inventory": "6.00" }, { "name": "Atom LT Hoody Mens Tui M", "code": "L07126800030", "inventory": "4.00" }, { "name": "Atom LT Hoody Womens Hard Coral S", "code": "L07125200020", "inventory": "7.00" }, { "name": "Atom LT Hoody Womens Zaffre M", "code": "L07125300030", "inventory": "9.00" }, { "name": "Atom SL Vest Mens Black L", "code": "L07003900040", "inventory": "1.00" }, { "name": "Beta SL Hybrid Jacket Womens Rad L", "code": "L06848500040", "inventory": "6.00" }, { "name": "Camosun Parka Mens Katalox M", "code": "L06910900030", "inventory": "1.00" }, { "name": "CAP B.A.C. Cap Black L-XL", "code": "L05795900001", "inventory": "39.00" }, { "name": "CAP Bird Cap Dark Navy NA", "code": "L07176100001", "inventory": "2.00" }, { "name": "Conveyor Belt Conifer L", "code": "L07135600040", "inventory": "1.00" }, { "name": "Conveyor Belt Conifer S", "code": "L07135600020", "inventory": "8.00" }, { "name": "Conveyor Belt Midnight S L", "code": "L07195400040", "inventory": "1.00" }, { "name": "Conveyor Belt Midnight S M", "code": "L07195400030", "inventory": "3.00" }, { "name": "Conveyor Belt Proteus S", "code": "L07135700020", "inventory": "6.00" }, { "name": "Covert Cardigan Mens Pegasus He L", "code": "L07246900040", "inventory": "8.00" }, { "name": "Gamma LT Pant Mens Black M", "code": "L06857300030", "inventory": "2.00" }, { "name": "Gamma MX Hoody Womens Shorepine XS", "code": "L07066500010", "inventory": "7.00" }, { "name": "Gamma MX Pant Womens Marianas 8", "code": "L06687600004", "inventory": "4.00" }, { "name": "Lefroy Pant Mens Mongoose 32-32", "code": "L07136000008", "inventory": "7.00" }, { "name": "Phase AR Crew LS Womens Azalea M", "code": "L06912200030", "inventory": "1.00" }, { "name": "Phase AR Zip Neck LS Mens Proteus M", "code": "L07224800030", "inventory": "3.00" }, { "name": "Playground T-Shirt SS Mens Midnight S M", "code": "L07185200030", "inventory": "1.00" }, { "name": "SHOES ACRUX SL M Toreador/Pilote 7", "code": "L06965200026", "inventory": "1.00" }];

//populate data arrays
store.dispatch(setList("replen", data)) //for debugging use
APICalls.Listing.list(LIST_NAME_REPLEN, (data)=>store.dispatch(setList(LIST_NAME_REPLEN, data)));
APICalls.Listing.list(LIST_NAME_NEEDS, (data)=>store.dispatch(setList(LIST_NAME_NEEDS, data)));
APICalls.Listing.list(LIST_NAME_MASTER, (data)=>store.dispatch(setList(LIST_NAME_MASTER, data)));

function App() {
  return (
    <Provider store={store} className="app">
      <ButtonsNav/>
      <NavController page={PAGE_REPLENISHMENT} />
    </Provider>
  );
}

export default App;
