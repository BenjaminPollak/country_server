# IP To Country Server

This is a server that will give you the country associated with an IP address.

The only endpoint available takes this form: `localhost:3000/ips_country/<your_ip>`.

Below are some example requests and responses.

## Example 1

```
curl http://localhost:3000/ips_country/151.25.185.91
```

will return

```
{"country": "IT"}
```

or

```
{"country": "Italy"}
```

## Example 2

```
http://localhost:3000/ips_country/207.100.5.101
```

will return

```
{"country": "US"}
```

or

```
{"country": "United States"}
```

# Running The Server

1. Obtain API keys for [IP Stack](https://ipstack.com/) and [IP Info](https://ipinfo.io/)

2. Open a terminal, and navigate to where you have downloaded this code. Continue to work in this terminal.

3. Run `npm install` to install dependencies needed.

4. Set the environment variable `IP_STACK_KEY` to your api key for IP Stack

5. Set the environment variable `IP_INFO_KEY` to your api key for IP Info

6. Run `npm run start` to start the server.

This server relies on the function called `should_use_ipstack` to choose which service to use for IP-to-country translation. In the current implementation, I simply return `true`. Returning `true` means IP Stack will be used when the server is running. Returning `false` means IP Info will be used when the server is running.

# Design Decisions

## IP to Country Providers

The two IP to Country providers I used are below:

- [IP Stack](https://ipstack.com/)
- [IP Info](https://ipinfo.io/)

## Libraries

I chose to use Axios and Express, as these sped up development and are industry standard tools.

## Simple Cache

I implemented a caching mechanism that simply uses a JSON object attached to my express app.

# Further Work

Given that I was instructed to limit myself to two hours of effort and my expertise in backend lie more with Python and Golang, there were several crucial items I didn't get to. I will go through each and describe what I would have done.

## Implement should_use_ipstack

Currently, this function is only stubbed out. I would implement this, probably leveraging the solution described below in `Per-Vendor Global Configurable Rate Limit`.

## Per-Vendor Global Configurable Rate Limit

I started working on this but did not complete it. Had I had more time, I likely would have implemented a fixed window solution.

## Testing

I would have written test cases in Jest. I would have written the following test cases:

- Send a request with an invalid ip address. Expect a 400 response.
- Send a request with a valid ip address that had not yet been seen. Expect a 200 response, a correct country code/name, and no header indicating the data was retrieved from the cache (using a mock for IP-to-country service)
- Send a request with a valid ip address that had not yet been seen. Expect a 200 response, a correct country code/name, and a header indicating the data was retrieved from the cache

## IP Address Validation and IPv6

In this exercise, I chose to use a RegEx because I knew I could validate the solution was working relatively quickly. I would prefer to avoid writing production grade software with regular expressions, so I would have instead used an algorithmic approach to validate a string represented an IP address.

In this implementation, I also only support IPv4 addresses. In a more robust implementation of this tool, I would add support for IPv6 addresses.

## Error Handling

There are a number of errors I can think of that are not well-handled in this implementation. Ones I have not yet mentioned relate to the connection between this server and the third party services used. I would return a 500 error code for any such error.
