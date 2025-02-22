// sendInquiryDirect.js
import { SUCURSALES } from '../config/sucursales.js';

export const sendInquiryDirect = async (ctx, provider, sucursal, tipoConsulta) => {
  const goyenaNumber = SUCURSALES.Goyena.numero; // Número de la sucursal Goyena
  let clientNumber = ctx.from;

  if (!clientNumber.startsWith('+')) {
    clientNumber = `+${clientNumber}`;
  }

  let mensaje = `📢 *Nueva consulta de ${tipoConsulta}* | Suc. *${sucursal}*\n\n` +
    `📱 *Cliente:* ${clientNumber}\n\n` +
    `💬 *Mensaje:* ${ctx.body}`;

  console.log('sendInquiryDirect - Mensaje a enviar:', mensaje);

  try {
    // Enviamos el mensaje a la sucursal
    const resSucursal = await provider.sendMessage(goyenaNumber, mensaje, {});
    console.log('sendInquiryDirect - Respuesta sucursal:', resSucursal);

    // Enviamos confirmación al cliente
    const resCliente = await provider.sendMessage(clientNumber, '✅ Tu consulta ha sido enviada a la sucursal y responderemos a la brevedad.', {});
    console.log('sendInquiryDirect - Respuesta cliente:', resCliente);
  } catch (error) {
    console.error('sendInquiryDirect - Error al enviar la consulta:', error);
    try {
      await provider.sendMessage(clientNumber, '❌ Hubo un error al enviar tu consulta. Por favor, intenta nuevamente.', {});
    } catch (err) {
      console.error('sendInquiryDirect - Error al notificar al cliente:', err);
    }
  }
};
