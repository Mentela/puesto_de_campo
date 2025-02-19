import { createBot, createProvider, createFlow, addKeyword } from '@builderbot/bot'
import { JsonFileDB as Database } from '@builderbot/database-json'
import { MetaProvider as Provider } from '@builderbot/provider-meta'

const PORT = process.env.PORT ?? 3002
const pedidos = {}

/**
 * Envía el pedido a la sucursal de forma directa.
 */
const sendOrderDirect = async (ctx, provider, sucursal) => {
    const pedido = pedidos[ctx.from] || {}
    const numeroSucursal = '+5493584876535' // Número de prueba en formato E.164

    // Aseguramos que ctx.from esté en formato E.164
    let clientNumber = ctx.from
    if (!clientNumber.startsWith('+')) {
        clientNumber = `+${clientNumber}`
    }

    let mensaje = `📢 Nuevo pedido desde ${sucursal}:\n\n` +
        `📱 Cliente: ${clientNumber}\n`
    if (pedido.formulario) {
        mensaje += `Detalles:\n${pedido.formulario}`
    } else {
        mensaje += `No se encontraron detalles en el pedido.`
    }
    console.log('sendOrderDirect - Mensaje a enviar:', mensaje)

    try {
        const resSucursal = await provider.sendMessage(numeroSucursal, mensaje, {})
        console.log('sendOrderDirect - Respuesta sucursal:', resSucursal)
        const resCliente = await provider.sendMessage(clientNumber, '✅ Tu pedido ha sido enviado y está en proceso de revisión.', {})
        console.log('sendOrderDirect - Respuesta cliente:', resCliente)
    } catch (error) {
        console.error('sendOrderDirect - Error al enviar el mensaje:', error)
        try {
            await provider.sendMessage(clientNumber, '❌ Hubo un error al enviar tu pedido. Por favor, intenta nuevamente.', {})
        } catch (err) {
            console.error('sendOrderDirect - Error al notificar al cliente:', err)
        }
    }
    delete pedidos[ctx.from]
}

/**
 * 1. Flujo de captura de datos (pedidoFlow)
 */
const pedidoFlow = addKeyword(['pedido']).addAnswer(
    'Para realizar tu pedido, ingresa la siguiente información separada por comas: Nombre completo, DNI, Dirección (calle, número, piso), Detalle del producto (producto y cantidad), Monto de pago. Ejemplo: Juan Pérez, 12345678, Av. Siempre Viva 742, Pizza Grande 2, $1500. Por favor, completa con tus datos:',
    { capture: true },
    async (ctx, { gotoFlow }) => {
        console.log("pedidoFlow - Input recibido:", JSON.stringify(ctx.body))
        const inputLimpio = ctx.body.trim()
        console.log("pedidoFlow - Input limpio:", inputLimpio)
        pedidos[ctx.from] = {
            ...pedidos[ctx.from],
            formulario: inputLimpio
        }
        console.log("pedidoFlow - Pedido almacenado:", pedidos[ctx.from])
        return gotoFlow(resumenFlow)
    }
)

/**
 * 2. Flujo de resumen (resumenFlow)
 */
const resumenFlow = addKeyword([]).addAnswer(
    'Quieres confirmar el pedido?',
    {
        buttons: [
            { body: 'Confirmar pedido' },
            { body: 'Cancelar' },
        ],
        capture: true,
    },
    async (ctx, { provider, gotoFlow }) => {
        console.log("resumenFlow - Input recibido:", JSON.stringify(ctx.body))
        const respuesta = ctx.body.trim().toLowerCase()
        console.log("resumenFlow - Respuesta procesada:", respuesta)
        if (respuesta.includes('confirmar')) {
            return gotoFlow(confirmacionFlow)
        }
        if (respuesta.includes('cancelar')) {
            await provider.sendMessage(ctx.from, 'Has cancelado tu pedido. Volviendo al menú principal.', {})
            return gotoFlow(welcomeFlow)
        }
        await provider.sendMessage(ctx.from, 'Opción no válida. Por favor, selecciona "Confirmar pedido" o "Cancelar".', {})
        return gotoFlow(resumenFlow)
    }
)

/**
 * 3. Flujo de confirmación final (confirmacionFlow)
 */
const confirmacionFlow = addKeyword([]).addAnswer(
    'Enviando tu pedido...',
    {},
    async (ctx, { provider, gotoFlow }) => {
        console.log('confirmacionFlow - Iniciando envío del pedido')
        const pedido = pedidos[ctx.from]
        if (!pedido?.sucursal || !pedido?.formulario) {
            console.log('confirmacionFlow - Pedido inválido:', pedido)
            await provider.sendMessage(ctx.from, 'No se encontró un pedido válido. Volviendo al inicio.', {})
            return gotoFlow(welcomeFlow)
        }
        try {
            console.log('voy por aca')
            await sendOrderDirect(ctx, provider, pedido.sucursal)
        } catch (e) {
            console.error('confirmacionFlow - Error en sendOrderDirect:', e)
        }
        console.log('confirmacionFlow - Pedido enviado, regresando a welcomeFlow')
        return gotoFlow(welcomeFlow)
    }
)

/**
 * Flujos para seleccionar la sucursal.
 */
const goyenaFlow = addKeyword('Goyena').addAnswer(
    'Gracias por comunicarte con GOYENA. ¿Qué deseas hacer?',
    {
        buttons: [
            { body: 'Iniciar pedido' },
            { body: 'Cancelar' }
        ]
    },
    async (ctx, { gotoFlow }) => {
        console.log('goyenaFlow - Usuario seleccionó GOYENA')
        pedidos[ctx.from] = { ...pedidos[ctx.from], sucursal: 'Goyena' }
        const respuesta = ctx.body.trim().toLowerCase()
        console.log('goyenaFlow - Respuesta:', respuesta)
        if (respuesta === 'iniciar pedido') {
            return gotoFlow(pedidoFlow)
        } else if (respuesta === 'cancelar') {
            return gotoFlow(welcomeFlow)
        }
    }
)

const suipachaFlow = addKeyword('Suipacha').addAnswer(
    'Gracias por comunicarte con SUIPACHA. ¿Qué deseas hacer?',
    {
        buttons: [
            { body: 'Iniciar pedido' },
            { body: 'Cancelar' }
        ]
    },
    async (ctx, { gotoFlow }) => {
        console.log('suipachaFlow - Usuario seleccionó SUIPACHA')
        pedidos[ctx.from] = { ...pedidos[ctx.from], sucursal: 'Suipacha' }
        const respuesta = ctx.body.trim().toLowerCase()
        console.log('suipachaFlow - Respuesta:', respuesta)
        if (respuesta === 'iniciar pedido') {
            return gotoFlow(pedidoFlow)
        } else if (respuesta === 'cancelar') {
            return gotoFlow(welcomeFlow)
        }
    }
)

const guzmanFlow = addKeyword('Guzmán').addAnswer(
    'Gracias por comunicarte con GUZMÁN. ¿Qué deseas hacer?',
    {
        buttons: [
            { body: 'Iniciar pedido' },
            { body: 'Cancelar' }
        ]
    },
    async (ctx, { gotoFlow }) => {
        console.log('guzmanFlow - Usuario seleccionó GUZMÁN')
        pedidos[ctx.from] = { ...pedidos[ctx.from], sucursal: 'Guzmán' }
        const respuesta = ctx.body.trim().toLowerCase()
        console.log('guzmanFlow - Respuesta:', respuesta)
        if (respuesta === 'iniciar pedido') {
            return gotoFlow(pedidoFlow)
        } else if (respuesta === 'cancelar') {
            return gotoFlow(welcomeFlow)
        }
    }
)

/**
 * Flujos para pedidos de Envíos y Retiros.
 */
const deliveryFlow = addKeyword('Envíos').addAnswer(
    '¿Con qué sucursal quisieras comunicarte?',
    {
        buttons: [
            { body: 'Pedro Goyena 298' },
            { body: 'Suipacha 306' },
            { body: 'Gob. Guzmán 1560' },
        ],
    },
    async (ctx, { gotoFlow }) => {
        console.log('deliveryFlow - Usuario eligió Envíos')
        pedidos[ctx.from] = { tipoPedido: 'Envío' }
        const normalizedBody = ctx.body.trim().toLowerCase()
        console.log('deliveryFlow - Respuesta:', normalizedBody)
        if (normalizedBody.includes('goyena')) return gotoFlow(goyenaFlow)
        if (normalizedBody.includes('suipacha')) return gotoFlow(suipachaFlow)
        if (normalizedBody.includes('guzmán')) return gotoFlow(guzmanFlow)
    }
)

const pickupFlow = addKeyword('Retiros').addAnswer(
    '¿Con qué sucursal quisieras comunicarte?',
    {
        buttons: [
            { body: 'Pedro Goyena 298' },
            { body: 'Suipacha 306' },
            { body: 'Gob. Guzmán 1560' },
        ],
    },
    async (ctx, { gotoFlow }) => {
        console.log('pickupFlow - Usuario eligió Retiros')
        pedidos[ctx.from] = { tipoPedido: 'Retiro' }
        const normalizedBody = ctx.body.trim().toLowerCase()
        console.log('pickupFlow - Respuesta:', normalizedBody)
        if (normalizedBody.includes('goyena')) return gotoFlow(goyenaFlow)
        if (normalizedBody.includes('suipacha')) return gotoFlow(suipachaFlow)
        if (normalizedBody.includes('guzmán')) return gotoFlow(guzmanFlow)
    }
)

/**
 * Flujo de Consultas/FAQ.
 */
const faqFlow = addKeyword('Consultas').addAnswer(
    'Nuestras preguntas más frecuentes:\n1. Horarios de atención\n2. Dirección de sucursales\n3. Precios\n4. Medios de pago\n5. Teléfonos de sucursales\n6. Otra consulta\n\nPor favor, respondé con el número correspondiente o seleccioná una opción:',
    {
        capture: true,
        buttons: [
            { body: 'Volver al inicio' },
            { body: 'Repetir consultas' },
        ],
    },
    async (ctx, { gotoFlow, flowDynamic }) => {
        console.log('faqFlow - Input recibido:', JSON.stringify(ctx.body))
        const userResponse = ctx.body.trim()
        if (userResponse === 'Volver al inicio') return gotoFlow(welcomeFlow)
        if (userResponse === 'Repetir consultas') return gotoFlow(faqFlow)

        const responses = {
            1: 'Nuestro horario es de 9:00 a 18:00 de lunes a viernes.',
            2: 'Estamos en Pedro Goyena 298, Suipacha 306 y Gobernador Guzmán 1560.',
            3: 'Consultá la lista de precios aquí: [link]',
            4: 'Aceptamos efectivo y tarjetas.',
            5: 'Teléfonos: Goyena 1234, Suipacha 5678, Guzmán 91011.',
            6: 'Por favor, escribí tu consulta y te responderemos a la brevedad.',
        }
        await flowDynamic(responses[userResponse] || 'Opción no válida. Respondé con un número del 1 al 6.')
    }
)

/**
 * Flujo de bienvenida.
 */
const welcomeFlow = addKeyword(['Hola', 'Inicio']).addAnswer(
    'Hola, gracias por comunicarte con Puesto de Campo. Solo podemos responder mensajes ESCRITOS. ¿En qué podemos ayudarte?',
    {
        buttons: [
            { body: 'Envíos' },
            { body: 'Retiros' },
            { body: 'Consultas' },
        ],
    },
    async (ctx, { gotoFlow }) => {
        console.log('welcomeFlow - Input recibido:', ctx.body)
        if (ctx.body === 'Envíos') return gotoFlow(deliveryFlow)
        if (ctx.body === 'Retiros') return gotoFlow(pickupFlow)
        if (ctx.body === 'Consultas') return gotoFlow(faqFlow)
    }
)

const main = async () => {
    const adapterFlow = createFlow([
        welcomeFlow,
        deliveryFlow,
        pickupFlow,
        goyenaFlow,
        suipachaFlow,
        guzmanFlow,
        pedidoFlow,
        resumenFlow,
        confirmacionFlow,
        faqFlow,
    ])
    const adapterProvider = createProvider(Provider, {
        jwtToken: process.env.JWT_TOKEN,
        numberId: process.env.NUMBER_ID,
        verifyToken: process.env.SECRET_TOKEN,
        version: 'v21.0',
    })
    const adapterDB = new Database({ filename: 'db.json' })
    const { httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    httpServer(+PORT)
}

main()
