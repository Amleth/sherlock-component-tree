const propertiesToSkip = [
    "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
    //"<http://purl.org/dc/terms/created>"
]

export const isAPropertyToSkip = (property) => {
    return propertiesToSkip.includes(property);
}

export const isUri = (string) => {
    return string.startsWith("http://data-iremus.huma-num.fr/");
}

export const propertiesToSkipAsSparqlFilter = (variableName) => {
    return propertiesToSkip.map(property => {
        return "FILTER (" + variableName + " != "+ property +")";
    }).join('. ');
}