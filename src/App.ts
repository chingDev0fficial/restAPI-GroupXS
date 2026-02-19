import cors from "cors";
import express from "express";
import passport from "./config/passport";
import apiRoutes from "./Api/V1/Routes/api";

const app = express();
app.use(passport.initialize());
app.use(cors());
app.use("/api/v1", apiRoutes);

export default app;