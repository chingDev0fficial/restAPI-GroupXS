### Propose Folder Structure

```
my-api/
│── src/
│   │── api/
│   │   │── v1/
│   │   │   │── routes/
│   │   │   │── controllers/
│   │   │   │── services/
│   │   │   │── validators/
│   │
│   │── models/
│   │── middleware/
│   │── config/
│   │── utils/
│   │── database/
│   │
│   │── app.js
│   │── server.js
│
│── tests/
│── .env
│── package.json

```

**Why This is Better**

- API versioning (`/api/v1`)
- Service layer separates business logic
- Validators keep controllers clean
- Easier to scale

**Setup TypeScript**

1. `npm init -y`
2. `npm install typescript ts-node @types/node --save-dev`
3. `npm install express`
4. `npm install @types/express --save-dev`
5. `npx tsc --init`
