import Tree from './components/tree/Tree'
import ResourceDetail from './ResourceDetail'
import React, {Fragment} from "react";
import {useDispatch, useSelector} from 'react-redux'
import {fetchUri} from "./components/tree/treeSlice";

const App = () => {
    const baseUri = 'http://data-iremus.huma-num.fr/id/f553985e-477b-4277-bed2-3b0491d133ab';
    const uri = useSelector(state => state.tree.selectedUri);
    console.log(uri)
    return <Fragment>
        <Tree uri={baseUri}/>
        <ResourceDetail uri={uri ? uri : baseUri}/>
    </Fragment>
}

export default App