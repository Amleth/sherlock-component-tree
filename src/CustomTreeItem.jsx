import React, {useCallback, useEffect, useRef, useState} from "react";

import {Label} from "@material-ui/icons";
import StyledTreeItem from "./StyledTreeItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import {useDispatch} from "react-redux";
import {fetchUri, selectUri} from "./components/tree/oldTreeSlice";

const CustomTreeItem = ({treeData, uri}) => {
    const dispatch = useDispatch();
    if (treeData && treeData.length) {
        const currentNodeChildren = treeData.filter(node => node.s.value === uri || node.o.value === uri);
        if (!currentNodeChildren.length) {
            return <CircularProgress/>;
        }
        return (
            <div>
                {currentNodeChildren.map((child) => {
                        const id = [child.s.value, child.p.value, child.o.value, child.g.value];
                        return (
                            <StyledTreeItem
                                /*
                                This will generate a warning, since MuiTransitions use findDOMNode which is deprecated in StrictMode
                                https://github.com/mui-org/material-ui/issues/13394
                                 */
                                key={id.toString()}
                                nodeId={id.toString()}
                                labelText={computeLabelText(child, uri)}
                                labelInfo={child.count.value}
                                labelIcon={Label}
                                onClick={() => {
                                    dispatch(selectUri(getChildUri(child,uri)))
                                    dispatch(fetchUri(getChildUri(child,uri)))
                                }}
                            >
                                {child.count.value > 0 &&
                                <CustomTreeItem treeData={treeData}
                                                uri={getChildUri(child,uri)}/>}
                            </StyledTreeItem>
                        );
                    }
                )}
            </div>
        );
    }
    return <CircularProgress/>;

    function getChildUri(child, uri) {
        return uri === child.o.value ? child.s.value : child.o.value;
    }

    function computeLabelText(child, uri) {
        return uri === child.o.value ? "<- (" + child.p.value + ") " + child.s.value : "-> (" + child.p.value + ") " + child.o.value
    }
}

export default CustomTreeItem;
