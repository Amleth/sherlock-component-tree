/** @jsxImportSource @emotion/react */
import React, {useCallback, useEffect, useReducer, useRef, useState} from "react";

import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import {useDispatch} from 'react-redux'

import {style} from "./tree.css";
import {sparqlEndpoint} from "./sparql";
import CustomTreeItem from "./CustomTreeItem";
import {propertiesToSkipAsSparqlFilter} from "./common";

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
    const [selectedItem, setSelectedItem] = useState(null);

    /* setSelectedItem cannot be used as UseEffect dependency, has to use setSelectedItemString as intermediate
    https://stackoverflow.com/questions/55808749/use-object-in-useeffect-2nd-param-without-having-to-stringify-it-to-json
    https://twitter.com/dan_abramov/status/1104414272753487872
     */
    const [selectedItemString, setSelectedItemString] = useState('');
    const [loadedUri, setLoadedUri] = useState([]);

    const dispatch = useDispatch();
    const setSelectedItemCallback = (value) => {
        setSelectedItem(value);
        setSelectedItemString(JSON.stringify(value));
    }

    useEffect(() => {
        sparqlEndpoint(Q(uri)).then((res) => {
            setTreeData(res.results.bindings);
        });
    }, [uri]);

    useEffect(() => {
        if (selectedItem && !loadedUri.includes(selectedItem.o)) {
            dispatch({
                type: "SELECT_ITEM",
                payload: selectedItem.o
            });
            sparqlEndpoint(Q(selectedItem.o)).then(res => {
                treeData.push(...res.results.bindings);
                setTreeData(treeData);
                setLoadedUri([...loadedUri, selectedItem.o])
            })
        }

    }, [selectedItemString, selectedItem, loadedUri, treeData, dispatch]);


    return (
        <div css={style}>
            <h1>{uri}</h1>
            <div>Item sélectionné : {JSON.stringify(selectedItem)}</div>
            <TreeView
                defaultCollapseIcon={<ExpandMoreIcon/>}
                defaultExpandIcon={<ChevronRightIcon/>}
            >
                <CustomTreeItem treeData={treeData} setSelectedItem={setSelectedItemCallback} uri={uri} loadedUri={loadedUri}/>
            </TreeView>
        </div>
    );
};

export default Tree;
