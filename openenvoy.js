const fs = require('fs');

const LanguageDetails = {
    'js':{
        'inlineComment' : "//",
        'multilinecommentstart' : '/*',
        'multilinecommentend' : '*/',
        'variable' :['var','let','const']
    },
    'cpp':{
        'inlineComment' : "//",
        'multilinecommentstart' : '/*',
        'multilinecommentend' : '*/',
        'variable' :['int','str','float','double']
    },
};
const FinalAnalysis = {
    Total:0,
    Comment:0,
    Blank:0,
    Code:0,
    Variable:0
}

function analyzeCode(filePath,fileExt) {
  const fileLanguageDetails  = LanguageDetails[fileExt];
  const data = fs.readFileSync(filePath, 'utf8');
  const lines = data.split('\n');
  let totalLines = 0;
  let blankLines = 0;
  let commentLines = 0;
  let number0fVariables = 0;
  let inBlockComment = false;
  let inCodeBlock = false;

  lines.forEach(line => {
    totalLines++;

    const trimmedLine = line.trim();
    if(inCodeBlock){
        if(trimmedLine.indexOf('`') !== -1){
            inCodeBlock = false;
        }
        return;
    }

    if(trimmedLine.startsWith(fileLanguageDetails.multilinecommentstart)) {
        inBlockComment = true;
    }
    if(inBlockComment ) {
        commentLines++;
        if(trimmedLine.endsWith(fileLanguageDetails.multilinecommentend)){
            inBlockComment = false;
        }
        return;
    }
    if(trimmedLine == '' ){
        blankLines++;
        return;
    }
    if(trimmedLine.startsWith(fileLanguageDetails.inlineComment) ){
        commentLines++;
        return;
    }
    if(fileLanguageDetails.variable.includes(trimmedLine.split(' ')[0]) ){
        if(trimmedLine.indexOf('`') !==-1){
            inCodeBlock = true;
        }
        number0fVariables++;
    }

  });

  const loc = totalLines - (blankLines + commentLines);

  return {
    'totalLines': totalLines,
    'loc': loc,
    'blankLines': blankLines,
    'commentLines': commentLines,
    'number0fVariables': number0fVariables
  };
}


function addToFinalResult(fileAnalysis) {
    FinalAnalysis.Total += fileAnalysis.totalLines;
    FinalAnalysis.Code += fileAnalysis.loc;
    FinalAnalysis.Comment += fileAnalysis.commentLines;
    FinalAnalysis.Blank += fileAnalysis.blankLines;
    FinalAnalysis.Variable += fileAnalysis.number0fVariables;
}

const fileNames = process.argv.slice(2);
for(let i = 0; i < fileNames.length; i++){
    const fileName = fileNames[i];
    const fileExt = fileName.split('.')[1];
    const fileAnalysis = analyzeCode(fileName,fileExt);
    addToFinalResult(fileAnalysis);
    
    
}

console.log(FinalAnalysis);
