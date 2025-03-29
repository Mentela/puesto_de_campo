// flows/welcomeFlow.js
import { addKeyword } from '@builderbot/bot';
import { pedidos } from '../pedidos.js';

export const createWelcomeFlow = (flows) =>
    addKeyword(['Hola', 'Inicio', 'Buenas', 'haces', 'dia', 'cancelar']).addAnswer('Hola, gracias por comunicarte con carnicerías Puesto de Campo.\n¿En qué podemos ayudarte?\nHaz click en alguna de las opciones:',
        {
            buttons: [
                { body: 'Envíos' },
                { body: 'Retiros' },
                { body: 'Consultas' },
            ],
        },
        async (ctx, { gotoFlow }) => {
            pedidos[ctx.from] = {};
            
            console.log('welcomeFlow - Input recibido:', ctx.body);
            if (ctx.body === 'Envíos') return gotoFlow(flows.deliveryFlow);
            if (ctx.body === 'Retiros') return gotoFlow(flows.pickupFlow);
            if (ctx.body === 'Consultas') return gotoFlow(flows.faqFlow);
        }
    );
