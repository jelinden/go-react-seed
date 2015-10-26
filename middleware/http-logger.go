package middleware

import (
	"log"
	"net"
	"os"
	"time"

	"github.com/labstack/echo"
)

type Logger interface {
	Print(val ...interface{})
	Printf(format string, val ...interface{})
}

func HttpLogger() echo.MiddlewareFunc {
	return func(h echo.HandlerFunc) echo.HandlerFunc {
		return func(c *echo.Context) error {
			req := c.Request()
			res := c.Response()

			originIP, _, _ := net.SplitHostPort(req.RemoteAddr)
			if originIP == "" {
				originIP = req.Header.Get("X-Forwarded-For")
			}

			start := time.Now()
			if err := h(c); err != nil {
				c.Error(err)
			}
			stop := time.Now()
			method := req.Method
			path := req.URL.Path
			if path == "" {
				path = "/"
			}
			size := res.Size()
			code := res.Status()

			f, err := os.OpenFile("logs/access.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
			if err != nil {
				log.Fatal("error opening file: %v", err)
			}
			defer f.Close()
			logger := log.New(f, "", log.LstdFlags)
			logger.SetOutput(f)
			logger.Printf("%s %s %s %d %s %d", originIP, method, path, code, stop.Sub(start), size)
			return nil
		}
	}
}
