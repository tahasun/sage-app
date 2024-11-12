import ServicesDAO from "../dao/servicesDAO.js";

export default class ServicesController {
  static async apiGetServices(req, res, next) {
    const servicesPerPage = req.query.servicesPerPage
      ? parseInt(req.query.servicesPerPage, 10)
      : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    let filters = {};
    if (req.query.category) {
      filters.category = req.query.category;
    } else if (req.query.name) {
      filters.name = req.query.name;
    }

    const { servicesList, totalNumServices } = await ServicesDAO.getServices({
      filters,
      page,
      servicesPerPage,
    });

    let response = {
      services: servicesList,
      page: page,
      filters: filters,
      entries_per_page: servicesPerPage,
      total_results: totalNumServices,
    };

    res.json(response);
  }

  static async apiPostService(req, res, next) {
    try {
      const title = req.body.title;
      const category = req.body.category;
      const price = req.body.price;

      const ServiceResponse = await ServicesDAO.addService(
        title,
        category,
        price
      );

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiDeleteService(req, res, next) {
    try {
      const serviceId = req.query.id;
      const response = await ServicesDAO.deleteService(serviceId);
      res.json({ status: "success" });
    } catch (error) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiUpdateService(req, res, next) {
    try {
      const serviceId = req.query.id;
      const title = req.body.title;
      const category = req.body.category;
      const price = req.body.price;

      const response = await ServicesDAO.updateService(
        serviceId,
        title,
        category,
        price
      );

      const { error } = response;
      if (error) {
        res.status(400).json({ error });
      }

      if (response.modifiedCount === 0) {
        throw new Error("unable to update service - not corrent service");
      }

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
