import http from './http-common';

export class ServiceAPI {
    getAll(page = 0){
        return http.get(`/services?page=${page}`);
    }

    // get(id: string){
    //     return http.get(`/services/id/${id}`);
    // } //todo

    createService(data: any){
        return http.post(`/service`, data);
    }

    updateService(data:any) {
        return http.put('/service', data);
    }

    deleteService(id: string){
        return http.delete(`/service?id=${id}`);
    }

    find(query: string, by = "category", page=0){
        return http.get(`/services?${by}=${query}&page=${page}`);
    }
}

const serviceAPI = new ServiceAPI();
export default serviceAPI;