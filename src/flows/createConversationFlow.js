// flows/createConversationFlow.js
import { addKeyword } from '@builderbot/bot'

export const createConversationFlow = () =>
  addKeyword(['sucursal_puesto'], { sensitive: true })
    .addAnswer(
      'Procesando...',
      {},
      async (ctx, { endFlow }) => {
        return endFlow('La conversación se ha activado exitosamente por 24hs.')
      }
    )
