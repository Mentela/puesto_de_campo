// Flujo para consultas de precios
import { addKeyword } from '@builderbot/bot';
import { sendInquiryDirect } from '../functions/sendInquiryDirect.js';

export const priceInquiryFlow = () => addKeyword(['precios'])
    .addAnswer('¿Qué precios deseas consultar?', { capture: true }, async (ctx, { provider, endFlow }) => {
        await sendInquiryDirect(ctx, provider, 'Goyena', 'Precios');
        return endFlow(['Gracias por elegir Puesto de Campo.', 'Si necesitas algo más, vuelve a iniciar la conversación con un "Hola".']);
    });