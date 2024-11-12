import SalesDAO from "../dao/salesDAO.js";

// todo: convert backend to typescript: type all return types
// todo: type arguments
// todo: put arguments should be optional
// todo: add date to services
// todo: add packages
// todo: add discount, vat

export default class SalesController {
  static async apiGetSales(req, res, next) {
    const salesPerPage = req.query.salesPerPage
      ? parseInt(req.query.salesPerPage, 10)
      : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    let filters = {};
    if (req.query.cname) {
      filters.cname = req.query.cname;
    } else if (req.query.date) {
      filters.date = req.query.date;
    }

    const { salesList, totalNumSales } = await SalesDAO.getSales({
      filters,
      page,
      salesPerPage,
    });

    let response = {
      sales: salesList,
      page: page,
      filters: filters,
      entries_per_page: salesPerPage,
      total_results: totalNumSales,
    };

    res.json(response);
  }

  static async apiPostSale(req, res, next) {
    try {
      const services = req.body.services; //list of services
      //   const amount = req.body.amount;
      // const discount = req.body.dicount; //discount obj //todo
      // const vat = ***calc vat*** //todo
      const cname = req.body.customerName;
      const cpaid = req.body.customerPaid;
      const cchange = req.body.customerChange;
      const date = new Date();

      const SaleResponse = await SalesDAO.addSale(
        services,
        cname,
        cpaid,
        cchange,
        date
      );

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiUpdateSale(req, res, next) {
    try {
      // for now only can update services, add discount(todo)
      const services = req.body.services;
      const cname = req.body.customerName;
      const cpaid = req.body.customerPaid;
      const cchange = req.body.customerChange;
      const date = new Date();
      // recalc vat, discounts
      // id accessor might not be correct here
      const saleResponse = await SalesDAO.updateSale(
        req.query.id,
        services,
        cname,
        cpaid,
        cchange,
        date
      );

      const { error } = saleResponse;
      if (error) {
        res.status(400).json({ error });
      }

      if (saleResponse.modifiedCount === 0) {
        throw new Error("unable to update sale - not corrent sale");
      }

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiDeleteSale(req, res, next) {
    try {
      const saleId = req.query.id;
      const saleResponse = await SalesDAO.deleteSale(saleId);
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
