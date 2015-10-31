package domain

import (
	"crypto/sha1"
	"crypto/sha512"
	"encoding/base64"
	"encoding/hex"

	"golang.org/x/crypto/pbkdf2"
)

func HashPassword(password, salt []byte) string {
	return base64.URLEncoding.EncodeToString(pbkdf2.Key(password, salt, 4096, sha512.Size, sha512.New))
}

func ShaHashString(hashable string) string {
	h := sha1.New()
	h.Write([]byte(hashable))
	return hex.EncodeToString(h.Sum(nil))
}
