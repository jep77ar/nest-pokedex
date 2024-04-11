import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from './../pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from './../common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ) { }

  async executeSeed() {

    await this.pokemonModel.deleteMany({}); // {} equivale a delete * from pokemons;

    const data: PokeResponse = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    // OPCION 1 DE INSERTAR MULTIPLES REGISTROS
    // const insertPromisesArray = [];


    // data.results.forEach(({name, url}) => {
    //   console.log(name, url);

    //   const segments = url.split('/');
    //   const no = +segments[ segments.length - 2 ]

    //   // const pokemon = await this.pokemonModel.create({name, no});
    //   insertPromisesArray.push(
    //     this.pokemonModel.create({name, no})
    //   );

    // });

    // const newArray = await Promise.all(insertPromisesArray);


    // OPCION 2 DE INSERTAR MULTIPLES REGISTROS
    const pokemonToInsert: { name: string, no: number }[] = [];

    data.results.forEach(({ name, url }) => {
      console.log(name, url);

      const segments = url.split('/');
      const no = +segments[segments.length - 2]

      // const pokemon = await this.pokemonModel.create({name, no});
      pokemonToInsert.push({ name, no });
    });

    const a = await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed Excecuted: ' + a.length;
  }

}
