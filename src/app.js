import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); //setting the limit for json data
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //nesting of objects
app.use(express.static("path")); //Storing assets(images,etc) in a public folder
app.use(cookieParser()); //to set or get cookies on the browser and also perform CRUD operations
export { app };
