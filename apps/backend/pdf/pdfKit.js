const PDFDocument = require('pdfkit');
const fs = require('fs');
// const doc = new PDFDocument({bufferPages: true});

let getPdf=(inputMessage,username)=> {
    var doc = new PDFDocument({
        size: [683, 966],
        margins: { // by default, all are 72
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        }
    });
    doc.pipe(fs.createWriteStream("./pdf"+username+".pdf")); // write to PDF
    let y = -5;
    //第一页，背景图片
    doc.image('./bg.jpg', 0, 11, {width: 683});
    //打印信息
    doc.text(inputMessage.time, 421, 65+y);
    doc.text(inputMessage.adultPrice, 403, 87+y);
    doc.text(inputMessage.personAll, 205, 104+y);
    doc.text(inputMessage.totalLow, 403, 104+y);
    doc.text(inputMessage.adultNum, 205, 123+y);
    doc.text(inputMessage.childNum, 403, 122+y);
    doc.text(inputMessage.cloth, 351, 140+y);
    doc.text(inputMessage.plup, 478, 141+y);
    doc.text(inputMessage.totalUp, 135, 155+y);
    doc.text(inputMessage.phone, 133, 172+y);

    doc.end();
};

module.exports.getPdf = getPdf;


