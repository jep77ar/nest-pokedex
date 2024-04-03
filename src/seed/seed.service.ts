import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import https from 'https';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {

  // se recomienda indicar que es una instancia de axios con la siguiente línea
  // para indicar que es una dependencia de mi servicio
  // private readonly axios: AxiosInstance = axios;
  // Por error con 
  private readonly axios: AxiosInstance = axios.create({
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  });

  async executeSeed() {
    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=20');

    data.results.forEach(({name, url}) => {
      console.log(name, url);

      const segments = url.split('/');
      const no = +segments[ segments.length - 2 ]

    });

    return data.results;
  }

}
