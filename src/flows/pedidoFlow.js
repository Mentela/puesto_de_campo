// flows/pedidoFlow.js
import { addKeyword } from '@builderbot/bot';
import { pedidos } from '../pedidos.js';

export const createPedidoFlow = (flows) =>
    addKeyword(['Pedido']).addAnswer(
        'Para realizar tu pedido, ingresa la siguiente información separada:\n\n - Nombre completo\n - DNI\n - Dirección (calle, número, piso),\n - Detalle del pedido (producto y cantidad).\n\nEjemplo:\n\n - Juan Pérez\n - 42345678\n - Av. Sabattini 352\n - 3kg de Asado.\n\nPor favor, completa con tus datos:',
        { capture: true },
        async (ctx, { gotoFlow }) => {
            console.log("pedidoFlow -  Input recibido:", JSON.stringify(ctx.body));
            const inputLimpio = ctx.body.trim();
            pedidos[ctx.from] = {
                ...pedidos[ctx.from],
                formulario: inputLimpio
            };
            return gotoFlow(flows.resumenFlow);
        }
    );
