# Golang Reactjs seed

A seed project for making isomorphic or universal Reactjs applications with a Golang backend.

Rendering on the Golang side is made with V8. See https://github.com/jelinden/selfjs and https://github.com/ry/v8worker.

## Echo as a server

As a server we are using echo (https://github.com/labstack/echo), which is super fast, easy to use, and easily extensible framework. As an example to extensibility, there is a log middleware which logs access log to it's own log file. Also checking rights for admin user is checked with an own middleware.

## Redis as database

As a database we are using Redis for both sessions and users. Sessions are saved for 4 weeks while users are saved with no expiration.

## Running

```npm install && npm run build && go build && ./go-react-seed```

or

```bash start-app.sh```

## TODO

* Assets versioning
* Member page is not informational to others than admin user, don't show it to others
* Verification of new user with email
* Forgot my password functionality
* Running with Raspberry pi
