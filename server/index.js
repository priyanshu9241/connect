import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
//securty packages
// import helmet from "helmet";
import dbConnection from "./dbConfig/index.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import router from "./routes/index.js";

const __dirname = path.resolve(path.dirname(""));

dotenv.config();

const app = express();
app.use(
  cors({
    // origin:process.env.CLIENT_URL,
    origin:true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
const PORT = process.env.PORT || 8800;

dbConnection();

// app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(router);

//error middleware
app.use(errorMiddleware);
app.use(express.static(path.join(__dirname, "views/build")));

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
