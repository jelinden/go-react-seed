package email

import (
	"log"
	"net/smtp"
)

var verficationLink = "http://go-react-seed.uutispuro.fi/verify/"
var mime = "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"

func SendVerificationEmail(emailTo, hash, fromEmail, passwd string) {
	message := "From: " + fromEmail + "\n" +
		"To: " + emailTo + "\n" +
		"Subject: Please verify your new account\n" +
		mime +
		"Please verify your account with following link:<br/>" +
		"<a href=\"" + verficationLink + hash + "\">Verify</a>.<br/><br/>" +
		"If you received this message without registering to go-react-seed.uutispuro.fi," +
		" you can delete the message."

	sendEmail(emailTo, message, fromEmail, passwd)
}

func sendEmail(emailTo, message, fromEmail, passwd string) {
	auth := smtp.PlainAuth(
		"",
		fromEmail,
		passwd,
		"smtp.gmail.com",
	)
	err := smtp.SendMail(
		"smtp.gmail.com:587",
		auth,
		fromEmail,         // from
		[]string{emailTo}, // to
		[]byte(message),
	)
	if err != nil {
		log.Println(err)
	}
}
