import { addKeyword } from '@builderbot/bot';
import { BaileysProvider } from '@builderbot/provider-baileys'
import { IDatabase } from '~/provider/json-provider.js';
import { uploadImageInde, uploadImageV2 } from '~/services/Services';

const user = {
    phoneNumber: "",
    filePathId: "",
    filePathPurchase: "",
}

export const flowRegister = addKeyword<BaileysProvider, IDatabase>(["concurso", "participar"])
    .addAnswer("Para registrarnos en el concurso, vamos a necesitar conocer algunas cosas sobre ti.\n\n")

    //Capture Cedula
    .addAnswer("Por favor, compartenos una foto de tu *cedula* :", { capture: true },
        async (ctx, bot) => {

            let localPath;

            if (ctx.body.includes("image"))
                bot.fallBack("Debe enviar una imagen valida de la factura, debe ser legible.")

            try {
                localPath = await bot.provider.saveFile(ctx, { path: './src/local/img' })
            } catch (error) {
                bot.fallBack("Error al capturar la imagen, trata nuevamente.\nFavor enviarla nuevamente :")
            }

            user.filePathId = localPath;
            user.phoneNumber = ctx.from;
        })

    //Upload File 
    .addAction(async (ctx, bot) => {

        const statusCall = await uploadImageInde(user.filePathId)
        console.log(statusCall)

        if (statusCall.status === false) {
            bot.fallBack("Ha ocurrido un error, por favor intenta nuevamente.")
        }

        user.filePathId = statusCall.url;
    })

    // Capture Image
    .addAnswer("Favor de tomar una foto de su comprobante donde se visualice los datos correctamente :", { capture: true },

        async (ctx, bot) => {

            let localPath;

            if (ctx.body.includes("image"))
                bot.fallBack("Debe enviar una imagen valida de la factura, debe ser legible.")

            try {
                localPath = await bot.provider.saveFile(ctx, { path: './src/local/img' })
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
        const statusCall = await uploadImageV2(user.phoneNumber, user.filePathId, user.filePathPurchase)

        if (!statusCall) {
            bot.endFlow("Ha ocurrido un error, por favor intenta nuevamente.")
        }

        bot.endFlow(`Excelente, ya estas participando en nuestra rifa para grandes premios. No.${statusCall.url}`)
    })