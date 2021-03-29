/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import React, {useCallback, useEffect, useRef, useState} from "react";

import {style} from "./tree.css";
import {Label} from "@material-ui/icons";
import StyledTreeItem from "./StyledTreeItem";

const CustomTreeItem = (props) => {
    if (props.treeData && props.treeData.length) {
        const currentNodeChildren = props.treeData.filter(node => node.s.value === props.uri);
        return (
            <div css={style}>
                {currentNodeChildren.map((child) => {
                        const id = [child.s.value, child.p.value, child.o.value, child.g.value];
                        return (
                            <StyledTreeItem
                                key={id}
                                nodeId={id.toString()}
                                labelText={child.p.value + " — " + child.o.value}
                                labelInfo={child.count.value}
                                labelIcon={Label}
                                onClick={child.count.value > 0 ?
                                    () => {
                                        props.setSelectedItem({
                                            s: child.s.value,
                                            p: child.p.value,
                                            o: child.o.value,
                                            g: child.g.value
                                        });
                                    } : null}
                            >
                                {child.count.value > 0 ?
                                    <CustomTreeItem treeData={props.treeData} setSelectedItem={props.setSelectedItem}
                                                    uri={child.o.value} loadedUri={props.loadedUri}/> : null}
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
