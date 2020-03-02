# "Den svartmunnade smörbultens banne"
Detta är ett REST-API som uppfyller CRUD funktionallitet. Applikationen är byggd med Nodejs, Express, javascript och MongoDB.
Applikationen är produktsatt på Heroku och går att hitta på följande URL: https://fish-catch-rest-api.herokuapp.com/

## Mest använda scripts

### Installera server dependencies
`npm install`

### Starta servern
`npm run start`

Servern startar på port 3000

### Starta servern med nodemon
`npm run devstart`

Servern startar på port 3000

## Testning
Testning av applikationen görs via en Postman Collection och Newman
För att köra testerna gör följande:
Öppna applikationen i en terminal eller IDE. 
Navigera till /Postman

Kör kommandot: `newman run FISHAPI.postman_collection.json -e fish_catch_api.postman_environment.json`