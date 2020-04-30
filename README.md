# "Den svartmunnade smörbultens banne"

Detta är ett REST-API som uppfyller CRUD funktionallitet. Applikationen är byggd med Nodejs, Express, javascript och MongoDB.
Applikationen är produktionssatt på Heroku och går att hitta på följande URL: https://fish-catch-rest-api.herokuapp.com/

Detta är en uppgift som har utförts under högskoleutbildning.

## Mest använda scripts

### Installera server dependencies

`npm install`

### Starta servern

`npm run start`

Servern startar på port 3000

### Starta servern med nodemon

`npm run devstart`

Servern startar på port 3000

### Vid körning av egen server

Det är tillåtet att clona/ladda ner denna applikationen för privat bruk.
Du behöver i detta fall lägga till en egen .env fil i root med egna nycklar för MongoDB och JWT secret

På flera ställen i koden referas anrop till "baseurl", det är din lokala server.
Ange i .env filen "baseurl='http://localhost:3000'", då detta är den port som applikationen är inställd på.

### Testning

I projektet testades APIet med hjälp av en postman collection. Denna är kopplad till produktionsapplikationen och har därför tagits bort från detta repot.
