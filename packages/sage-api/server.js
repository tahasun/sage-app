import express from "express";
import cors from "cors";
import routes from "./api/sage.route.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import ServicesDAO from "./dao/servicesDAO.js";
import SalesDAO from "./dao/salesDAO.js";

// import sales from "./api/sales.route.js";
const app = express();
dotenv.config();
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:8080"], //frontend urls
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false, // If you're using cookies/sessions
  })
);

app.use(express.json());

// api routes
app.use("/api/v1/", routes);

// everything else returns 404
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 8000;
console.log("HMM");

MongoClient.connect(process.env.SAGE_DB_URI, {
  maxPoolSize: 20,
  wtimeoutMS: 2500,
  useNewURLParser: true,
})
  .catch((err) => {
    console.log("error connecting to database");
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    console.log("connected to database");
    await ServicesDAO.injectDB(client);
    await SalesDAO.injectDB(client);
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
      console.log(`Server is running at http://localhost:${port}`);
      console.log(`Try accessing: http://localhost:${port}/api/v1/status`);
    });
  });

export default app;
