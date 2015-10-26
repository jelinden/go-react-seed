package middleware

import (
	"encoding/json"
	"fmt"
	"runtime"

	"github.com/jelinden/go-react-seed/domain"
	"github.com/jelinden/go-react-seed/redis"
	"github.com/jelinden/selfjs"
	"github.com/labstack/echo"
)

func CheckAdmin(redis *redis.Redis, bundle string) echo.Middleware {
	return func(c *echo.Context) error {
		loginCookie, err := c.Request().Cookie("login")
		if err != nil {
			fmt.Println("cookie was empty", err)
		} else {
			session := redis.GetSession(loginCookie.Value)
			sUser := domain.User{}
			json.Unmarshal([]byte(session), &sUser)
			if sUser.Role.Name == "admin" {
				return nil
			}
		}
		return echo.NewHTTPError(403, selfjs.PageAsString(runtime.NumCPU(), bundle, "{\"err\":\"You are not logged in or the stars don't shine for you.\"}", c.Response().Writer(), c.Request()))
	}
}
