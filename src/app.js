// index.js
import { createBot, createProvider, createFlow } from '@builderbot/bot';
import { JsonFileDB as Database } from '@builderbot/database-json';
import { MetaProvider as Provider } from '@builderbot/provider-meta';

import { createWelcomeFlow } from './flows/welcomeFlow.js';
import { createPedidoFlow } from './flows/pedidoFlow.js';
import { createResumenFlow } from './flows/resumenFlow.js';
import { createConfirmacionFlow } from './flows/confirmacionFlow.js';
import { createGoyenaFlow } from './flows/goyenaFlow.js';
import { createSuipachaFlow } from './flows/suipachaFlow.js';
import { createGuzmanFlow } from './flows/guzmanFlow.js';
import { createDeliveryFlow } from './flows/deliveryFlow.js';
import { createPickupFlow } from './flows/pickupFlow.js';
import { createFaqFlow } from './flows/faqFlow.js';
import { generalInquiryFlow } from './flows/generalInquiryFlow.js';
import { priceInquiryFlow } from './flows/priceInquiryFlow.js';

const PORT = process.env.PORT ?? 3002;

const flows = {};
// Inicializamos los flujos pasando el objeto "flows" para resolver dependencias circulares.
flows.welcomeFlow = createWelcomeFlow(flows);
flows.deliveryFlow = createDeliveryFlow(flows);
flows.pickupFlow = createPickupFlow(flows);
flows.goyenaFlow = createGoyenaFlow(flows);
flows.suipachaFlow = createSuipachaFlow(flows);
flows.guzmanFlow = createGuzmanFlow(flows);
flows.pedidoFlow = createPedidoFlow(flows);
flows.resumenFlow = createResumenFlow(flows);
flows.confirmacionFlow = createConfirmacionFlow(flows);
flows.faqFlow = createFaqFlow(flows);
flows.generalInquiryFlow = generalInquiryFlow(flows);
flows.priceInquiryFlow = priceInquiryFlow(flows);

const adapterFlow = createFlow(Object.values(flows));

const adapterProvider = createProvider(Provider, {
    jwtToken: process.env.JWT_TOKEN,
    numberId: process.env.NUMBER_ID,
    verifyToken: process.env.SECRET_TOKEN,
    version: 'v21.0',
});
const adapterDB = new Database({ filename: 'db.json' });

const main = async () => {
    const { httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });
    httpServer(+PORT);
};

main();
