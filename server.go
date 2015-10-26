package main

import (
	"crypto/sha512"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"runtime"
	"time"

	"encoding/base64"

	"golang.org/x/crypto/pbkdf2"

	"github.com/jelinden/go-react-seed/domain"
	"github.com/jelinden/go-react-seed/middleware"
	r "github.com/jelinden/go-react-seed/redis"
	"github.com/jelinden/selfjs"
	"github.com/labstack/echo"
	mw "github.com/labstack/echo/middleware"
	"github.com/rs/cors"
	"github.com/thoas/stats"
)

func NewApplication() *Application {
	return &Application{}
}

type HTTPError struct {
	code    int
	message string
}

type Application struct {
	Redis *r.Redis
}

func (e *HTTPError) Error() string {
	return e.message
}

func (a *Application) Init() {
	a.Redis = r.NewRedis()
	a.Redis.Init()
}

func (a *Application) createUser(c *echo.Context) error {
	role := domain.Role{Name: domain.Normal}
	if a.Redis.DbSize() == 0 {
		role = domain.Role{Name: domain.Admin}
	}
	user := &domain.User{
		Id:                      c.Form("Id"),
		Username:                c.Form("Username"),
		Password:                a.HashPassword([]byte(c.Form("Password")), []byte(c.Form("Id"))),
		CreateDate:              time.Now().UTC(),
		EmailVerified:           false,
		EmailVerificationString: a.HashPassword([]byte(c.Form("Id")), []byte(time.Now().String())),
		Role: role,
	}
	userJSON, err := json.Marshal(user)
	if err != nil {
		fmt.Println(err)
	} else {
		a.Redis.AddUser(user.Id, string(userJSON))
		return c.Redirect(302, "/")
	}
	return c.Redirect(302, "/redirect?status=failed")
}

func (a *Application) login(c *echo.Context) error {
	id := c.Form("Id")
	user := a.Redis.GetUser(id)
	password := a.HashPassword([]byte(c.Form("Password")), []byte(id))
	sessionKey := a.HashPassword([]byte(id), []byte(user.CreateDate.String()))
	if user.Password == password {
		http.SetCookie(c.Response(), &http.Cookie{Name: "login", Value: sessionKey, MaxAge: 2592000})
	}
	userAsJson, _ := json.Marshal(user)
	a.Redis.Put(sessionKey, string(userAsJson))
	return c.Redirect(302, "/")
}

func (a *Application) getUsersData() domain.Data {
	data := domain.Data{}
	data.Users = a.Redis.ListUsers()
	return data
}
func (a *Application) listUsers() domain.Data {
	return a.getUsersData()
}

func (a *Application) listUsersAPI(c *echo.Context) error {
	loginCookie, err := c.Request().Cookie("login")
	if err != nil {
		fmt.Println("cookie was empty", err)
	} else {
		session := a.Redis.GetSession(loginCookie.Value)
		sUser := domain.User{}
		json.Unmarshal([]byte(session), &sUser)

		if sUser.Role.Name == "admin" {
			return c.JSON(http.StatusOK, a.getUsersData())
		}
	}
	var m = make(map[string]string)
	m["Err"] = "You are not logged in or the stars don't shine for you."
	return c.JSON(http.StatusForbidden, m)
}

func (a *Application) userAPI(c *echo.Context) error {
	return c.JSON(http.StatusOK, a.Redis.GetUser(c.P(0)))
}

func (a *Application) logout(c *echo.Context) error {
	loginCookie, err := c.Request().Cookie("login")
	if err != nil {
		fmt.Println(err)
	} else {
		a.Redis.RemoveSession(loginCookie.Value)
		http.SetCookie(c.Response(), &http.Cookie{Name: "login", MaxAge: -1})
	}
	return c.Redirect(302, "/")
}

func (a *Application) errorHandler(err error, c *echo.Context) {
	c.Response().Header().Set("Content-Type", "text/html; charset=utf-8")
	fmt.Fprint(c.Response().Writer(), err.Error())
}

func main() {
	runtime.GOMAXPROCS(runtime.NumCPU())
	app := NewApplication()
	app.Init()
	e := echo.New()

	e.Use(middleware.HttpLogger())
	e.HTTP2()
	e.SetHTTPErrorHandler(app.errorHandler)
	e.Use(mw.Recover())
	e.Use(mw.Gzip())
	e.StripTrailingSlash()
	e.Use(cors.Default().Handler)
	/* TODO: logs too much
	newrelickey, found := os.LookupEnv("NEWRELICKEY")
	if found == true {
		gorelic.InitNewRelicAgent(newrelickey, "go-register-login", true)
		e.Use(gorelic.Handler())
	}
	*/
	s := stats.New()
	e.Use(s.Handler)

	e.Get("/stats", func(c *echo.Context) error {
		return c.JSON(http.StatusOK, s.Data())
	})

	e.Favicon("public/favicon.ico")
	e.Static("/public/css", "public/css")
	e.Static("/universal.js", "./build/bundle.js")

	bundle, _ := ioutil.ReadFile("./build/bundle.js")
	user, _ := json.Marshal(domain.User{})
	e.Get("/", selfjs.New(runtime.NumCPU(), string(bundle), string(user)))
	e.Get("/register", selfjs.New(runtime.NumCPU(), string(bundle), string(user)))

	admin := e.Group("/members")
	admin.Use(middleware.CheckAdmin(app.Redis, string(bundle)))
	admin.Get("", selfjs.New(runtime.NumCPU(), string(bundle), app.listUsers()))

	e.Get("/api/users", app.listUsersAPI)
	e.Get("/api/user/:id", app.userAPI)
	e.Post("/register", app.createUser)
	e.Get("/logout", app.logout)
	e.Get("/login", selfjs.New(runtime.NumCPU(), string(bundle), string(user)))
	e.Post("/login", app.login)
	fmt.Println("Starting server at port 3000")
	e.Run(":3000")
}

func (a *Application) HashPassword(password, salt []byte) string {
	return base64.URLEncoding.EncodeToString(pbkdf2.Key(password, salt, 4096, sha512.Size, sha512.New))
}
