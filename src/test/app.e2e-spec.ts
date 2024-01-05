import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { JwtAuthGuard } from '../modules/auth/jwt-auth.guard';
import { AppModule } from '../app.module';
import { UserEntity } from '../modules/users/users.entity';
import { Repository } from 'typeorm';

describe('NotesController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<UserEntity>;
  let authToken;
  let NoteIdPre;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    console.log('authToken', authToken)
    const response = await request(app.getHttpServer())
      .get(`/api/auth/delete`)
      .set('Authorization', `Bearer ${authToken}`) // Attach the authentication token
      .expect(200);
    await app.close();
  });

  it('/api/auth/signup POST', async () => {
    const createUserResponse = await request(app.getHttpServer())
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        password: 'testpassword@123',
        email: 'dhaka2432@gmail.com',
        name: 'ravi',
        phoneNumber: '+918572003844',
      });

    // Check if the user creation was successful
    expect(createUserResponse.status).toBe(201);
  });

  it('/api/auth/login  (GET)', async () => {
    // Authenticate the user and obtain the authentication token
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'testpassword@123',
      });

    // Check if the login was successful and obtain the authentication token
    expect(loginResponse.status).toBe(201);
    console.log(
      'loginResponse.body.access_token;',
      loginResponse.body.access_token,
    );
    authToken = loginResponse.body.access_token;
  });

  it('/api/notes (GET)', async () => {
    return request(app.getHttpServer())
      .get('/api/notes')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((response) => {
        console.log('response.body', response.body);
        expect(Array.isArray(response.body)).toBe(true);
      });
  });

  it('/api/notes/searchNotes?text=test (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/notes/searchNotes?text=test')
      .expect(200)
      .expect((response) => {
        expect(Array.isArray(response.body)).toBe(true);
      });
  });

    // it('/api/notes (POST)', async () => {
  //   const createNoteDto = {
  //     // Replace with valid createNoteDto data
  //     title: 'Test Note s',
  //     content: 'This is a test note.s',
  //   };
  //   return request(app.getHttpServer())
  //     .post('/api/notes')
  //     .send(createNoteDto)
  //     .set('Authorization', `Bearer ${authToken}`)
  //     .expect(200)
  //     .expect((response) => {
  //       expect(response.body).toBeDefined();
  //     });
  // });

  // it('/api/notes (GET)', async () => {
  //   const userResp = await userRepository.save({
  //     username: 'testuser',
  //     password: 'testpassword@123',
  //     email: 'xyz@gmail.com',
  //     name: 'ravi dhaka',
  //     phoneNumber: '+91857200384',
  //   });
  //   console.log('userResp********', userResp);
  //   userResponseId = userResp.id;

  //   return request(app.getHttpServer())
  //     .get('/api/notes')
  //     .expect(200)
  //     .expect((response) => {
  //       expect(Array.isArray(response.body)).toBe(true);
  //     });
  // });



  // it('/api/notes/:id (GET)', async () => {
  //   // Insert a test note and retrieve its ID
  //   const createNoteDto = {
  //     title: 'Test Note',
  //     content: 'This is a test note.',
  //   };
  //   const createNoteResponse = await request(app.getHttpServer())
  //     .post('/api/notes')
  //     .send(createNoteDto)
  //     .expect(200);

  //   console.log('createNoteResponse', createNoteResponse);

  //   const noteId = createNoteResponse.body.id;

  //   // Test the GET endpoint with the retrieved note ID
  //   return request(app.getHttpServer())
  //     .get(`/api/notes/${noteId}`)
  //     .expect(200)
  //     .expect((response) => {
  //       expect(response.body).toBeDefined();
  //     });
  // });

  // it('/api/notes (POST)', async () => {
  //   const createNoteDto = {
  //     // Replace with valid createNoteDto data
  //     title: 'Test Note',
  //     content: 'This is a test note.',
  //   };
  //   return request(app.getHttpServer())
  //     .post('/api/notes')
  //     .send(createNoteDto)
  //     .expect(201)
  //     .expect((response) => {
  //       expect(response.body).toBeDefined();
  //     });
  // });

  // it('/api/notes/:id (PUT)', async () => {
  //   const noteId = 'your_note_id_here'; // Replace with a valid note ID
  //   const updateNoteDto = {
  //     // Replace with valid updateNoteDto data
  //     title: 'Updated Test Note',
  //     content: 'This is an updated test note.',
  //   };
  //   return request(app.getHttpServer())
  //     .put(`/api/notes/${noteId}`)
  //     .send(updateNoteDto)
  //     .expect(200)
  //     .expect((response) => {
  //       expect(response.body).toBeDefined();
  //     });
  // });

  // it('/api/notes/:id (DELETE)', async () => {
  //   const noteId = 'your_note_id_here'; // Replace with a valid note ID
  //   return request(app.getHttpServer())
  //     .delete(`/api/notes/${noteId}`)
  //     .expect(200)
  //     .expect((response) => {
  //       expect(response.body.message).toBe('Note deleted successfully');
  //     });
  // });

  // it('/api/notes/:id/share (POST)', async () => {
  //   const noteId = 'your_note_id_here'; // Replace with a valid note ID
  //   const shareNoteDto = {
  //     userId: 'user_id_to_share_with', // Replace with a valid user ID
  //   };
  //   return request(app.getHttpServer())
  //     .post(`/api/notes/${noteId}/share`)
  //     .send(shareNoteDto)
  //     .expect(200)
  //     .expect((response) => {
  //       expect(response.body.message).toBe('Note shared successfully');
  //     });
  // });
});
