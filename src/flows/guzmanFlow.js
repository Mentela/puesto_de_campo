// flows/guzmanFlow.js
import { addKeyword } from '@builderbot/bot';
import { pedidos } from '../pedidos.js';
import { SUCURSALES } from '../config/sucursales.js';

export const createGuzmanFlow = (flows) =>
    addKeyword('Guzmán')
        .addAnswer('Gracias por comunicarte con la Sucursal GUZMÁN.\n¿Qué deseas hacer?',
            {
                buttons: [
                    { body: 'Iniciar pedido' },
                    { body: 'Cancelar' },
                ],
            },
            async (ctx, { gotoFlow }) => {
                console.log('guzmanFlow - Usuario seleccionó GUZMÁN');

                pedidos[ctx.from] = {
                    ...pedidos[ctx.from],
                    sucursal: SUCURSALES.Guzman.nombre,
                    numeroSucursal: SUCURSALES.Guzman.numero,
                };

                const respuesta = ctx.body.trim().toLowerCase();
                console.log('guzmanFlow - Respuesta:', respuesta);

                if (respuesta === 'iniciar pedido') {
                    return gotoFlow(flows.pedidoFlow);
                } else if (respuesta === 'cancelar') {
                    return gotoFlow(flows.welcomeFlow);
                }
            }
        );
