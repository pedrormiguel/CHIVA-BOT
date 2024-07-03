import fetch from 'node-fetch';
import { readFile } from 'fs';
import { basename } from 'path';
import { promisify } from 'util';
const readFileAsync = promisify(readFile);

const apiPhoto = "https://hook.us1.make.com/e3rvwy8wgta85eu2q87flagj4oye9paz"

export async function uploadImageInde(filePath) {

    const responseOutput = {
        status: false,
        url: null
    }

    try {
        const fileData = await readFileAsync(filePath);
        const fileName = basename(filePath);

        const formData = new FormData();
        formData.append('pathOfImage', filePath);
        formData.append('nameOfFile', fileName);
        const blob = new Blob([fileData], { type: "image/jpeg" });
        formData.append('data', blob);

        const response = await fetch(apiPhoto, {
            method: 'POST',
            body: formData,
        });

        const contentType = response.headers.get('content-type');

        if (response.ok) {
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                console.log('Image uploaded successfully:', data);
                responseOutput.url = data;
            } else {
                const text = await response.text();
                console.log('Image uploaded successfully, response:', text);
            }

        } else {
            console.error('Image upload failed:', response.statusText);
        }

    } catch (error) {
        console.error('Error uploading image:', error);
        responseOutput.status = false
    }

    return responseOutput;
}

await uploadImageInde("D:/Project/base-ts-baileys-json/src/local/img/file-1719896719327.png")