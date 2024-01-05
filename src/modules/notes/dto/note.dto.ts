// src/modules/notes/dto/note.dto.ts

import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  readonly content: string;

  @IsNotEmpty()
  @IsString()
  readonly title?: string;

  // Add other properties as needed
}

export class UpdateNoteDto {
  @IsOptional()
  @IsString()
  readonly content?: string;

  @IsOptional()
  @IsString()
  readonly title?: string;

  // Add other properties as needed
}
