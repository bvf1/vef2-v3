# Vefforritun 2, 2022. Verkefni 3: Viðburðakerfis vefþjónustur

Til er Stjórnenda aðgangur

notendanafn admin

lykilorð 123

### Notendaumsjón, vefþjónustur

- `/users/login`
  - `POST` með notandanafni og lykilorði skilar token ef gögn rétt

Log in with username and password and get a Bearer Token

> curl -vH "Content-Type: application/json" -d '{ "username": "admin", "password": "123"}' POST http://localhost:3000/users/login

{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ2NDI3MDMxLCJleHAiOjE2NDY0NDcwMzF9.-BQgb479GX8dpU-NrvJpavKKcPWt53L9SBJ7mkHtpv0"}

Use the token when user needs to be logged in to execute methods

- `/users/`
  - `GET` skilar síðu af notendum, aðeins ef notandi sem framkvæmir er stjórnandi

curl -H 'Accept: application/json' -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ2NDI3MDMxLCJleHAiOjE2NDY0NDcwMzF9.-BQgb479GX8dpU-NrvJpavKKcPWt53L9SBJ7mkHtpv0" http://localhost:3000/users/

[{"id":1,"name":"Jón Jónsson","username":"admin","admin":true},{"id":2,"name":"Forvitinn forritari","username":"forritari","admin":false},{"id":3,"name":"Guðrún Guðrúnar","username":"gunna","admin":false}]

- `/users/:id`

  - `GET` skilar notanda, aðeins ef notandi sem framkvæmir er stjórnandi

  curl -H 'Accept: application/json' -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ2NDI3MDMxLCJleHAiOjE2NDY0NDcwMzF9.-BQgb479GX8dpU-NrvJpavKKcPWt53L9SBJ7mkHtpv0" http://localhost:3000/users/2

{"id":2,"name":"Forvitinn forritari","username":"forritari","password":"$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii","admin":false}

- `/users/register`

  - `POST` staðfestir og býr til notanda. Skilar auðkenni og nafn. Notandi sem búinn er til skal aldrei vera stjórnandi

  curl -vH "Content-Type: application/json" -d '{"name": "Tommi Tómatur","username": "tommi","password": "123"}' http://localhost:3000/users/register

  Notandi búinn til
  Nafn: Tommi Tómatur

- Connection #0 to host localhost left intact
  Notendanafn: tommi

- `/users/me`

  - `GET` skilar upplýsingum um notanda sem á token, auðkenni og nafn, aðeins ef notandi innskráður

  curl -H 'Accept: application/json' -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ2NDI3MDMxLCJleHAiOjE2NDY0NDcwMzF9.-BQgb479GX8dpU-NrvJpavKKcPWt53L9SBJ7mkHtpv0" http://localhost:3000/users/me

{"username":"admin","name":"Jón Jónsson"}

### Viðburðir

- `/events/`

  - `GET` skilar síðu af viðburðum
    curl -vH "Content-Type: application/json" http://localhost:3000/events

  - `POST` býr til vibðurð, aðeins ef innskráður notandi
    curl -H 'Accept: application/json' -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ2NDMyMzE0LCJleHAiOjE2NDY0NTIzMTR9.1PEbSHUPRIzxCdrzwN6irQ3MYNQjrKbFgODk5fylhVA" -d '{"name" : "Lets go code","description" : "coding is fun"}' http://localhost:3000/events/

fæ [{"value":"","msg":"Nafn má ekki vera tómt","param":"name","location":"body"}] en þetta virkar á póstman

- `/events/:id`
  - `GET` skilar viðburð

curl -H 'Accept: application/json' http://localhost:3000/events/2

{"id":2,"name":"Hönnuðahittingur í mars","slug":"honnudahittingur-i-mars","description":"Spennandi hittingur hönnuða í Hönnunarmars.","userid":1,"created":"2022-03-04T20:13:56.794Z","updated":"2022-03-04T20:13:56.794Z"}

- `PATCH` uppfærir viðburð, a.m.k. eitt gildi, aðeins ef notandi bjó til viðburð eða er stjórnandi

curl -X PATCH -H 'Accept: application/json' -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ2NDMyMzE0LCJleHAiOjE2NDY0NTIzMTR9.1PEbSHUPRIzxCdrzwN6irQ3MYNQjrKbFgODk5fylhVA" -d '{description: ""}' http://localhost:3000/events/5

{"id":1,"name":"Forritarahittingur í febrúar","slug":"forritarahittingur-i-februar","description":"","userid":1,"created":"2022-03-04T20:13:56.794Z","updated":"2022-03-04T22:48:06.901Z"}

- `DELETE` eyðir viðburð, aðeins ef notandi bjó til viðburð eða er stjórnandi

curl -X DELETE -H 'Accept: application/json' -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ2NDMyMzE0LCJleHAiOjE2NDY0NTIzMTR9.1PEbSHUPRIzxCdrzwN6irQ3MYNQjrKbFgODk5fylhVA" http://localhost:3000/events/1

Atburður var eyddur

### Skráningar

- `/events/:id/register`

  - `POST` skráir notanda á viðburð, aðeins ef innskráður notandi

  curl -X POST -H 'Accept: application/json' -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ2NDMyMzE0LCJleHAiOjE2NDY0NTIzMTR9.1PEbSHUPRIzxCdrzwN6irQ3MYNQjrKbFgODk5fylhVA" -d '{ description:""}' http://localhost:3000/events/3/register

[{"event":3,"comment":""}]

- `DELETE` afskráir notanda af viðburði, aðeins ef innskráður notandi og til skráning

curl -X DELETE -H 'Accept: application/json' -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ2NDMyMzE0LCJleHAiOjE2NDY0NTIzMTR9.1PEbSHUPRIzxCdrzwN6irQ3MYNQjrKbFgODk5fylhVA" -d '{ description:""}' http://localhost:3000/events/3/register

"Þú ert ekki lengur skráður á viðburðinn"
