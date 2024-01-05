# secure-notes-api
Step 1: Check Node.js Version
Make sure you have Node.js version 18 installed. You can check your Node.js version by running:

```node -v```
Step 2: Install Nest CLI
If you haven't installed the Nest CLI (Command Line Interface) globally, you can do so using the following command:


```npm install -g @nestjs/cli```

Step 3: Install Dependencies
Navigate to the root directory of your NestJS project using the terminal and install the project dependencies:

```npm install```
Step 4: Run the Application in Development Mode
Start the NestJS application in development mode. This command typically includes the use of the Nest CLI:

```npm run start:dev```
This command will run your NestJS application in development mode, watching for changes and automatically restarting the server.

Make sure your NestJS application is properly configured, and your main.ts or main.js file is set up to bootstrap your application



# Getting All Notes
```
Getting All Notes
Endpoint: GET /api/notes
Description: Get all notes for the authenticated user.
GET /api/notes
```


# Searching Notes
```
Searching Notes
Endpoint: GET /api/notes/searchNotes
Description: Search notes based on a text query.
Parameters:
text (Query Parameter): Text to search for in notes.

```
GET /api/notes/searchNotes?text=yourSearchText
Getting a Note by ID
Endpoint: GET /api/notes/:id
Description: Get a specific note by its ID.
Parameters:
id (Path Parameter): ID of the note.

GET /api/notes/yourNoteId
Creating a Note
Endpoint: POST /api/notes
Description: Create a new note for the authenticated user.
Request Body:
createNoteDto: Object containing note details.
Usage:
http
Copy code
POST /api/notes
Updating a Note
Endpoint: PUT /api/notes/:id
Description: Update a specific note by its ID.
Parameters:
id (Path Parameter): ID of the note.
Request Body:
updateNoteDto: Object containing updated note details.
Usage:
http
Copy code
PUT /api/notes/yourNoteId
Deleting a Note
Endpoint: DELETE /api/notes/:id
Description: Delete a specific note by its ID.
Parameters:
id (Path Parameter): ID of the note.
Usage:
http
Copy code
DELETE /api/notes/yourNoteId
Sharing a Note with a User
Endpoint: POST /api/notes/:id/share
Description: Share a specific note with another user.
Parameters:
id (Path Parameter): ID of the note.
Request Body:
shareNoteDto: Object containing the user ID to share the note with.
Usage:
http
Copy code
POST /api/notes/yourNoteId/share
Authentication
All endpoints in this controller require authentication using the JWT (Json Web Token) method. Make sure to include the valid JWT token in the request header.

Feel free to customize the documentation based on your specific requirements and add any additional information or configuration steps that might be necessary for your users.