package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"runtime"
	"time"

	"github.com/jelinden/go-react-seed/app/domain"
	"github.com/jelinden/go-react-seed/app/email"
	"github.com/jelinden/go-react-seed/app/middleware"
	r "github.com/jelinden/go-react-seed/app/redis"
	"github.com/jelinden/selfjs"
	"github.com/labstack/echo"
	mw "github.com/labstack/echo/middleware"
	"github.com/rs/cors"
	"github.com/thoas/stats"
)

var fromEmail, emailSendingPasswd string

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
	userEmail := c.Form("Id")
	valid := domain.ValidateEmail(userEmail)
	if valid {
		role := domain.Role{Name: domain.Normal}

		if a.Redis.DbSize() == 0 {
			role = domain.Role{Name: domain.Admin}
		}

		hashedId := domain.ShaHashString(userEmail)
		user := &domain.User{
			Id:                      hashedId,
			Email:                   userEmail,
			Username:                c.Form("Username"),
			Password:                domain.HashPassword([]byte(c.Form("Password")), []byte(userEmail)),
			CreateDate:              time.Now().UTC(),
			EmailVerified:           false,
			EmailVerificationString: domain.HashPassword([]byte(userEmail), []byte(time.Now().String())),
			Role: role,
		}
		userJSON, err := json.Marshal(user)
		if err != nil {
			fmt.Println(err)
		} else {
			err := a.Redis.AddNewUser(user.Id, string(userJSON))
			if err == nil {
				email.SendVerificationEmail(user.Email,
					hashedId+"/"+user.EmailVerificationString,
					fromEmail,
					emailSendingPasswd)
				return c.Redirect(302, "/")
			}
		}
	} else {
		return c.Redirect(302, "/register?email=err")
	}
	return c.Redirect(302, "/?status=failed")
}

func (a *Application) login(c *echo.Context) error {
	id := c.Form("Id")
	user := a.Redis.GetUser(domain.ShaHashString(id))
	password := domain.HashPassword([]byte(c.Form("Password")), []byte(id))
	sessionKey := domain.HashPassword([]byte(id), []byte(user.CreateDate.String()))
	if user.Password == password {
		http.SetCookie(c.Response(), &http.Cookie{Name: "login", Value: sessionKey, MaxAge: 2592000})
		userAsJson, err := json.Marshal(user)
		if err != nil {
			fmt.Println(err)
		} else {
			a.Redis.Put(sessionKey, string(userAsJson))
			return c.Redirect(302, "/")
		}
	} else {
		fmt.Println("not a match")
	}

	return c.Redirect(302, "/login?failed=true")
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
	return c.JSON(http.StatusOK, a.Redis.GetUser(domain.ShaHashString(c.P(0))))
}

func (a *Application) verifyEmail(c *echo.Context) error {
	user := a.Redis.GetUser(c.P(0))
	fmt.Println(c.P(0))
	fmt.Println(user)
	if user.EmailVerificationString == c.P(1) {
		user.EmailVerified = true
		user.EmailVerifiedDate = time.Now().UTC()
		user.ModifyDate = time.Now().UTC()
		userJSON, err := json.Marshal(user)
		if err != nil {
			fmt.Println(err)
		} else {
			a.Redis.UpdateUser(user.Id, string(userJSON))
		}
		return c.Redirect(302, "/login?verified=true")
	}
	return c.Redirect(302, "/login?verified=false")
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
	fromEmail = os.Getenv("FROMEMAIL")
	emailSendingPasswd = os.Getenv("EMAILSENDINGPASSWD")
	if fromEmail == "" || emailSendingPasswd == "" {
		log.Fatal("FROMEMAIL or EMAILSENDINGPASSWD was not set")
	}
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
	e.Get("/login", selfjs.New(runtime.NumCPU(), string(bundle), string(user)))

	admin := e.Group("/members")
	admin.Use(middleware.CheckAdmin(app.Redis, string(bundle)))
	admin.Get("", selfjs.New(runtime.NumCPU(), string(bundle), app.listUsers()))

	e.Get("/api/users", app.listUsersAPI)
	e.Get("/api/user/:id", app.userAPI)
	e.Get("/verify/:id/:hash", app.verifyEmail)
	e.Post("/register", app.createUser)
	e.Get("/logout", app.logout)
	e.Post("/login", app.login)
	fmt.Println("Starting server at port 3300")
	e.Run(":3300")
}
