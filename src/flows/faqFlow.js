// flows/faqFlow.js
import { addKeyword } from '@builderbot/bot';

export const createFaqFlow = (flows) =>
    addKeyword('Consultas')
        .addAnswer('Nuestras preguntas más frecuentes:\n1. Horarios de atención\n2. Dirección de sucursales\n3. Precios\n4. Medios de pago\n5. Teléfonos de sucursales\n6. Otra consulta\n\nPor favor, respondé con el número correspondiente o seleccioná una opción:',
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
                    1: 'Nuestro horario es de 9:00 a 18:00 de lunes a viernes.',
                    2: 'Estamos en Pedro Goyena 298, Suipacha 306 y Gobernador Guzmán 1560.',
                    3: 'Consultá la lista de precios aquí: [link]',
                    4: 'Aceptamos efectivo y tarjetas.',
                    5: 'Teléfonos: Goyena 1234, Suipacha 5678, Guzmán 91011.',
                    6: 'Por favor, escribí tu consulta y te responderemos a la brevedad.',
                };
                await flowDynamic(responses[userResponse] || 'Opción no válida. Respondé con un número del 1 al 6.');
            }
        );
