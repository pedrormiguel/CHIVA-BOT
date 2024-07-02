import { addKeyword, EVENTS } from '@builderbot/bot';
import { flowWelcome } from './welcome.flow';

export const flowLocations = addKeyword(["lugares","ubicaciones"])
.addAnswer(["Puede pasar por cualquier de nuestros centros disponibles y participar por increibles premios :\n", "1.📍 ALM. HATUEY HERRERA", "2.📍 CDLC ENRIQUILLO", "3.📍 RON DEPOT REAL", "4.📍 ALBERT LICORES SD", "5.📍 RON DEPOT NACO", "6.📍 LICORMART KENNEDY", "7.📍 OCHO SANTOS JDP", "8.📍 VOCATUS LA VEGA","\n1. Volver al menu anterior."],null,null)
.addAction(async (ctx, bot) => {
    bot.endFlow("1. Volver al menu anterior."); 
})
