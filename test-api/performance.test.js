import request from 'supertest';

// Configuración de prueba
const baseUrl = 'http://127.0.0.1:3000';
const USER_COUNT = 1000; // Usuarios simultáneos
const DURATION_MINUTES = 10; // Duración del test en minutos
const RUN_TIME = DURATION_MINUTES * 60 * 1000; // Tiempo en milisegundos

jest.setTimeout(RUN_TIME + 10000); // Ajustar tiempo de ejecución del test

describe('Tests de performance de l\'API', () => {
  it(`Debería manejar ${USER_COUNT} usuarios concurrentes durante ${DURATION_MINUTES} minutos`, async () => {
    console.log(`Iniciando prueba de performance con ${USER_COUNT} usuarios concurrentes...`);

    const startTime = Date.now(); // Tiempo de inicio
    const responseTimes = []; // Array para almacenar tiempos de respuesta
    let successfulRequests = 0;
    let failedRequests = 0;

    // Función para simular una solicitud de un usuario
    const simulateRequest = async (userId) => {
      try {
        const requestStartTime = Date.now();
        await request(baseUrl).post('/feedback/').send({
          name: `User ${userId}`,
          email: `user${userId}@example.com`,
          message: 'Performance test message',
        });
        const requestEndTime = Date.now();
        responseTimes.push(requestEndTime - requestStartTime);
        successfulRequests++;
      } catch (error) {
        failedRequests++;
      }
    };

    // Ejecutar solicitudes concurrentes
    const promises = [];
    for (let i = 0; i < USER_COUNT; i++) {
      promises.push(simulateRequest(i + 1));
    }

    await Promise.all(promises); // Esperar a que todas las solicitudes terminen

    // Tiempo de finalización
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;

    // Calcular métricas
    const totalRequests = successfulRequests + failedRequests;
    const averageResponseTime =
      responseTimes.reduce((acc, time) => acc + time, 0) / responseTimes.length;
    const maxResponseTime = Math.max(...responseTimes);
    const minResponseTime = Math.min(...responseTimes);

    // Reportar resultados
    console.log(`\n--- Resultados del Test de Performance ---`);
    console.log(`Duración total del test: ${elapsedTime / 1000} segundos`);
    console.log(`Total de solicitudes completadas: ${totalRequests}`);
    console.log(`Solicitudes exitosas: ${successfulRequests}`);
    console.log(`Solicitudes fallidas: ${failedRequests}`);
    console.log(`Tiempo de respuesta promedio: ${averageResponseTime.toFixed(2)} ms`);
    console.log(`Tiempo de respuesta máximo: ${maxResponseTime} ms`);
    console.log(`Tiempo de respuesta mínimo: ${minResponseTime} ms`);

    // Validar criterios de rendimiento
    expect(failedRequests).toBeLessThan(USER_COUNT * 0.05); // Máximo 5% de fallos permitido
    expect(averageResponseTime).toBeLessThan(500); // Tiempo de respuesta promedio máximo: 500ms
  });
});
