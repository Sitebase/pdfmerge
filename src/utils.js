const http = require('http');
const https = require('https');
const uuid = require('uuid/v1');
const fs = require('fs');
const hummus = require('hummus');

function getFileURL(filename) {
    const app = process.env.HEROKU_APP_NAME;
    const baseURL = app ? `https://${app}.herokuapp.com` : `http://localhost:${process.env.PORT}`;
    return `${baseURL}/files/${filename}`;
}

function getRandomFilePath(ext) {
    const filename = uuid();
    return `/tmp/pdfmerge/${filename}.${ext}`;
}

function downloadFile(url, dest) {
    const isHttps = url.indexOf('https:') == 0;
    return new Promise((resolve, reject) => {
        var file = fs.createWriteStream(dest);
        var request = (isHttps ? https : http).get(url, function(response) {
            response.pipe(file);
            file.on('finish', function() {
                file.close(() => resolve(dest));
            });
        }).on('error', function(err) { // Handle errors
            fs.unlink(dest);
            reject(err.message);
        });
    });
}

async function downloadFiles(urls) {
    return await Promise.all(urls.map(async (url) => {
        return await downloadFile(url, getRandomFilePath('pdf'))
    }));
}

function mergeLocalPDFFiles(paths) {
    const output = getRandomFilePath('pdf');
    const writer = hummus.createWriter(output);
    paths.map((file) => {
        writer.appendPDFPagesFromPDF(file);
    });
    writer.end();
    return output;
}

module.exports = {
    getFileURL,
    getRandomFilePath,
    downloadFile,
    downloadFiles,
    mergeLocalPDFFiles
};
