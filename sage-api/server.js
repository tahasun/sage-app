import express from "express";
import cors from "cors";
import routes from "./api/sage.route.js";
// import sales from "./api/sales.route.js";

const app = express();

app.use(cors());
app.use(express.json());

// api routes
app.use("/api/v1/", routes);

// everything else returns 404
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default app;
