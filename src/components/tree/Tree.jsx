/** @jsxImportSource @emotion/react */
import React, {useCallback, useEffect, useReducer, useRef, useState} from "react";

import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import {useDispatch, useSelector} from 'react-redux'

import {style} from "../../tree.css";
import {sparqlEndpoint} from "../../sparql";
import CustomTreeItem from "../../CustomTreeItem";
import {propertiesToSkipAsSparqlFilter} from "../../common";
import * as common from "../../common";

const Q = (uri) => `
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

  SELECT ?s ?p ?o ?g ?type (count(distinct ?children) as ?count)
  WHERE {
    GRAPH ?g {
      <${uri}> ?p ?o .
      
      OPTIONAL {
        ?o rdf:type ?type 
      }
      OPTIONAL {
        ?o ?p2 ?children
        ${propertiesToSkipAsSparqlFilter("?p2")}
      }
      ${propertiesToSkipAsSparqlFilter("?p")}
      BIND (<${uri}> as ?s) .
    }
  }
  GROUP BY ?s ?p ?o ?g ?type
`;

const Tree = ({uri}) => {
    const [treeData, setTreeData] = useState([]);
    const selectedItem = useSelector(state => state.currentUri.value);
    const [loadedUri, setLoadedUri] = useState([]);

    useEffect(() => {
        sparqlEndpoint(Q(uri)).then((res) => {
            setTreeData(res.results.bindings);
        });
    }, [uri]);

    useEffect(() => {
        if (selectedItem && common.isUri(selectedItem) && !loadedUri.includes(selectedItem)) {
            setTimeout(() => sparqlEndpoint(Q(selectedItem)).then(res => {
                treeData.push(...res.results.bindings);
                setTreeData(treeData);
                setLoadedUri([...loadedUri, selectedItem])
            }), 1000);
        }

    }, [selectedItem, loadedUri, treeData]);


    return (
        <div css={style}>
            <h1>{uri}</h1>
            <div>Item sélectionné : {JSON.stringify(selectedItem)}</div>
            <TreeView
                defaultCollapseIcon={<ExpandMoreIcon/>}
                defaultExpandIcon={<ChevronRightIcon/>}
            >
                <CustomTreeItem treeData={treeData} uri={uri} loadedUri={loadedUri}/>
            </TreeView>
        </div>
    );
};

export default Tree;
