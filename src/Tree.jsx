/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import React, {useCallback, useEffect, useRef, useState} from "react";

import {makeStyles} from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";

import {style} from "./tree.css";
import {sparqlEndpoint} from "./sparql";

const Q = (uri) => `
  SELECT ?s ?p ?o ?g
  WHERE {
    GRAPH ?g {
      <${uri}> ?p ?o .
      BIND (<${uri}> as ?s) .
    }
  }
`;

const Tree = ({uri}) => {
    const [treeData, setTreeData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loadedUri, setLoadedUri] = useState([]);

    useEffect(() => {
        sparqlEndpoint(Q(uri)).then((res) => {
            setTreeData(res.results.bindings);
        });
        console.log(treeData);
    }, [uri]);

    useEffect(() => {
        if (selectedItem && ! loadedUri.includes(selectedItem.o)) {
            console.log("selecteditem", selectedItem);
            sparqlEndpoint(Q(selectedItem.o)).then(res => {
                treeData.push(...res.results.bindings);
                setTreeData(treeData);
                setLoadedUri([...loadedUri, selectedItem.o])
            })
        }
    }, [JSON.stringify(selectedItem)]);


    return (
        <div css={style}>
            <div>Item sélectionné : {JSON.stringify(selectedItem)}</div>
            <TreeView>
                {treeData.map((child) => {
                    const id = [child.s.value, child.p.value, child.o.value, child.g.value];
                    return (
                        <TreeItem
                            key={id}
                            nodeId={id.toString()}
                            label={child.p.value + " — " + child.o.value}
                            onClick={(e) => {
                                setSelectedItem({s: child.s.value, p: child.p.value, o: child.o.value, g: child.g.value});
                            }}
                        />
                    );
                })}
            </TreeView>
        </div>
    );
};

export default Tree;
