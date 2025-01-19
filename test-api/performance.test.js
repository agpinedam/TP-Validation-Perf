import request from 'supertest';

const baseUrl = 'http://127.0.0.1:3000';
const totalUsers = 1000;
const duration = 10 * 60 * 1000; // 10 minutos en milisegundos
const requestInterval = duration / totalUsers;

let successfulRequests = 0;
let failedRequests = 0;

console.log('Starting performance test...');
const startTime = Date.now();

jest.useFakeTimers(); // Simula temporizadores como setTimeout o setInterval

describe('Performance Tests', () => {
  it('should send multiple requests and measure performance', async () => {
    // Crear un bucle para enviar solicitudes
    const intervalId = setInterval(async () => {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime >= duration) {
        clearInterval(intervalId); // Detenemos las solicitudes una vez alcanzado el tiempo
        console.log('Performance test completed.');

        // Esperar hasta que todas las solicitudes se completen antes de finalizar
        await Promise.all(
          Array.from({ length: totalUsers }, (_, i) => makeRequest(i + 1))
        );

        console.log(`Successful requests: ${successfulRequests}`);
        console.log(`Failed requests: ${failedRequests}`);
      }

      for (let i = 1; i <= totalUsers; i++) {
        makeRequest(i);
      }
    }, requestInterval);
  });
});

// Función para realizar una solicitud
async function makeRequest(userNumber) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request(baseUrl)
        .post('/feedback/')
        .send({
          name: `User${userNumber}`,
          email: `user${userNumber}@example.com`,
          message: `Test message from user ${userNumber}`,
        });

      if (res.statusCode === 200) {
        successfulRequests++;
      } else {
        failedRequests++;
        console.error(`Request failed for user ${userNumber}:`, res.body);
      }
      resolve();
    } catch (err) {
      failedRequests++;
      console.error(`Error for user ${userNumber}:`, err.message);
      reject();
    }
  });
}

// Limpiar los temporizadores después de finalizar todas las pruebas
afterAll(() => {
  console.log('After all tests, cleaning up...');
  // Aquí podrías hacer cualquier limpieza necesaria si se requiere
});
