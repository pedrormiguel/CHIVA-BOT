import fetch from 'node-fetch';
import { readFile } from 'fs';
import { basename } from 'path';
import { promisify } from 'util';

const readFileAsync = promisify(readFile);

const api = "https://hook.us1.make.com/p6v4303lpodaswb9vbw36n7egamxih7n";
const api_v2 = "https://hook.us1.make.com/lufkgcl6s7upv9pft7uay7t9ldbl9d55";
const apiPhoto = "https://hook.us1.make.com/e3rvwy8wgta85eu2q87flagj4oye9paz"

export async function uploadImage(filePath, fullName, id, phoneNumber, locationOfPurchased, NCFNumber, dateOfInsertation) {

    try {
        const fileData = await readFileAsync(filePath);
        const fileName = basename(filePath);

        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('ID', id);
        formData.append('phoneNumber', phoneNumber);
        formData.append('locationOfPurchase', locationOfPurchased);
        formData.append('pathOfImage', filePath);
        formData.append('NCFId', NCFNumber);
        formData.append('nameOfFile', fileName);
        formData.append('dateOfInsertation', dateOfInsertation);
        const blob = new Blob([fileData], { type: "image/jpeg" });
        formData.append('data', blob);

        const response = await fetch(api, {
            method: 'POST',
            body: formData,
        });

        const contentType = response.headers.get('content-type');

        if (response.ok) {
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                console.log('Image uploaded successfully:', data);
            } else {
                const text = await response.text();
                console.log('Image uploaded successfully, response:', text);
            }
        } else {
            console.error('Image upload failed:', response.statusText);
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        return false
    }

    return true
}


export async function uploadImageV2(phoneNumber, filePathId, filePathPurchase) {


    const responseOutput = {
        status: false,
        url: null
    }

    try {
        const formData = new FormData();
        formData.append('phoneNumber', phoneNumber);
        formData.append('filePathId', filePathId);
        formData.append('filePathPurchase', filePathPurchase);

        const response = await fetch(api_v2, {
            method: 'POST',
            body: formData,
        });

        const contentType = response.headers.get('content-type');

        if (response.ok) {
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                console.log('Image uploaded successfully:', data);
                responseOutput.status = true;
                responseOutput.url = data;

            } else {
                const text = await response.text();
                console.log('Image uploaded successfully, response:', text);
                responseOutput.status = true;
                responseOutput.url = text;

            }
        } else {
            console.error('Image upload failed:', response.statusText);
        }
    } catch (error) {
        console.error('Error uploading image:', error);
    }

    return responseOutput
}

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
                responseOutput.status = true;
                responseOutput.url = text;

            }

        } else {
            console.error('Image upload failed:', response.statusText);

        }

    } catch (error) {
        console.error('Error uploading image:', error);
    }

    return responseOutput;
}