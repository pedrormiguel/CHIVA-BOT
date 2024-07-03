import { addKeyword } from '@builderbot/bot';
// import { buttonsConfirmation, MenuButtonsLocations } from '~/utils';
import { BaileysProvider } from '@builderbot/provider-baileys'
import { IDatabase } from '~/provider/json-provider.js';
import { SaveData } from '../services/db.js';
import { uploadImage } from '~/services/Services.js';

const user = {
    fullName: "",
    id: "",
    phoneNumber: "",
    locationOfPurchased: "",
    filePath: "",
    NCFNumber: "",
    dateOfInsertation: null
}

export const flowRegister = addKeyword<BaileysProvider, IDatabase>(["concurso", "participar"])

    .addAnswer("Para registrarnos en el concurso, vamos a necesitar conocer algunas cosas sobre ti.\n\n",
        { capture: false, /*buttons: buttonsConfirmation*/ }, (ctx, bot) => { 
            if (ctx.body.includes('❌'))
                bot.endFlow("Gracias por su interes.") 
        
            
        })

    //Capture Full Name
    .addAnswer("Por favor, escriba su *nombre completo* : ",
        { capture: true, /*buttons: buttonsConfirmation*/ }, (ctx, bot) => {

            if (ctx.body.includes('❌'))
                bot.endFlow("Gracias por su interes.")

            if (!validateInput(ctx.body))
                bot.fallBack("Debe registrar un nombre valido :")

            
            user.fullName = ctx.body;
            user.phoneNumber = ctx.from;
        })

    //Capture ID
    .addAnswer("Por favor, escriba su *número de identificación* : ",
        { capture: true, /*buttons: buttonsConfirmation*/ }, (ctx, bot) => {

            if (ctx.body.includes('❌'))
                bot.endFlow("Gracias por su interes.")

            if (!validateInput(ctx.body))
                bot.fallBack("Debe registrar un nombre válido :")

            user.id = ctx.body;
            

        })

    //Capture locationOfPurchased

    .addAnswer(["Por favor, escriba el numero donde realizo su compra :", "1.📍 ALM. HATUEY HERRERA", "2.📍 CDLC ENRIQUILLO", "3.📍 RON DEPOT REAL", "4.📍 ALBERT LICORES SD", "5.📍 RON DEPOT NACO", "6.📍 LICORMART KENNEDY", "7.📍 OCHO SANTOS JDP", "8.📍 VOCATUS LA VEGA"])
   // .addAction(async (ctx, bot) => {
        //await bot.provider.sendList(ctx.from, MenuButtonsLocations)
   //})
    .addAction({ capture: true }, async (ctx, bot) => {

        //user.locationOfPurchased = ctx.body; 
        console.log(ctx)

        if (+ctx.body >= 1 && +ctx.body <= 8)
            bot.fallBack("Debe seleccionar una ubicación :")
            


        //user.locationOfPurchased = ctx.title_list_reply;
    })

    // Capture Image
    .addAnswer("Favor de tomar una foto de su comprobante donde se visualice los datos correctamente :", { capture: true }, async (ctx, bot) => {
        let localPath;
        

        console.log(ctx.message.Message)

        if (ctx.body.includes("image") )
            bot.fallBack("Debe enviar una imagen valida de la factura, debe ser legible.")

        try {
            localPath = await bot.provider.saveFile(ctx, { path: './src/local/img' })
        } catch (error) {
            bot.fallBack("Error al capturar la imagen, trata nuevamente.\nFavor enviarla nuevamente :")
        }
        user.filePath = localPath;
    })

    //Capture NFCNumber
    .addAnswer("Por favor, escriba la *numeracion unica (NCF) de su factura* : ",
        { capture: true, /*buttons: buttonsConfirmation*/ }, (ctx, bot) => {
            


            if (ctx.body.includes('❌'))
                bot.endFlow("Gracias por su interes.")

            if (!validateInput(ctx.body))
                bot.fallBack("Debe registrar un nombre válido :")

            user.NCFNumber = ctx.body;
        }) 

    //Save data
    .addAction(async (ctx,bot) => {
        user.dateOfInsertation = Date.now();
        SaveData(user);
        const statusCall = await uploadImage(user.filePath, user.fullName, user.id, user.phoneNumber, user.locationOfPurchased, user.NCFNumber, user.dateOfInsertation)

        if(!statusCall) {
            bot.endFlow("Ha ocurrido un error, por favor intenta nuevamente.")
        }

        bot.endFlow("Ya estas participando en la rifa para grandes, premios.")
    })


function validateInput(str) {

    const length = str.length;

    // Check if the string is empty
    if (length === 0) {
        return false;
    }

    // Check for minimum length (e.g., 5 characters)
    if (length < 5) {
        return false;
    }

    // Check if the string is alphanumeric
    // const alphanumericRegex = /^[a-z0-9]+$/i;
    // if (!alphanumericRegex.test(str)) {
    //     return false;
    // }

    // Check for leading and trailing whitespace
    if (str.trim() !== str) {
        return false;
    }

    // All checks passed
    return true;

}
