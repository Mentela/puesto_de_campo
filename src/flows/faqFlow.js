// flows/faqFlow.js
import { addKeyword } from '@builderbot/bot';

export const createFaqFlow = (flows) =>
    addKeyword('Consultas')
        .addAnswer('Nuestras preguntas más frecuentes:\n1. Horarios de atención\n2. Dirección de sucursales\n3. Precios\n4. Medios de pago\n5. Teléfonos de sucursales\n6. Otras consulta\n\nPor favor, respondé con el número correspondiente o seleccioná una opción:',
            {
                capture: true,
                buttons: [
                    { body: 'Volver al inicio' },
                    // { body: 'Repetir consultas' },
                ],
            },
            async (ctx, { gotoFlow, flowDynamic }) => {
                console.log('faqFlow - Input recibido:', JSON.stringify(ctx.body));
                const userResponse = ctx.body.trim();
                if (userResponse === 'Volver al inicio') return gotoFlow(flows.welcomeFlow);
                // if (userResponse === 'Repetir consultas') return gotoFlow(flows.faqFlow);

                const responses = {
                    1: 'Horario de atencion: Lunes a Sábado de 8:30 a 13:30hs y de 17:30 a 21:30hs. Domingo de 9 a 13:30hs',
                    2: 'Estamos en Pedro Goyena 298, Suipacha 306 y Gobernador Guzmán 1560.',
                    3: 'Para consultas sobre precios, comunicate con nuestra sucursal en Goyena al 3586108047.',
                    4: 'Medios de pago: efectivo, Tarjeta de debito: visa, maestro, mastercard y todas las prepagas. Los envios se abonan unicamente en efectivo ',
                    5: 'Telefonos de sucursales para llamadas:\nSuc. Goyena 3586108047\nSuc. Guzman 3586108045\nSuc. Suipacha 3586108046',
                    6: 'Por otras consultas, comunicate con nuestra sucursal en Goyena al 3586108047.',

                };
                await flowDynamic(responses[userResponse] || 'Opción no válida. Respondé con un número del 1 al 6.');
            }
        );
