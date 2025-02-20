// flows/deliveryFlow.js
import { addKeyword } from '@builderbot/bot';
import { pedidos } from '../pedidos.js';

export const createDeliveryFlow = (flows) =>
    addKeyword('Envíos')
        .addAnswer('¿Con qué sucursal quisieras comunicarte?',
            {
                buttons: [
                    { body: 'Pedro Goyena 298' },
                    { body: 'Suipacha 306' },
                    { body: 'Gob. Guzmán 1560' },
                ],
            },
            async (ctx, { gotoFlow }) => {
                console.log('deliveryFlow - Usuario eligió Envíos');
                pedidos[ctx.from] = { ...pedidos[ctx.from], tipoPedido: 'Envío' };
                const normalizedBody = ctx.body.trim().toLowerCase();
                console.log('deliveryFlow - Respuesta:', normalizedBody);
                if (normalizedBody.includes('goyena')) return gotoFlow(flows.goyenaFlow);
                if (normalizedBody.includes('suipacha')) return gotoFlow(flows.suipachaFlow);
                if (normalizedBody.includes('guzmán')) return gotoFlow(flows.guzmanFlow);
            }
        );
