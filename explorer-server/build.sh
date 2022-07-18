set GOARCH=amd64
set GOOS=linux  
go build .\main.go

# powershell
$Env:GOARCH = "amd64"
$Env:GOOS = "linux"
go build .\main.go