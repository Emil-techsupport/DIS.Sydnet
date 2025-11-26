# Test Guide: JWT Token

## ✅ Test 1: Login og få JWT token

### Via Browser (Nemmes metode):

1. **Start serveren:**
   ```bash
   npm start
   ```

2. **Åbn browser og gå til:**
   ```
   http://localhost:3000
   ```

3. **Log ind med:**
   - Email: `anna@understory.dk`
   - Password: `anna123`

4. **Tjek i Browser DevTools:**
   - Åbn DevTools (F12)
   - Gå til "Application" tab (Chrome) eller "Storage" tab (Firefox)
   - Klik på "Cookies" → `http://localhost:3000`
   - Du skal se en cookie kaldet `jwt` med en lang streng
   - ✅ Hvis du ser `jwt` cookie = Token er oprettet!

5. **Tjek i Console:**
   - Du skal se: `Velkommen Anna!`
   - Du bliver automatisk redirected til `/forside`
   - ✅ Hvis du kommer til `/forside` = Login virker!

---

## ✅ Test 2: Test beskyttet route

### Test at `/forside` er beskyttet:

1. **Slet cookies først:**
   - I Browser DevTools → Application → Cookies
   - Slet `jwt` cookie
   - Refresh siden

2. **Prøv at gå til `/forside` direkte:**
   ```
   http://localhost:3000/forside
   ```

3. **Forventet resultat:**
   - Du bliver redirected til `/login`
   - ✅ Hvis du bliver redirected = Beskyttelse virker!

4. **Log ind igen:**
   - Log ind med `anna@understory.dk` / `anna123`
   - Du bliver redirected til `/forside`
   - ✅ Hvis du kan se `/forside` = Token verificering virker!

---

## ✅ Test 3: Test med Postman/Thunder Client

### Test Login endpoint:

1. **POST request til:**
   ```
   POST http://localhost:3000/api/auth/login
   ```

2. **Headers:**
   ```
   Content-Type: application/json
   ```

3. **Body (JSON):**
   ```json
   {
     "email": "anna@understory.dk",
     "password": "anna123"
   }
   ```

4. **Forventet response:**
   ```json
   {
     "success": true,
     "message": "Login succesfuldt",
     "host": {
       "navn": "Anna",
       "email": "anna@understory.dk"
     }
   }
   ```

5. **Tjek Cookies i response:**
   - I Postman: Se "Cookies" tab
   - Du skal se en cookie kaldet `jwt`
   - ✅ Hvis du ser `jwt` cookie = Token er oprettet!

---

## ✅ Test 4: Test beskyttet route med Postman

### Test `/forside` med token:

1. **Først: Login og få token** (se Test 3)

2. **GET request til:**
   ```
   GET http://localhost:3000/forside
   ```

3. **Cookies skal sendes automatisk:**
   - Postman sender cookies automatisk hvis du har logget ind først
   - ✅ Hvis du får HTML response = Token verificering virker!

4. **Test uden token:**
   - Slet cookies i Postman
   - Prøv GET request igen
   - Forventet: Redirect response (302) til `/login`
   - ✅ Hvis du får redirect = Beskyttelse virker!

---

## ✅ Test 5: Test logout

### Via Browser:

1. **Log ind først** (se Test 1)

2. **Kald logout endpoint:**
   - I Browser Console (F12):
   ```javascript
   fetch('/api/auth/logout', { method: 'POST' })
     .then(res => res.json())
     .then(data => console.log(data));
   ```

3. **Tjek cookies:**
   - I DevTools → Application → Cookies
   - `jwt` cookie skal være væk
   - ✅ Hvis cookie er slettet = Logout virker!

4. **Prøv at gå til `/forside`:**
   - Du bliver redirected til `/login`
   - ✅ Hvis du bliver redirected = Logout virker!

---

## ✅ Test 6: Test udløbet token

### Simuler udløbet token:

1. **Tilføj logging i `checkAuth` middleware:**
   ```javascript
   } catch (error) {
     console.log('Token fejl:', error.message); // Tilføj denne linje
     res.clearCookie('jwt');
     return res.redirect('/login');
   }
   ```

2. **Log ind og vent:**
   - Log ind med `anna@understory.dk` / `anna123`
   - Token udløber efter 1 time (`expiresIn: '1h'`)

3. **For hurtigere test:**
   - Ændr `expiresIn: '1h'` til `expiresIn: '5s'` i `authController.js`
   - Log ind igen
   - Vent 6 sekunder
   - Prøv at gå til `/forside`
   - Du bliver redirected til `/login`
   - ✅ Hvis du bliver redirected = Udløbet token håndtering virker!

---

## ✅ Test 7: Test med curl (Terminal)

### Test Login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"anna@understory.dk","password":"anna123"}' \
  -c cookies.txt \
  -v
```

**Tjek cookies.txt filen:**
- Du skal se en linje med `jwt` cookie
- ✅ Hvis du ser `jwt` = Token er oprettet!

### Test beskyttet route med cookie:

```bash
curl -X GET http://localhost:3000/forside \
  -b cookies.txt \
  -v
```

**Forventet:**
- Du får HTML response (forside.html)
- ✅ Hvis du får HTML = Token verificering virker!

### Test uden cookie:

```bash
curl -X GET http://localhost:3000/forside \
  -v
```

**Forventet:**
- Redirect response (302) til `/login`
- ✅ Hvis du får redirect = Beskyttelse virker!

---

## 🔍 Debug Tips

### Hvis token ikke virker:

1. **Tjek at `.env` filen eksisterer:**
   ```bash
   cat .env
   # Skal indeholde: SECRET=...
   ```

2. **Tjek server logs:**
   - Se om der er fejl i terminalen
   - Tjek om SECRET er indlæst korrekt

3. **Tilføj logging:**
   ```javascript
   // I login funktion:
   console.log('Token oprettet:', token.substring(0, 20) + '...');
   
   // I checkAuth middleware:
   console.log('Token modtaget:', token ? 'Ja' : 'Nej');
   console.log('Decoded:', decoded);
   ```

4. **Tjek cookie indstillinger:**
   - `httpOnly: true` = JavaScript kan IKKE læse cookie (det er meningen)
   - Cookie skal sendes automatisk med requests

---

## ✅ Checklist

- [ ] Login opretter JWT token
- [ ] Token gemmes i HTTP-only cookie
- [ ] Beskyttet route (`/forside`) kræver token
- [ ] Uden token = redirect til `/login`
- [ ] Med token = kan se beskyttet side
- [ ] Logout sletter token
- [ ] Udløbet token = redirect til `/login`

---

## 🎯 Hurtig Test (5 minutter)

1. **Start server:** `npm start`
2. **Gå til:** `http://localhost:3000`
3. **Log ind:** `anna@understory.dk` / `anna123`
4. **Tjek:** Kan du se `/forside`? ✅
5. **Slet cookie:** I DevTools → Application → Cookies → Slet `jwt`
6. **Refresh:** Bliver du redirected til `/login`? ✅

Hvis begge er ✅ = JWT token virker perfekt! 🎉


