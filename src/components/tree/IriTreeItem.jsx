import StyledTreeItem from "../../StyledTreeItem";
import React from "react";
import {Label} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {getResourcePredicates, selectResourceByUri} from "./treeSlice";
import CircularProgress from "@material-ui/core/CircularProgress";
import PredicateTreeItem from "./PredicateTreeItem";

const IriTreeItem = ({path, uri}) => {
    const dispatch = useDispatch();
    const resource = useSelector(state => selectResourceByUri(state, uri));

    console.log("resource");
    return resource ? <StyledTreeItem
        key={path}
        nodeId={path}
        labelText={resource.id}
        labelInfo={resource.identity.length ? resource.identity[0].c.value : 0}
        labelIcon={Label}
        onClick={() => {
            dispatch(getResourcePredicates(resource.id))
            //fold/unfold
        }}
    >
        {
            //clickedItems.includes(path)
            resource.predicates && resource.predicates.map(predicate =>
                <PredicateTreeItem
                    key={`${path}/${predicate.p.value}`}
                    relatedUri={resource.id}
                    path={`${path}/${predicate.p.value}`}
                    predicate={predicate}
                />)
        }
        {
            resource.identity.length && !resource.predicates && <CircularProgress/>
        }
    </StyledTreeItem> : <CircularProgress/>
}
export default IriTreeItem;