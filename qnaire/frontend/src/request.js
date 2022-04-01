import { useEffect } from "react";
import { getAuthHeader, getToken } from "./auth";

const BASE_PATH = "/api/";

function handleErrors(response) {
  if (!response.ok) {
    return response.text().then((text) => {
      throw new Error(text);
    });
  }
  return response.text(); //not using response.json(), because it wouldn't work if no content was returned from server
}

export function GET(enpoint, auth = true) {
  return fetchWithoutContent("GET", enpoint, auth);
}

export function DELETE(enpoint, auth = true) {
  return fetchWithoutContent("DELETE", enpoint, auth);
}

function fetchWithoutContent(method, endpoint, auth = true) {
  return fetch(`${BASE_PATH}${endpoint}/`, {
    method,
    headers: {
      ...(auth && { Authorization: getAuthHeader() }),
    },
  })
    .then(handleErrors)
    .then((text) => (text.length ? JSON.parse(text) : {}))
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
    .then((text) => (text.length ? JSON.parse(text) : {}))
    .then((data) => {
      console.log(data);
      return data; //this will be the argument of the next .then()
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
}
