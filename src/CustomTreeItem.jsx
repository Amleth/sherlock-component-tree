import React, {useCallback, useEffect, useRef, useState} from "react";

import {Label} from "@material-ui/icons";
import StyledTreeItem from "./StyledTreeItem";
import CircularProgress from "@material-ui/core/CircularProgress";

const CustomTreeItem = ({treeData, setSelectedItem, uri, loadedUri}) => {

    if (treeData && treeData.length) {
        const currentNodeChildren = treeData.filter(node => node.s.value === uri);
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
                                labelText= {computeLabelText(child)}
                                labelInfo={child.count.value}
                                labelIcon={Label}
                                onClick={child.count.value > 0 ?
                                    () => {
                                        setSelectedItem({
                                            s: child.s.value,
                                            p: child.p.value,
                                            o: child.o.value,
                                            g: child.g.value
                                        });
                                    } : null}
                            >
                                {child.count.value > 0 &&
                                    <CustomTreeItem treeData={treeData} setSelectedItem={setSelectedItem}
                                                    uri={child.o.value} loadedUri={loadedUri}/>}
                            </StyledTreeItem>
                        );
                    }
                )}
            </div>
        );
    }
    return <CircularProgress />;

    function computeLabelText(child) {
        return child.type ? child.p.value + " — " + child.o.value + " --" + child.type.value : child.p.value + " — " + child.o.value + " --";
    }
}

export default CustomTreeItem;
