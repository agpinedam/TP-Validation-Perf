import request from 'supertest';

const baseUrl = 'http://127.0.0.1:3000';

describe('Feedback API Tests', () => {
  let createdFeedbackId;

  describe('POST /feedback/', () => {
    it('Should create a new feedback', async () => {
      const newFeedback = {
        name: 'Jane Doe',
        email: 'usuario@example.com',
        message: 'this is a test',
      };

      const res = await request(baseUrl).post('/feedback/').send(newFeedback);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id'); // Verifica que el ID fue generado
      expect(res.body.userName).toBe(newFeedback.userName);

      createdFeedbackId = res.body.id;
    });

  });

  describe('GET /feedback/', () => {
    it('Should retrieve all feedbacks', async () => {
      const res = await request(baseUrl).get('/feedback/');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);

      // Verifica que el feedback creado está en la respuesta
      const createdFeedback = res.body.find((f) => f.id === createdFeedbackId);
      expect(createdFeedback).toBeDefined();
      expect(createdFeedback.name).toBe('Jane Doe');
    });
  });

  describe('DELETE /feedback/', () => {
    it('Should delete the created feedback', async () => {
      const res = await request(baseUrl)
        .delete(`/feedback/`)
        .send({ id: createdFeedbackId }); // El feedback ya fue eliminado

      expect(res.statusCode).toBe(200);
      console.log(res.body)
    });
  });
});
