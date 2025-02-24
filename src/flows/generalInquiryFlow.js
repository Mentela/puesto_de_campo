// Flujo para otras consultas
import { addKeyword } from '@builderbot/bot';
import { sendInquiryDirect } from '../functions/sendInquiryDirect.js';

export const generalInquiryFlow = () => addKeyword(['consulta'])
    .addAnswer('¿Qué consulta deseas hacer?', { capture: true }, async (ctx, { provider, endFlow }) => {
        await sendInquiryDirect(ctx, provider, 'Goyena', 'Consulta general');
        return endFlow(['Gracias por elegir Puesto de Campo.', 'Si necesitas algo más, vuelve a iniciar la conversación con un "Hola".']);
    });