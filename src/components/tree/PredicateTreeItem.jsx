import StyledTreeItem from "../../StyledTreeItem";
import React from "react";
import {ArrowLeft, ArrowRight, Label} from "@material-ui/icons";
import CircularProgress from "@material-ui/core/CircularProgress";
import {useDispatch} from "react-redux";
import {getResourcePredicates, getResourcesByPredicateAndLinkedResource} from "./treeSlice";
import IriTreeItem from "./IriTreeItem";
import LiteralTreeItem from "./LiteralTreeItem";

const PredicateTreeItem = ({path, predicate, relatedUri}) => {

    const dispatch = useDispatch();
    return <StyledTreeItem
        labelIcon={computeLabelIcon(predicate)}
        labelInfo={predicate.c.value}
        nodeId={path}
        labelText={predicate.p.value}
        onClick={() => {
            dispatch(getResourcesByPredicateAndLinkedResource({p: predicate.p.value, uri: relatedUri}))
        }}
    >
        {predicate.resources && predicate.resources.map(resource => {
            return resource.r.type === 'uri'
                ? <IriTreeItem path={`${path} / ${resource.r.value}`} uri={resource.r.value}/>
                : <LiteralTreeItem path={`${path} / ${resource.r.value}`} literal={resource.r} />
        })
        }
        {! predicate.resources && <CircularProgress/>}

    </StyledTreeItem>
}

function computeLabelIcon(predicate) {
    return predicate.direction.value === 'o' ? ArrowRight : ArrowLeft;
}

export default PredicateTreeItem;