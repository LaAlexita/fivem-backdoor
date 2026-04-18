const https = require('https');
const fs = require('fs');

// Los endpoints que descubrimos al desofuscar el código
const endpoints = ['qwertyJJ', 'qwertyJJgg', 'qwertyJJcfxre'];
const baseUrl = 'https://steaxscripts.com/';

console.log("Iniciando extracción segura de payloads...");

endpoints.forEach(endpoint => {
    const url = `${baseUrl}${endpoint}`;
    console.log(`[+] Intentando conectar a: ${url}`);

    https.get(url, (res) => {
        let data = "";

        // Recibir los fragmentos de datos
        res.on("data", (chunk) => {
            data += chunk;
        });

        // Cuando la descarga finaliza
        res.on("end", () => {
            // Replicamos la lógica del malware para descartar páginas falsas
            if (data === "404" || data.includes("<?php") || data.includes("<!DOCTYPE") || data.includes("<html>")) {
                console.log(`[-] [${endpoint}]: Endpoint inactivo o devolvió HTML/404.`);
            } else {
                console.log(`[!] [${endpoint}]: ¡Payload detectado! Tamaño: ${data.length} bytes.`);
                
                // GUARDADO SEGURO: Lo guardamos como .txt para evitar ejecución accidental
                const filename = `malware_payload_${endpoint}.txt`;
                try {
                    fs.writeFileSync(filename, data);
                    console.log(`[✔] [${endpoint}]: Payload guardado exitosamente en '${filename}'.`);
                } catch (err) {
                    console.error(`[x] [${endpoint}]: Error al guardar el archivo: ${err.message}`);
                }
            }
        });
    }).on("error", (err) => {
        console.error(`[x] [${endpoint}]: Error de conexión. El servidor remoto podría estar caído o bloqueado. (${err.message})`);
    });
});