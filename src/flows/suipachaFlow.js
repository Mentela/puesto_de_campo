// flows/suipachaFlow.js
import { addKeyword } from '@builderbot/bot';
import { pedidos } from '../pedidos.js';
import { SUCURSALES } from '../config/sucursales.js';

export const createSuipachaFlow = (flows) =>
    addKeyword('Suipacha')
        .addAnswer('Gracias por comunicarte con la Sucursal SUIPACHA.\n¿Qué deseas hacer?',
            {
                buttons: [
                    { body: 'Iniciar pedido' },
                    { body: 'Cancelar' },
                ],
            },
            async (ctx, { gotoFlow }) => {
                console.log('suipachaFlow - Usuario seleccionó SUIPACHA');

                pedidos[ctx.from] = {
                    ...pedidos[ctx.from],
                    sucursal: SUCURSALES.Suipacha.nombre,
                    numeroSucursal: SUCURSALES.Suipacha.numero,
                };

                const respuesta = ctx.body.trim().toLowerCase();
                console.log('suipachaFlow - Respuesta:', respuesta);

                if (respuesta === 'iniciar pedido') {
                    return gotoFlow(flows.pedidoFlow);
                } else if (respuesta === 'cancelar') {
                    return gotoFlow(flows.welcomeFlow);
                }
            }
        );
