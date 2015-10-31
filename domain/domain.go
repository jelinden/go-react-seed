package domain

import (
	"fmt"
	"time"
)

const Admin = "admin"
const Normal = "normal"

type Data struct {
	Users []User
	Err   string
}
type User struct {
	Id                      string
	Email                   string
	Username                string
	Password                string
	Role                    Role
	EmailVerified           bool
	EmailVerificationString string
	EmailVerifiedDate       time.Time
	CreateDate              time.Time
	ModifyDate              time.Time
}

type Role struct {
	Name string
}

type CustomError struct {
	Type    string
	Message string
}

func (e CustomError) Error() string {
	return fmt.Sprintf("%v: %v", e.Type, e.Message)
}
