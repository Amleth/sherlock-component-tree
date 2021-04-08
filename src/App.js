import Tree from './components/tree/Tree'
import ResourceDetail from './ResourceDetail'
import React, {Fragment} from "react";
import { useSelector } from 'react-redux'

const App = () => {
    const baseUri = 'http://data-iremus.huma-num.fr/id/f553985e-477b-4277-bed2-3b0491d133ab';
    const uri = useSelector(state => state.currentUri.value);
    return <Fragment>
        <Tree uri={baseUri}/>
        <ResourceDetail uri={uri ? uri : baseUri}/>
    </Fragment>
}

export default App