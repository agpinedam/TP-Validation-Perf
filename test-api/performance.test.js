import Benchmark from 'benchmark';
import request from 'supertest';

describe('Feedback API Performance Tests', () => {
  const baseUrl = 'http://127.0.0.1:3000';
  const USER_COUNT = 1000;    // Usuarios simultáneos
  const DURATION_MINUTES = 10; // Duración del test en minutos
  const RUN_TIME = DURATION_MINUTES * 60 * 1000; // Tiempo en milisegundos

  jest.setTimeout(RUN_TIME + 10000); // Aumentar el tiempo de ejecución del test

  it('should perform with 1000 concurrent users for 10 minutes', async () => {
    console.log('Starting performance test with 1000 concurrent users...');

    const suiteWithLoad = new Benchmark.Suite();

    suiteWithLoad
      .add('POST /feedback/', async function () {
        const newFeedback = {
          name: 'Jane Doe',
          email: 'usuario@example.com',
          message: 'this is a test',
        };

        await request(baseUrl).post('/feedback/').send(newFeedback);
      })
      .add('GET /feedback/', async function () {
        await request(baseUrl).get('/feedback/');
      })
      .add('DELETE /feedback/', async function () {
        const createdFeedbackId = '<INSERT_FEEDBACK_ID>';  // ID del feedback previamente creado

        await request(baseUrl)
          .delete(`/feedback/`)
          .send({ id: createdFeedbackId });
      })
      .on('cycle', function (event) {
        console.log('Cycle: ' + String(event.target));
      })
      .on('complete', async function () {
        console.log('Fastest with load is ' + this.filter('fastest').map('name'));
        
        // Generar reporte con benchmark.js
        console.log('Generating a report...');
        const report = this.map(benchmark => ({
          name: benchmark.name,
          mean: benchmark.stats.mean,
          median: benchmark.stats.median,
          deviation: benchmark.stats.deviation,
          hz: benchmark.stats.hz
        }));

        console.table(report);
      });

    // Simulación de carga de 1000 usuarios simultáneos
    const requests = [];
    for (let i = 0; i < USER_COUNT; i++) {
      requests.push(
        request(baseUrl).post('/feedback/').send({
          name: `User ${i + 1}`,
          email: `user${i}@example.com`,
          message: 'Performance test message',
        })
      );
    }

    await Promise.all(requests); // Simulación de carga concurrente

    // Ejecutar durante 10 minutos
    await new Promise((resolve) => setTimeout(resolve, RUN_TIME));
    suiteWithLoad.run({ async: true });
    console.log('Performance test with load completed.');
  });
});
