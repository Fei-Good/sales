const JSZip = require('jszip');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const path = require('path');
//Load the docx file as a binary 'add.docx'

let getword=(box,filename)=>{
    const content = fs.readFileSync(path.resolve(__dirname, filename+".docx"), 'binary');
    const zip = new JSZip(content);
    const doc = new Docxtemplater();
    doc.loadZip(zip);
    //set the templateVariables
    doc.setData(box);
    try {
        doc.render()
    }
    catch (error) {
        var e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties,
        };
        console.log(JSON.stringify({error: e}));
        throw error;
    }
    var buf = doc.getZip().generate({type: 'nodebuffer'});
    // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
    fs.writeFileSync(path.resolve(__dirname, filename+"out.docx"), buf);
};

module.exports.getword = getword;