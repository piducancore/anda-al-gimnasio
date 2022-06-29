const nodeFetch = require("node-fetch");
const fetchCookie = require("fetch-cookie");
const fetch = fetchCookie(nodeFetch);

exports.apiClient = async function (endpoint, params) {
  console.log({ endpoint, params });
  const response = await fetch("https://alumnossportlifezonasur.mastererp.cl" + endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      Referer: "https://alumnossportlifezonasur.mastererp.cl/system/reservar.php",
    },
    body: new URLSearchParams(params).toString(),
    credentials: "include",
  });
  const data = await response.json();
  console.log({ data });
  return data;
};
