import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import ServicesDAO from "./dao/servicesDAO.js";
import SalesDAO from "./dao/salesDAO.js";
dotenv.config();

const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 8000;

MongoClient.connect(process.env.SAGE_DB_URI, {
  maxPoolSize: 20,
  wtimeoutMS: 2500,
  useNewURLParser: true,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    console.log("connected to database");
    await ServicesDAO.injectDB(client);
    await SalesDAO.injectDB(client);
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  });
