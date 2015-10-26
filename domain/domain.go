package domain

import "time"

const Admin = "admin"
const Normal = "normal"

type Data struct {
	Users []User
	Err   string
}
type User struct {
	Id                      string
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
