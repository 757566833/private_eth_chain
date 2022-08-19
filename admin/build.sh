set GOARCH=amd64
set GOOS=linux  
go build .\main.go

# powershell
$Env:GOARCH = "amd64"
$Env:GOOS = "linux"
go build .\main.go

#mac
GOOS=linux GOARCH=amd64 go build main.go