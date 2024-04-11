import { Injectable } from '@nestjs/common';
import https from 'https';
import axios, { AxiosInstance } from 'axios';
import { HttpAdapter } from "../interfaces/http-adapter.interface";

@Injectable()
export class AxiosAdapter implements HttpAdapter {

    // se recomienda indicar que es una instancia de axios con la siguiente línea
    // para indicar que es una dependencia de mi servicio
    // private readonly axios: AxiosInstance = axios;
    // Por error con 
    private readonly axios: AxiosInstance = axios.create({
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });

    async get<T>(url: string): Promise<T> {
        try {
            const { data } = await this.axios.get<T>(url);
            return data;
        } catch (error) {
            throw new Error('This is an error - Check logs');
        }
    }

}