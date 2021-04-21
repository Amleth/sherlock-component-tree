import StyledTreeItem from "../../StyledTreeItem";
import React from "react";
import {Label} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {getResourcePredicates, pathUnfoldStatusChanged, selectResourceByUri} from "./treeSlice";
import CircularProgress from "@material-ui/core/CircularProgress";
import PredicateTreeItem from "./PredicateTreeItem";

const IriTreeItem = ({path, uri}) => {
    const dispatch = useDispatch();
    const resource = useSelector(state => selectResourceByUri(state, uri));
    const unfoldedPaths = useSelector(state => state.tree.unfoldedPaths);

    return canShowItem(resource, unfoldedPaths, path) ?  <StyledTreeItem
        nodeId={`${path}${resource.id},`}
        labelText={resource.id}
        labelInfo={resource.identity.length ? resource.identity[0].c.value : 0}
        labelIcon={Label}
        onClick={() => {
            dispatch(getResourcePredicates(resource.id))
            dispatch(pathUnfoldStatusChanged(`${path}${resource.id},`));
        }}
    >
        {
            //clickedItems.includes(path)
            resource.predicates && resource.predicates.map(predicate =>
                <PredicateTreeItem
                    key={`${path},${resource.id},${predicate.p.value}`}
                    relatedUri={resource.id}
                    path={`${path}${resource.id},`}
                    predicate={predicate}
                />)
        }
        {
            resource.identity.length && !resource.predicates && <CircularProgress/>
        }
    </StyledTreeItem> : <CircularProgress/>
}


function canShowItem(resource, unfoldedPaths, path) {
    console.log(unfoldedPaths)
    console.log(path)
    return resource && (unfoldedPaths.includes(path) || !path);
}

export default IriTreeItem;