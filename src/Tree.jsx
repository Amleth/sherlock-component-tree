/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useEffect, useRef, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";

import { style } from "./tree.css";
import { sparqlEndpoint } from "./sparql";

const Q = (uri) => `
  SELECT *
  WHERE {
    GRAPH ?g {
      <${uri}> ?p ?o
    }
  }
`;

const Tree = ({ uri }) => {
  const [treeData, setTreeData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    sparqlEndpoint(Q(uri)).then((res) => {
      setChildren(res.results.bindings);
    });
  }, [uri]);

  return (
    <div css={style}>
      <div>Itel sélectionné : {selectedItem}</div>
      <TreeView>
        {children.map((child) => {
          const id = [child.g.value, child.p.value, child.o.value];
          return (
            <TreeItem
              key={id}
              nodeId={id.toString()}
              label={child.p.value + " — " + child.o.value}
              onClick={(e) => {
                setSelectedItem([child.g.value, child.p.value, child.o.value]);
              }}
            />
          );
        })}
      </TreeView>
    </div>
  );
};

export default Tree;
