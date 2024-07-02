import { addAnswer, addKeyword, EVENTS } from '@builderbot/bot';
import { flowRegister } from './register.flow';
import { flowLocations } from './locations.flow';

const menuOpciones = "Selecciona : \n\n1. Participar en Concurso.\n\n2. Ver centros disponibles.";

export const flowWelcome = addKeyword(EVENTS.WELCOME)
.addAnswer(["*Bienvenido* al servicio de atención al cliente de Chivas Regal, Ballantines y Royal Salute.\n", "Celebrando el Día del Padre.", menuOpciones])
.addAction({capture:true},async (ctx, bot) => {

        switch (ctx.body) {
            case "1":
                bot.gotoFlow(flowRegister);
                break;
            case "2":
                bot.gotoFlow(flowLocations);
                break;
            default:
                bot.fallBack("Por favor, escriba la opción correcta ( 1 ) o ( 2 ).");
                break;
        }
    })