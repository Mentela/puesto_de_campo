// Flujo para consultas de precios
import { addKeyword } from '@builderbot/bot';
import { sendInquiryDirect } from '../functions/sendInquiryDirect.js';

export const priceInquiryFlow = () => addKeyword(['precios'])
    .addAnswer('¿Qué precios deseas consultar?', { capture: true }, async (ctx, { flowDynamic, provider, endFlow }) => {
        await sendInquiryDirect(ctx, provider, 'Goyena', 'Precios');
        await flowDynamic('Gracias por elegir Puesto de Campo.');
        return endFlow(`Si necesitas algo más, vuelve a iniciar la conversación con un "Hola".`);
    });