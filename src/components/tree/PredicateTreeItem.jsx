import StyledTreeItem from "../../StyledTreeItem";
import React from "react";
import {ArrowLeft, ArrowRight, Label} from "@material-ui/icons";
import CircularProgress from "@material-ui/core/CircularProgress";
import {useDispatch, useSelector} from "react-redux";
import {
    getResourcesByPredicateAndLinkedResource,
    pathUnfoldStatusChanged
} from "./treeSlice";
import IriTreeItem from "./IriTreeItem";
import LiteralTreeItem from "./LiteralTreeItem";

const PredicateTreeItem = ({path, predicate, relatedUri}) => {

    const dispatch = useDispatch();
    const unfoldedPaths = useSelector(state => state.tree.unfoldedPaths);

    return <StyledTreeItem
        labelIcon={computeLabelIcon(predicate)}
        labelInfo={predicate.c.value}
        nodeId={`${path}${predicate.p.value},`}
        labelText={predicate.p.value}
        onClick={() => {
            dispatch(getResourcesByPredicateAndLinkedResource({p: predicate.p.value, uri: relatedUri}))
            dispatch(pathUnfoldStatusChanged(`${path}${predicate.p.value},`))

        }}
    >
        {canShowItem(predicate, unfoldedPaths, path) && predicate.resources.map(resource => {
            return resource.r.type === 'uri'
                ? <IriTreeItem path={`${path}${predicate.p.value},`} key={`${path}${predicate.p.value},${resource.r.value},`} uri={resource.r.value}/>
                : <LiteralTreeItem path={`${path}${predicate.p.value},`} key={`${path}${predicate.p.value},${resource.r.value},`} literal={resource.r} />
        })
        }
        {! predicate.resources && <CircularProgress/>}

    </StyledTreeItem>
}

function computeLabelIcon(predicate) {
    return predicate.direction.value === 'o' ? ArrowRight : ArrowLeft;
}

function canShowItem(predicate, unfoldedPaths, path) {
    return predicate.resources && (unfoldedPaths.includes(path));
}

export default PredicateTreeItem;