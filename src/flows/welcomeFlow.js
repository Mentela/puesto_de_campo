// flows/welcomeFlow.js
import { addKeyword } from '@builderbot/bot';

export const createWelcomeFlow = (flows) =>
    addKeyword(['Hola', 'Inicio', 'Buenas', 'haces', 'dia', 'cancelar'])
        .addAnswer('Hola, gracias por comunicarte con carnicerías Puesto de Campo. ¿En qué podemos ayudarte? Haz click en alguna de las opciones:',
            {
                buttons: [
                    { body: 'Envíos' },
                    { body: 'Retiros' },
                    { body: 'Consultas' },
                ],
            },
            async (ctx, { gotoFlow }) => {
                console.log('welcomeFlow - Input recibido:', ctx.body);
                if (ctx.body === 'Envíos') return gotoFlow(flows.deliveryFlow);
                if (ctx.body === 'Retiros') return gotoFlow(flows.pickupFlow);
                if (ctx.body === 'Consultas') return gotoFlow(flows.faqFlow);
            }
        );
