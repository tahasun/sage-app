import { ObjectId } from "mongodb";

let sales;

export default class SalesDAO {
  static async injectDB(conn) {
    if (sales) {
      return;
    }

    try {
      sales = await conn.db(process.env.SAGE_NS).collection("sales");
    } catch (error) {
      console.error(
        `Unable to establish collection handles in salesDAO: ${error}`
      );
    }
  }

  static async addSale(services, cname, cpaid, cchange, date) {
    // for auth: user needed
    try {
      const saleDoc = {
        customer_name: cname,
        paid_amount: cpaid,
        change: cchange,
        service_ids: services,
        date: date,
      };
      return await sales.insertOne(saleDoc);
    } catch (e) {
      console.error(`Unable to post sale: ${e}`);
      throw new Error(e);
    }
  }

  static async deleteSale(saleId) {
    // only an admin can delete a sale, check against user is admin list
    try {
      return await sales.deleteOne({ _id: new ObjectId(saleId) });
    } catch (e) {
      console.error(`Unable to delete sale: ${e}`);
      throw new Error(e);
    }
  }

  static async updateSale(saleId, services, cname, cpaid, cchange, date) {
    try {
      return await sales.updateOne(
        { _id: new ObjectId(saleId) },
        {
          $set: {
            services: services,
            customer_name: cname,
            paid_amount: cpaid,
            change: cchange,
            date: date,
          },
        }
      );
    } catch (error) {
      console.error(`Unable to update sale: ${error}`);
      throw new Error(error);
    }
  }

  static async getSales({ filters = null, page = 0, salesPerPage = 10 } = {}) {
    let query = {};

    if (filters) {
      if ("cname" in filters) {
        //todo: better search index on mongodb collection
        query = { $text: { $search: filters["customer_name"] } };
      } else if ("date" in filters) {
        query = { date: { $eq: filters["date"] } };
      }
    }

    let cursor;

    try {
      cursor = await sales.find(query);
    } catch (error) {
      console.error(`Unable to issue find command, ${error}`);
      return { salesList: [], totalNumSales: 0 };
    }

    // pagination
    const displayCursor = cursor.limit(salesPerPage).skip(salesPerPage * page);

    try {
      const salesList = await displayCursor.toArray();
      //   console.log("sales: ", salesList);
      const totalNumSales = await sales.countDocuments(query);

      return { salesList, totalNumSales };
    } catch (error) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${error}`
      );
      return { salesList: [], totalNumSales: 0 };
    }
  }
}
