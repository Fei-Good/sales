var docxConverter = require('docx-pdf');

docxConverter('./白票out.docx','./output.pdf',function(err,result){
    if(err){
        console.log(err);
    }
    console.log('result'+result);
});

