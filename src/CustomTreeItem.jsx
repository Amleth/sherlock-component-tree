/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import React, {useCallback, useEffect, useRef, useState} from "react";

import {style} from "./tree.css";
import {Label} from "@material-ui/icons";
import StyledTreeItem from "./StyledTreeItem";

const CustomTreeItem = ({treeData, setSelectedItem, uri, loadedUri}) => {
    if (treeData && treeData.length) {
        const currentNodeChildren = treeData.filter(node => node.s.value === uri);
        return (
            <div>
                {currentNodeChildren.map((child) => {
                        const id = [child.s.value, child.p.value, child.o.value, child.g.value];
                        return (
                            <StyledTreeItem
                                key={Math.random()}
                                nodeId={id.toString()}
                                labelText={child.p.value + " — " + child.o.value}
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
    return null;
}

export default CustomTreeItem;
