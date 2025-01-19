import request from 'supertest';

const baseUrl = 'http://127.0.0.1:3000';

describe('Contact API Tests', () => {
  let createdContactId;

  describe('POST /contact/', () => {
    it('Should create a new contact', async () => {
      const newContact = {
        firstName: 'John',
        lastName: 'Doe',
        mobilePhone: '1234567890',
        email: 'john.doe@example.com',
        arrivedAt: '2025-01-19T10:00:00Z',
        departureAt: '2025-01-19T15:00:00Z',
        message: 'Looking forward to meeting!',
      };

      const res = await request(baseUrl)
        .post('/contact/')
        .send(newContact);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body.firstName).toBe(newContact.firstName);

      // Save the created contact's ID for further tests
      createdContactId = res.body.id;
    });
  });
/*
  describe('GET /contacts/', () => {
    it('Should retrieve all contacts', async () => {
      // Add authentication token as needed
      const authToken = 'your-auth-token'; // Replace with a valid token

      const res = await request(baseUrl)
        .get('/contacts/')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);

      if (res.body.length > 0) {
        // Check that the previously created contact exists in the response
        const createdContact = res.body.find((c) => c.id === createdContactId);
        expect(createdContact).toBeDefined();
        expect(createdContact.firstName).toBe('John');
      }
    });
  });

  describe('DELETE /contact/:id', () => {
    it('Should delete the created contact', async () => {
      const res = await request(baseUrl).delete(`/contact/${createdContactId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(createdContactId);
    });

    it('Should return 403 when deleting a non-existent contact', async () => {
      const res = await request(baseUrl).delete(`/contact/${createdContactId}`);
      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('message', 'Bad request');
    });
  });*/
});
