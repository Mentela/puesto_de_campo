// flows/confirmacionFlow.js
import { addKeyword } from '@builderbot/bot';
import { sendOrderDirect } from '../functions/sendOrderDirect.js';
import { pedidos } from '../pedidos.js';

export const createConfirmacionFlow = (flows) =>
  addKeyword('jdshg5456471', { sensitive: true }).addAnswer(
    'Enviando tu pedido...',
    {},
    async (ctx, { provider, gotoFlow, endFlow }) => {
      console.log('confirmacionFlow - Iniciando envío del pedido');
      const pedido = pedidos[ctx.from];
      if (!pedido?.sucursal || !pedido?.formulario) {
        console.log('confirmacionFlow - Pedido inválido:', pedido);
        await provider.sendMessage(ctx.from, 'No se encontró un pedido válido. Volviendo al inicio.', {});
        return gotoFlow(flows.welcomeFlow);
      }
      try {
        await sendOrderDirect(ctx, provider, pedido.sucursal, pedido.tipoPedido);
      } catch (e) {
        console.error('confirmacionFlow - Error en sendOrderDirect:', e);
      }
      console.log('confirmacionFlow - Pedido enviado, regresando a welcomeFlow');
      return endFlow(`Gracias por elegirnos`);
    }
  );
