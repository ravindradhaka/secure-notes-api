// src/modules/notes/notes.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  NotFoundException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotesService } from './notes.service';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';
import { NoteEntityInfo } from './response/note.entity.response';

@Controller('api/notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async getAllNotes(@Request() req) {
    const userId = req.user;
    return this.notesService.findAllNotes(userId);
  }

  @Get('/searchNotes')
  async searchNotes(@Request() req, @Query('text') searchText: string) {
    const userId = req.user;
    return this.notesService.searchNotes(searchText, userId);
  }

  @Get(':id')
  async getNoteById(@Param('id') id: string, @Request() req) {
    const userId = req.user;
    const note = await this.notesService.findNoteById(id, userId);

    if (!note) {
      return {
        statusCode: HttpStatus.OK,
        message: 'Note not found',
        data: null,
      };
    }

    return note;
  }

  @Post()
  async createNote(
    @Body() createNoteDto: CreateNoteDto,
    @Request() req,
  ): Promise<NoteEntityInfo | any> {
    const userId = req.user;
    return this.notesService.createNote(createNoteDto, userId);
  }

  @Put(':id')
  async updateNote(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() req,
  ): Promise<NoteEntityInfo | any> {
    const userId = req.user;
    const updatedNote = await this.notesService.updateNote(
      id,
      updateNoteDto,
      userId,
    );

    if (!updatedNote) {
      throw new NotFoundException('Note not found');
    }

    return updatedNote;
  }

  @Delete(':id')
  async deleteNote(@Param('id') id: string, @Request() req) {
    const userId = req.user;
    const deletedNote = await this.notesService.deleteNoteById(id, userId);

    if (!deletedNote) {
      return {
        statusCode: HttpStatus.OK,
        message: 'Note not found',
        data: null,
      };
    }

    return { message: 'Note deleted successfully' };
  }

  @Post(':id/share')
  async shareNoteWithUser(
    @Param('id') id: string,
    @Body() shareNoteDto: { userId: string },
    @Request() req,
  ) {
    const note = await this.notesService.shareNoteWithUser(
      id,
      shareNoteDto.userId,
      req.user,
    );

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return { message: 'Note shared successfully' };
  }
}
