import express from "express";
import ServicesCtrl from "./services.controller.js";
import SalesCtrl from "./sales.controller.js";

const router = express.Router();

router.route("/health").get((req, res) => res.send("Health OK!"));

router.route("/services").get(ServicesCtrl.apiGetServices);
router
  .route("/service")
  .post(ServicesCtrl.apiPostService)
  .put(ServicesCtrl.apiUpdateService)
  .delete(ServicesCtrl.apiDeleteService);

router
  .route("/sale")
  .post(SalesCtrl.apiPostSale)
  .put(SalesCtrl.apiUpdateSale)
  .delete(SalesCtrl.apiDeleteSale);

router.route("/sales").get(SalesCtrl.apiGetSales);
export default router;
