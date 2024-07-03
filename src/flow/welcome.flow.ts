import { addAnswer, addKeyword, EVENTS } from '@builderbot/bot';
import { flowRegister } from './register.flow';

const menuOpciones = "Selecciona : \n\n*1.* Participar en Concurso.\n";

export const flowWelcome = addKeyword(EVENTS.WELCOME)
.addAnswer(["*Bienvenido* y gracias por confiar en nosotros Chivas Regal, Ballantines y Royal Salute.\n", "Para celebrar el Día del Padre tenemos grandes premios.", menuOpciones])
.addAction({capture:true},async (ctx, bot) => {

        switch (ctx.body) {
            case "1":
                bot.gotoFlow(flowRegister);
                break;
            default:
                bot.fallBack("Por favor, escriba la opción correcta ( 1 ).");
                break;
        }
    })