// flows/resumenFlow.js
import { addKeyword } from '@builderbot/bot';

export const createResumenFlow = (flows) =>
    addKeyword('nosense123123', { sensitive: true }).addAnswer(
        '¿Quieres confirmar el pedido?',
        {
            buttons: [
                { body: 'Confirmar pedido' },
                { body: 'Cancelar' },
            ],
            capture: true,
        },
        async (ctx, { provider, gotoFlow }) => {
            console.log("resumenFlow - Input recibido:", JSON.stringify(ctx.body));
            const respuesta = ctx.body.trim().toLowerCase();
            console.log("resumenFlow - Respuesta procesada:", respuesta);
            if (respuesta.includes('confirmar')) {
                return gotoFlow(flows.confirmacionFlow);
            }
            if (respuesta.includes('cancelar')) {
                await provider.sendMessage(ctx.from, 'Has cancelado tu pedido. Volviendo al menú principal.', {});
                return gotoFlow(flows.welcomeFlow);
            }
            await provider.sendMessage(ctx.from, 'Opción no válida. Por favor, selecciona "Confirmar pedido" o "Cancelar".', {});
            return gotoFlow(flows.resumenFlow);
        }
    );
