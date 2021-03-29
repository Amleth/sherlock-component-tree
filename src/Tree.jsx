/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import React, {useCallback, useEffect, useRef, useState} from "react";

import {makeStyles} from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import {style} from "./tree.css";
import {sparqlEndpoint} from "./sparql";
import CustomTreeItem from "./CustomTreeItem";
import {propertiesToSkipAsSparqlFilter} from "./common";

const Q = (uri) => `
  SELECT ?s ?p ?o ?g (count(distinct ?children) as ?count)
  WHERE {
    GRAPH ?g {
      <${uri}> ?p ?o .
      OPTIONAL {?o ?p2 ?children
            ${propertiesToSkipAsSparqlFilter("?p2")}
        } .
      ${propertiesToSkipAsSparqlFilter("?p")}
      BIND (<${uri}> as ?s) .
    }
  }
  GROUP BY ?s ?p ?o ?g
`;

const Tree = ({uri}) => {
    const [treeData, setTreeData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loadedUri, setLoadedUri] = useState([]);

    useEffect(() => {
        console.log(Q(uri));
        sparqlEndpoint(Q(uri)).then((res) => {
            setTreeData(res.results.bindings);
        });
    }, [uri]);

    useEffect(() => {
        if (selectedItem && !loadedUri.includes(selectedItem.o)) {
            sparqlEndpoint(Q(selectedItem.o)).then(res => {
                treeData.push(...res.results.bindings);
                setTreeData(treeData);
                setLoadedUri([...loadedUri, selectedItem.o])
            })
        }

    }, [JSON.stringify(selectedItem)]);


    return (
        <div css={style}>
            <h1>{uri}</h1>
            <div>Item sélectionné : {JSON.stringify(selectedItem)}</div>
            <TreeView
                defaultCollapseIcon={<ExpandMoreIcon/>}
                defaultExpandIcon={<ChevronRightIcon/>}
            >
                <CustomTreeItem treeData={treeData} setSelectedItem={setSelectedItem} uri={uri} loadedUri={loadedUri}/>
            </TreeView>
        </div>
    );
};

export default Tree;
