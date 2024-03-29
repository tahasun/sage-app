import { ObjectId } from "mongodb";

let services;

export default class ServicesDAO {
  static async injectDB(conn) {
    if (services) {
      return;
    }

    try {
      services = await conn.db(process.env.SAGE_NS).collection("services");
    } catch (error) {
      console.error(
        `Unable to establish a collection handle in servicesDAO: ${error}`
      );
    }
  }

  static async getServices({
    filters = null,
    page = 0,
    servicesPerPage = 10,
  } = {}) {
    let query = {};

    if (filters) {
      if ("title" in filters) {
        //todo: better search index on mongodb collection
        query = { $text: { $search: filters["title"] } };
      } else if ("category" in filters) {
        query = { category: { $eq: filters["category"] } };
      }
    }
    // console.log("query: ", query);

    let cursor;

    try {
      cursor = await services.find(query);
    } catch (error) {
      console.error(`Unable to issue find command, ${error}`);
      return { servicesList: [], totalNumServices: 0 };
    }

    // pagination
    const displayCursor = cursor
      .limit(servicesPerPage)
      .skip(servicesPerPage * page);

    try {
      const servicesList = await displayCursor.toArray();
      // console.log("services: ", servicesList);
      const totalNumServices = await services.countDocuments(query);

      return { servicesList, totalNumServices };
    } catch (error) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${error}`
      );
      return { servicesList: [], totalNumServices: 0 };
    }
  }

  static async addService(title, category, price) {
    try {
      const doc = {
        title: title,
        category: category,
        price: price,
      };
      return await services.insertOne(doc);
    } catch (e) {
      console.error(`Unable to post service: ${e}`);
      throw new Error(`Unable to post service: ${e}`);
    }
  }

  static async deleteService(id) {
    try {
      return await services.deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error(`Unable to delete service: ${e}`);
      throw new Error(e);
    }
  }

  static async updateService(id, title, category, price) {
    try {
      return await services.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            title: title,
            category: category,
            price: price,
          },
        }
      );
    } catch (e) {
      console.error(`Unable to update service: ${e}`);
      throw new Error(e);
    }
  }
}
