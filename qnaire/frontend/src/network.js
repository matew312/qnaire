import { useEffect } from "react";
import { getAuthHeader, getToken } from "./auth";

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export function GET(endpoint, callback, auth = true, errorCallback = null) {
  fetchWithoutContent("GET", endpoint, callback, auth, errorCallback);
}

export function DELETE(endpoint, callback, auth = true, errorCallback = null) {
  fetchWithoutContent("DELETE", endpoint, callback, auth, errorCallback);
}

function fetchWithoutContent(
  method,
  endpoint,
  callback,
  auth = true,
  errorCallback = null
) {
  if (auth && !getToken()) {
    return;
  }

  fetch(`/api/${endpoint}/`, {
    method,
    headers: {
      ...(auth && { Authorization: getAuthHeader() }),
    },
  })
    .then(handleErrors)
    .then((response) => response.text()) //not using response.json(), because it wouldn't work if no content was returned from server
    .then((text) => (text.length ? JSON.parse(text) : {}))
    .then((data) => {
      console.log(data);
      callback(data);
    })
    .catch((err) => {
      console.log(err);
      if (errorCallback) {
        errorCallback(err);
      }
    });
}

export function POST(
  endpoint,
  values,
  callback,
  auth = true,
  errorCallback = null
) {
  fetchWithContent("POST", endpoint, values, callback, auth, errorCallback);
}

export function PATCH(
  endpoint,
  values,
  callback,
  auth = true,
  errorCallback = null
) {
  fetchWithContent("PATCH", endpoint, values, callback, auth, errorCallback);
}

export function PUT(
  endpoint,
  values,
  callback,
  auth = true,
  errorCallback = null
) {
  fetchWithContent("PUT", endpoint, values, callback, auth, errorCallback);
}

function fetchWithContent(
  method,
  endpoint,
  values,
  callback,
  auth = true,
  errorCallback = null
) {
  if (auth && !getToken()) {
    return;
  }

  fetch(`/api/${endpoint}/`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(auth && { Authorization: getAuthHeader() }),
    },
    body: JSON.stringify(values),
  })
    .then(handleErrors)
    .then((response) => response.text())
    .then((text) => (text.length ? JSON.parse(text) : {}))
    .then((data) => {
      console.log(data);
      callback(data);
    })
    .catch((err) => {
      console.log(err);
      if (errorCallback) {
        errorCallback(err);
      }
    });
}
