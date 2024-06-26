import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService
  ) {
    // validación rápida para que tire error si no está definida la variable en el EnvConfiguration
    // console.log(configService.getOrThrow('jwt-seed'));

    this.defaultLimit = configService.getOrThrow<number>('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error, 'create');
    }

  }

  findAll(paginationDto: PaginationDto) {

    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({
        // ordena por la columna 'no' de forma ascendente
        no: 1
      })
      .select('-__v'); // elimina del resultado la property '__v'

  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    // Verificacion por número 
    if (!isNaN(+term)) {
      console.log('Busca por número de pokemon')
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    // Verificacion por MongoID
    if (!pokemon && isValidObjectId(term)) {
      console.log('Busca por MongoID de pokemon')
      pokemon = await this.pokemonModel.findById(term);
    }

    // Verificacion por Name
    if (!pokemon) {
      console.log('Busca por Name de pokemon')
      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() });
    }

    if (!pokemon)
      throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

    try {
      // new true, indica que luego de actualizar, modifique la const pokemon que tengo acá
      await pokemon.updateOne(updatePokemonDto, { new: true });
    } catch (error) {
      this.handleExceptions(error, 'create');
    }

    // pero en el return de pokemon no se muestra el objeto actualizado, entonces:
    return { ...pokemon.toJSON(), ...updatePokemonDto };
  }

  async remove(id: string) {
    // Opción 1 (hace dos consultas)
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();

    // Opción 2  (Si manda un id que no existe no lo informa)
    // const result = await this.pokemonModel.findByIdAndDelete(id);

    // Opción 3
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0)
      throw new BadRequestException(`Pokemon with id ${id} not found`);
    return;
  }


  private handleExceptions(error: any, action: string) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`);
    }

    console.log(error);
    throw new InternalServerErrorException(`Can't ${action} Pokemon - Check sesrver logs`);

  }
}
