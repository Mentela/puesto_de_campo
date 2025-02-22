// flows/pickupFlow.js
import { addKeyword } from '@builderbot/bot';
import { pedidos } from '../pedidos.js';

export const createPickupFlow = (flows) =>
    addKeyword('Retiros')
        .addAnswer('Haz elegido "Retiro por sucursal"\n¿En qué sucursal quieres hacer el pedido?',
            {
                buttons: [
                    { body: 'Pedro Goyena 298' },
                    { body: 'Suipacha 306' },
                    { body: 'Gob. Guzmán 1560' },
                ],
            },
            async (ctx, { gotoFlow }) => {
                console.log('pickupFlow - Usuario eligió Retiros');
                pedidos[ctx.from] = { ...pedidos[ctx.from], tipoPedido: 'Envío' };
                const normalizedBody = ctx.body.trim().toLowerCase();
                console.log('pickupFlow - Respuesta:', normalizedBody);
                if (normalizedBody.includes('goyena')) return gotoFlow(flows.goyenaFlow);
                if (normalizedBody.includes('suipacha')) return gotoFlow(flows.suipachaFlow);
                if (normalizedBody.includes('guzmán')) return gotoFlow(flows.guzmanFlow);
            }
        );
