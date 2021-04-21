/** @jsxImportSource @emotion/react */
import React, {useCallback, useEffect, useRef, useState} from "react";

import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import {useDispatch, useSelector} from 'react-redux'

import {style} from "../../tree.css";
import {rootSet, getResourceIdentity, selectResourceByUri, pathUnfolded, pathUnfoldStatusChanged} from "./treeSlice";
import IriTreeItem from "./IriTreeItem";

const Tree = ({uri}) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(rootSet(uri));
        dispatch(pathUnfoldStatusChanged(uri));
        dispatch(getResourceIdentity(uri));
    }, [uri]);

    return (
        <div css={style}>
            <h1>{uri}</h1>
            <div>Item sélectionné : {JSON.stringify(uri)}</div>
            <TreeView
                defaultCollapseIcon={<ExpandMoreIcon/>}
                defaultExpandIcon={<ChevronRightIcon/>}
            >
                <IriTreeItem path="" uri={uri}/>
            </TreeView>
        </div>
    );
};

export default Tree;
