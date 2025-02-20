// sendOrderDirect.js
import { pedidos } from '../pedidos.js';

export const sendOrderDirect = async (ctx, provider, sucursal, tipoPedido) => {
  const pedido = pedidos[ctx.from] || {};

  // Sacamos el número directamente del pedido
  const numeroSucursal = pedido.numeroSucursal; 
  let clientNumber = ctx.from;

  if (!clientNumber.startsWith('+')) {
    clientNumber = `+${clientNumber}`;
  }

  let mensaje = `📢 *Nuevo pedido de ${tipoPedido}* | Suc. *${sucursal}*\n\n` +
                `📱 *Cliente:* ${clientNumber}\n\n`;

  if (pedido.formulario) {
    mensaje += `*Detalles del pedido:*\n${pedido.formulario}`;
  } else {
    mensaje += `*Detalles del pedido:* No se encontraron detalles en el pedido.`;
  }

  console.log('sendOrderDirect - Mensaje a enviar:', mensaje);

  try {
    // Aquí enviamos al número de la sucursal que guardamos
    const resSucursal = await provider.sendMessage(numeroSucursal, mensaje, {});
    console.log('sendOrderDirect - Respuesta sucursal:', resSucursal);

    const resCliente = await provider.sendMessage(clientNumber, '✅ Tu pedido ha sido enviado y está en proceso de revisión.', {});
    console.log('sendOrderDirect - Respuesta cliente:', resCliente);
  } catch (error) {
    console.error('sendOrderDirect - Error al enviar el mensaje:', error);
    try {
      await provider.sendMessage(clientNumber, '❌ Hubo un error al enviar tu pedido. Por favor, intenta nuevamente.', {});
    } catch (err) {
      console.error('sendOrderDirect - Error al notificar al cliente:', err);
    }
  }
  delete pedidos[ctx.from];
};
