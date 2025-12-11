# Sydnet.Studio

# Test af kode
Udover at vi har lavet en 5 minutters video, hvor vi gennemgår og testen koden, så er der følgende måder hvormed I selv kan teste koden.

Vi anbefaler dog, at gå ud fra vores 5 minutters video, da begge test løsninger er lidt omfattende.

**Løsning 1**
# 1.1 Domæne navn
Mulighed 1 er bare at tilgå vores webapplikation på nettet, via vores domæne navn "sydnet.studio".
Dette vil giver jer mulighed for at teste applikationen en del af vejen. 

# 1.2 Log ind
Først vil I blive mødt af vores log ind side, og her kan I logge ind som en af vores 2 brugere, via nederstående mail og adgangskode:
Bruger Anna: 
Email: anna@understory.dk
Password: anna123

Bruger Tim:
Email: tim@understory.dk
Password: tim123

# 1.3 Forside
Her vil I blive mødt af den præcis samme side som vi fremviser i vores video
Dog vil I med denne løsning ikke have mulighed for, at sende beskeder ligesom det er fremvist i videoen. Dette skyldes at vi har fjernet Twilio SID, Token og Telefon nummer fra .env filen. 

Så for at få dette til at virke, så skal I bruge information fra jeres egen Twilio konto, og sætte det ind i en .env fil
Skabelon:
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

Når I sender en besked fra vores samarbejde side, så vil jeres besked ende hos en fra vores gruppe, og vil vi derfra kunne svare frem og tilbage.


**Løsning 2**
# 2.1 Test lokalt
Den anden mulighed der er, er at teste vores applikation lokalt på jeres egen computer
I den version vi har aflevert, har vi valgt at slette node_modules for at minske størrelsen på filen vi afleverer. 
Derfor skal I starte med at skrive "npm install" i terminalen i VS:

# 2.2 NPM pakker
Her er en liste over de npm pakker vi har installeret, og disse skal installeres for at sikre at applikationen kan kører lokalt hos jer: 
├── axios@1.13.2
├── bcrypt@6.0.0
├── bcryptjs@3.0.3
├── cookie-parser@1.4.7
├── crypto@1.0.1
├── debug@2.6.9
├── dotenv@16.6.1
├── express-rate-limit@8.2.1
├── express@4.21.2
├── helmet@8.1.0
├── http-proxy@1.18.1
├── morgan@1.10.1
└── twilio@5.10.6

# 2.3 Twilio Keys
Ligesom i mulighed 1, vil I skulle oprette og tilføje jeres egne Twilio keys i en .env:
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# 2.4 Start server og gå til browser
For at starte serveren, skal I blot skrive "npm start" i terminalen(I en stig der peger på "gruppeprojekt" filen).
Herefter vil serveren køre, og I kan nu søge på http://localhost:3000/, for at gå til forsiden som er vores log-ind side.

# 2.5 Udskiftning af telefonnumre
For at indsætte jeres egne telefonnumre til koden, kan I tilgå vores twilio.js fil linje 28-29

# 2.6 Log ind
I kan her igen bruge samme log ind info som i mulighed 1:
Bruger Anna: 
Email: anna@understory.dk
Password: anna123

Bruger Tim:
Email: tim@understory.dk
Password: tim123


