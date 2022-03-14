import "core-js/stable";
import "regenerator-runtime/runtime";
import express from "express";
import morgan from "morgan";
import { config } from "dotenv";
import { log } from "debug";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import mongoose from "mongoose";
import chalk from "chalk";
import Router from "./routes";
import { errorHandler } from "./middleware/errorHandler";

config();
const app = express();
app.use(helmet());

const dir = path.join(__dirname, "public");
app.use(express.static(dir));

const port = process.env.PORT || 4000;

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

const DB_URL = process.env.MONGO_URI;

mongoose.connect(
  DB_URL,
  {
    auth: { authSource: "admin" },
    user: "",
    pass: "",
    // useMongoClient: true,
  },
  (error) => {
    // eslint-disable-next-line no-unused-expressions
    !error
      ? log(chalk.green.bold(`✔ Connected to ${process.env.NODE_ENV} database`))
      : log(
          chalk.red.bold("𐄂 An error occurred while connecting to database: "),
          error.message
        );
  }
);
app.use(cors());
app.use((req, res, next) => {
  req.socket.setKeepAlive();
  next();
});
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.status(200).json({
    message: "welcome to figfinance :)",
  });
});
app.use(Router);
app.use((req, res, next) => {
  const error = new Error("Your request could not be found");
  error.status = 404;
  next(error);
});
app.use(errorHandler);

app.listen(port, () => log(chalk.blue.bold("✔ app started at port"), port));
export default app;
