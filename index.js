const express = require("express");
const axios = require("axios");
const rateLimit = require("axios-rate-limit");

const app = express();
const PORT = 3000;

const IP_STACK_URL = "http://api.ipstack.com";
const IP_STACK_KEY = process.env.IP_STACK_KEY;
const IP_INFO_URL = "http:/ipinfo.io";
const IP_INFO_KEY = process.env.IP_INFO_KEY;
const MAX_HOURLY_REQUESTS = process.env.MAX_HOURLY_REQUESTS;

const IPV4_REGEX = "^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(.(?!$)|$)){4}$";

function should_use_ipstack() {
  return true;
}

app.locals.cache = {};
app.locals.ipstack_client = rateLimit(axios.create(), {
  maxRequests: MAX_HOURLY_REQUESTS,
  perMilliseconds: 3600000,
});
app.locals.ipinfo_client = rateLimit(axios.create(), {
  maxRequests: MAX_HOURLY_REQUESTS,
  perMilliseconds: 3600000,
});

app.get("/ips_country/:ip", (req, res) => {
  const ip = req.params.ip;
  if (!ip.match(IPV4_REGEX)) {
    res.status(400);
    res.send();
    return;
  }
  if (ip in app.locals.cache) {
    const country_name = app.locals.cache[ip];
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cached-Response", "true");
    res.end(JSON.stringify({ country: country_name }));
    return;
  }
  if (should_use_ipstack()) {
    app.locals.ipstack_client
      .get(`${IP_STACK_URL}/${ip}?access_key=${IP_STACK_KEY}`)
      .then((response) => {
        const country_name = response.data.country_name;
        app.locals.cache[ip] = country_name;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ country: country_name }));
      });
  } else {
    app.locals.ipinfo_client
      .get(`${IP_INFO_URL}/${ip}?token=${IP_INFO_KEY}`)
      .then((response) => {
        const country_name = response.data.country;
        app.locals.cache[ip] = country_name;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ country: country_name }));
      });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
