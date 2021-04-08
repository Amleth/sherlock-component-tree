import React, {useCallback, useEffect, useRef, useState} from "react";

import {Label} from "@material-ui/icons";
import StyledTreeItem from "./StyledTreeItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import {useDispatch} from "react-redux";
import {select} from "./components/tree/treeSlice";

const CustomTreeItem = ({treeData, setSelectedItem, uri, loadedUri}) => {
    const dispatch = useDispatch();
    if (treeData && treeData.length) {
        const currentNodeChildren = treeData.filter(node => node.s.value === uri);
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
                                labelText={computeLabelText(child)}
                                labelInfo={child.count.value}
                                labelIcon={Label}
                                onClick={() => {
                                    dispatch(select(child.o.value))
                                }}
                            >
                                {child.count.value > 0 &&
                                <CustomTreeItem treeData={treeData}
                                                uri={child.o.value} loadedUri={loadedUri}/>}
                            </StyledTreeItem>
                        );
                    }
                )}
            </div>
        );
    }
    return <CircularProgress/>;

    function computeLabelText(child) {
        return child.type ? child.p.value + " — " + child.o.value + " --" + child.type.value : child.p.value + " — " + child.o.value + " --";
    }
}

export default CustomTreeItem;
