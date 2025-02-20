// flows/goyenaFlow.js
import { addKeyword } from '@builderbot/bot';
import { pedidos } from '../pedidos.js';
import { SUCURSALES } from '../config/sucursales.js';

export const createGoyenaFlow = (flows) =>
    addKeyword('Goyena').addAnswer(
        'Gracias por comunicarte con la Sucursal GOYENA. ¿Qué deseas hacer?',
        {
            buttons: [
                { body: 'Iniciar pedido' },
                { body: 'Cancelar' },
            ],
        },
        async (ctx, { gotoFlow }) => {
            console.log('goyenaFlow - Usuario seleccionó GOYENA');

            // Almacenamos el nombre de la sucursal y su número
            pedidos[ctx.from] = {
                ...pedidos[ctx.from],
                sucursal: SUCURSALES.Goyena.nombre,
                numeroSucursal: SUCURSALES.Goyena.numero,
            };

            const respuesta = ctx.body.trim().toLowerCase();
            console.log('goyenaFlow - Respuesta:', respuesta);

            if (respuesta === 'iniciar pedido') {
                return gotoFlow(flows.pedidoFlow);
            } else if (respuesta === 'cancelar') {
                return gotoFlow(flows.welcomeFlow);
            }
        }
    );
