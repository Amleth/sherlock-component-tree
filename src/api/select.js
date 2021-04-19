import {propertiesToSkipAsSparqlFilter} from "../common";
import {sparqlEndpoint} from "../sparql";

export const getUriChildren = async (uri) =>
    await sparqlEndpoint(`
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

  SELECT ?s ?p ?o ?g ?type (count(distinct ?children) as ?count)
  WHERE {
      {
          BIND (<${uri}> as ?s) .
          GRAPH ?g {
              ?s ?p ?o .
              OPTIONAL {
                  ?o rdf:type ?type 
              }
              OPTIONAL {
                  ?o ?p2 ?children
                  ${propertiesToSkipAsSparqlFilter("?p2")}
              }
              ${propertiesToSkipAsSparqlFilter("?p")}
          }
      }
      UNION
      {
          BIND (<${uri}> as ?o) .
          GRAPH ?g {
              ?s ?p ?o .
              OPTIONAL {
                  ?o rdf:type ?type 
              }
              OPTIONAL {
                  ?o ?p2 ?children
                  ${propertiesToSkipAsSparqlFilter("?p2")}
              }
              ${propertiesToSkipAsSparqlFilter("?p")}
          }
      }
  }
  GROUP BY ?s ?p ?o ?g ?type
`);
