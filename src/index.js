const express = require('express')
const bodyParser = require('body-parser')
const info = require('../package.json')
const port = process.env.PORT;
const {
    getRandomFilePath,
    downloadFiles,
    mergeLocalPDFFiles,
    getFileURL
} = require('./utils');

const app = express()
app.use(express.urlencoded());
app.use('/samples', express.static('samples'))
app.use('/files', express.static('/tmp/pdfmerge'))

app.get('/', (req, res) => res.json({
    name: info.name,
    version: info.version
}))

app.post('/', async (req, res) => {
    const files = req.body.files.split(',');
    console.log('files', files);

    const localFiles = await downloadFiles(files);
    const output = mergeLocalPDFFiles(localFiles);

    console.log('local file is', output);
    const outputFilename = output.replace('/tmp/pdfmerge/', '');
    res.json({
        output: getFileURL(outputFilename)
    });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
