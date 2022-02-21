import axios from 'axios';
import { HOST_NAME } from '../Constants';
import {Listing} from './Listing';

const api = axios.create({
  baseURL: HOST_NAME + '',
});


var APICalls = {
    Listing: new Listing(api),
}

export default APICalls;
