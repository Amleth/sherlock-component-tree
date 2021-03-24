export const sparqlEndpoint = async query => {
    let res = await fetch(process.env.REACT_APP_SHEROCK_SPARQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      mode: 'cors',
      cache: 'no-cache',
      redirect: 'follow',
      body: `query=${encodeURIComponent(query)}`,
    })
    res = await res.json()
    return res
  }