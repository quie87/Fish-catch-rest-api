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

För att kunna köra applikationen i egen produktion krävs det en del konfiguration. I denna applikationen används mongoDB. Skapa ett konto och sätt upp en databas enligt strukturen som finns i mappen "models".
Lägg till en .env fil och i den spara "DB_KEY='dindatabassträng' ".

Du behöver ha en jwt secret för auth.
I .env filen, lägg till "jwtSecret='dinslumpadesecret'".

På flera ställen i koden referas anrop till "baseurl", det är din lokala server.
Ange i .env filen "baseurl='http://localhost:3000'", då detta är den port som applikationen är inställd på.

### Testning

I projektet testades APIet med hjälp av en postman collection. Denna är kopplad till produktionsapplikationen och har därför tagits bort från detta repot.
