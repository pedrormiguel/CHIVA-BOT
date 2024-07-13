import { addKeyword } from '@builderbot/bot';
import { BaileysProvider } from '@builderbot/provider-baileys'
import path from 'path';
import { fileURLToPath } from 'url';
import { IDatabase } from '~/provider/json-provider.js';
import { uploadImageInde, uploadImageV2, uploadImageV3 } from '~/services/Services';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Assuming you have 'path' imported


const user = {
    phoneNumber: "",
    NameOfClient: "",
    ID: "",
    phoneNumberClient: "",
    filePathPurchase: "",
}

export const flowRegister = addKeyword<BaileysProvider, IDatabase>(["concurso", "participar"])
    .addAnswer("Para registrarnos en el concurso, vamos a necesitar conocer algunas cosas sobre ti.\n\n")

    //Capture NameOfClient
    .addAnswer("Por favor, escriba su el *nombre del cliente* :", { capture: true },
        async (ctx, bot) => {

            if (!(ctx.body.length > 4))
                bot.fallBack("Por favor intentanuevamente, su el *nombre del cliente* :")

            user.NameOfClient = ctx.body;
            user.phoneNumber = ctx.from;
        })

    //Capture Cedula
    .addAnswer("Por favor, escriba su *cedula* (Solo números) :", { capture: true },
        async (ctx, bot) => {

            if (!(ctx.body.length === 11))
                bot.fallBack("Por favor intentanuevamente, escriba su *cedula* (Solo números) :")

            user.ID = ctx.body;
        })


    //Capture phoneNumberClient
    .addAnswer("Por favor, escriba el *número del cliente* :", { capture: true },
        async (ctx, bot) => {

            if (!(ctx.body.length > 10))
                bot.fallBack("Por favor intentanuevamente, escriba el *número del cliente* :")

            user.phoneNumberClient = ctx.body;
        })

    // Capture Image
    .addAnswer("Favor de tomar una foto de su comprobante donde se visualice los datos correctamente :", { capture: true },

        async (ctx, bot) => {

            let localPath;

            if (ctx.body.includes("image"))
                bot.fallBack("Debe enviar una imagen valida de la factura, debe ser legible.")

            try {
                localPath = await bot.provider.saveFile(ctx, { path: path.join(__dirname) });
            } catch (error) {
                bot.fallBack("Error al capturar la imagen, trata nuevamente.\nFavor enviarla nuevamente :")
            }

            user.filePathPurchase = localPath;
        })

    //Upload File 
    .addAction(async (ctx, bot) => {
        const statusCall = await uploadImageInde(user.filePathPurchase)
        console.log(statusCall)

        if (statusCall.status === false) {
            bot.fallBack("Ha ocurrido un error, por favor intenta nuevamente.")
        }

        user.filePathPurchase = statusCall.url;
    })

    //Save data
    .addAction(async (ctx, bot) => {

        // SaveData(user);
        const statusCall = await uploadImageV3(user.phoneNumber, user.NameOfClient, user.ID, user.phoneNumberClient,user.filePathPurchase)

        if (!statusCall) {
            bot.endFlow("Ha ocurrido un error, por favor intenta nuevamente.")
        }

        bot.endFlow(`Excelente, ya estas participando en nuestra rifa para grandes premios. No.${statusCall.url}`)
    })