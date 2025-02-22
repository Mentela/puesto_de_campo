// Flujo principal de FAQ
import { addKeyword } from '@builderbot/bot';

export const createFaqFlow = (flows) =>
    addKeyword('Consultas')
        .addAnswer(
            'Nuestras preguntas más frecuentes:\n1. Horarios de atención\n2. Dirección de sucursales\n3. Precios\n4. Medios de pago\n5. Teléfonos de sucursales\n6. Otra consulta\n\nPor favor, respondé con el número correspondiente o seleccioná una opción:',
            {
                capture: true,
                buttons: [{ body: 'Volver al inicio' }],
            },
            async (ctx, { gotoFlow, flowDynamic }) => {
                console.log('faqFlow - Input recibido:', JSON.stringify(ctx.body));
                const userResponse = ctx.body.trim();

                if (userResponse === 'Volver al inicio') return gotoFlow(flows.welcomeFlow);

                const responses = {
                    1: 'Horario de atención: Lunes a Sábado de 8:30 a 13:30hs y de 17:30 a 21:30hs. Domingo de 9 a 13:30hs',
                    2: 'Estamos en Pedro Goyena 298, Suipacha 306 y Gobernador Guzmán 1560.',
                    4: 'Medios de pago: efectivo, Tarjeta de débito: Visa, Maestro, Mastercard y todas las prepagas. Los envíos se abonan únicamente en efectivo.',
                    5: 'Teléfonos de sucursales para llamadas:\nSuc. Goyena 3586108047\nSuc. Guzman 3586108045\nSuc. Suipacha 3586108046',
                };

                if (userResponse === '3') return gotoFlow(flows.priceInquiryFlow);
                if (userResponse === '6') return gotoFlow(flows.generalInquiryFlow);

                await flowDynamic(responses[userResponse] || 'Opción no válida. Respondé con un número del 1 al 6.');
            }
        );