import { useEffect } from "react";
import { getAuthHeader, getToken } from "./auth";

const BASE_PATH = "/api/";

function handleErrors(response) {
  //not using response.json(), because it wouldn't work if no content was returned from server
  let promise = response
    .text()
    .then((text) => (text.length ? JSON.parse(text) : {}));

  if (!response.ok) {
    if (response.status >= 500) {
      window.location = "/500";
      return;
    }
    promise = promise.then((data) => {
      return Promise.reject(data); //I want to pass the data and new Error() accepts only a string message
    });
  }
  return promise;
}

export function GET(enpoint, auth = true, params = null) {
  return fetchWithoutContent("GET", enpoint, auth, params);
}

export function DELETE(enpoint, auth = true) {
  return fetchWithoutContent("DELETE", enpoint, auth);
}

function fetchWithoutContent(method, endpoint, auth = true, params = null) {
  let url = `${BASE_PATH}${endpoint}/`;
  if (params) {
    url += `?${Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&")}`;
  }
  return fetch(url, {
    method,
    headers: {
      ...(auth && { Authorization: getAuthHeader() }),
    },
  })
    .then(handleErrors)
    .then((data) => {
      console.log(data);
      return data; //this will be the argument of the next .then()
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
}

export function POST(endpoint, values, auth = true) {
  return fetchWithContent("POST", endpoint, values, auth);
}

export function PATCH(endpoint, values, auth = true) {
  return fetchWithContent("PATCH", endpoint, values, auth);
}

export function PUT(endpoint, values, auth = true) {
  return fetchWithContent("PUT", endpoint, values, auth);
}

function fetchWithContent(method, endpoint, values, auth = true) {
  return fetch(`${BASE_PATH}${endpoint}/`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(auth && { Authorization: getAuthHeader() }),
    },
    body: JSON.stringify(values),
  })
    .then(handleErrors)
    .then((data) => {
      console.log(data);
      return data; //this will be the argument of the next .then()
    })
    .catch((data) => {
      console.log(data);
      return Promise.reject(data);
    });
}
