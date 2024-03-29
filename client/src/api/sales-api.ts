import http from './http-common';

export class SalesApi {
    getAll(page=0){
        return http.get(`/sales?page=${page}`);
    }

    createSale(data: any) {
        return http.post('/sale', data);
    }

    updateSale(data: any) {
        return http.put('/sale', data);
    }

    deleteSale(id: string) {
        return http.delete(`/sale?id=${id}`);
    }

    find(query: string, by="date", page=0){
        return http.get(`/sales?${by}=${query}&page=${page}`);
    }
}

const SalesAPI = new SalesApi();
export default SalesAPI;