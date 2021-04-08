import React, {useEffect, useState} from "react";
import {sparqlEndpoint} from "./sparql";

const Q = (uri) => `
  SELECT ?s ?p ?o 
  WHERE {
    GRAPH ?g {
        <${uri}> ?p ?o .
      BIND (<${uri}> as ?s) .
    }
  }
`;

const ResourceDetail = ({uri}) => {
    const [resource, setResource] = useState(null);

    useEffect(() => {
        sparqlEndpoint(Q(uri)).then((res) => {
            setResource(res.results.bindings);
        });
    }, [uri]);

    return <div>
        <h1>Resource Detail</h1>
            {uri}
            {JSON.stringify(resource)}
    </div>
}

export default ResourceDetail;