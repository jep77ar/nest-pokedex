import { PartialType } from '@nestjs/mapped-types';
import { CreatePokemonDto } from './create-pokemon.dto';

// PartialType, indica que todas las props son opcionales
export class UpdatePokemonDto extends PartialType(CreatePokemonDto) {}
