import cors from "cors";
import express from "express";
import passport from "./Config/passport";
import apiRoutes from "./Api/V1/Routes/api";

const app = express();

app.use(cors());
app.use(express.json()); // ✅ parse JSON bodies (needed for POST /auth/refresh)
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize()); // ✅ passport after body parsers

app.use("/api/v1", apiRoutes);

export default app;
