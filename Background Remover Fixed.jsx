#target illustrator
///PARM error

//Handle
///AI 
//Processing
function convertFilePath(filePath){
    if(filePath.indexOf("~") !=-1) return filePath;
    return "\/"  + filePath.replace(/\\/g,"\/").replace(/:/g,"")
    }
function compare(color){
        return (color.black >= 52  && color.yellow >=55 && color.cyan >= 60 && color.magenta >= 60) //|| (color.black ==0&&color.yellow <5 && color.cyan <5 && color.magenta < 5));
    }

function getAllPathItems(compoundPath){
    //Tao danh sach cac pathitem 
    var pathis = [];
    for(var j = 0; j< compoundPath.pathItems.length; j++){
                    var item = array[i].pathItems[j];
                    if(!compare(item,result[0])){
                       item.selected = false;
                        }
                    
                    $.writeln(item.fillColor.yellow);
                    
                }
    }
//Tao thu muc output
function generateOutputPath(filePath){
       var holder = filePath.split("/");
       var filename = holder[holder.length-1];
       var procFolder = filePath.replace(filename,"") + "Processed/" ;
       var f = new Folder(procFolder);
        if (!f.exists)
            f.create();
       var newpath = procFolder + filename.split(".")[0] + ".png";
       return newpath; 
    }

function process(imgPath, opt)
{ 
        imgPath = convertFilePath (imgPath);
        //Kiem tra xem duong dan hop le
        try{
            var imgFile = new File( imgPath );
        }
        catch(e){
                return;
            }
        if(!imgFile.exists) return;
        if(parseInt(opt)<1||parseInt(opt)>30) return;
        app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
        var activeDoc  = app.documents.add()
        var placedItem = activeDoc.placedItems.add();
        placedItem.file = imgFile;
        activeDoc.fitArtboardToSelectedArt(0);
        var pluginItem = placedItem.trace();
        pluginItem.tracing.tracingOptions.loadFromPreset(opt.toString() + " Colors"); 
        //Goi action expand 
        app.doScript("Composition","Automation Set");
       //Deselect all paths
      // $.sleep(2000);
        app.doScript("Deselect","Automation Set");
        app.redraw();
        //Tien hanh lay compound path
        var array = activeDoc.pathItems;
         var result = [];
         var offset = 15;
         var compoundCount = 0, pathItemCount = 0;
          //$.writeln ("Number of path in doc " + array.length.toString());
          // $.writeln ("Position of Placed Item " + placedItem.position[0]+":" + placedItem.position[1]);
        var IsDone = false;
       // $.sleep(2000);
       activeDoc.selection = null;
        for(var i=  0; i< array.length; i++){ 
           //$.sleep(100);
            //Compound path thi tach ra 
           
                if(array[i].typename.toLowerCase() === "compoundpathitem" )
                    {
                        var compoundPathItem = array[i];
                        $.writeln ("This is a compound path item" + compoundPathItem.pathItems.length.toString());
                        for(var j = 0; j< compoundPathItem.pathItems.length; j++){
                            try{
                                if(compoundPathItem.pathItems[j].typename.toLowerCase() !== "pathitem") continue;
                                compoundCount++; 
                                //$.sleep(100);
                                 if(compare(compoundPathItem.pathItems[j].fillColor) && !IsDone )
                                {
                                         result.push(array[i].pathItems[j].fillColor); 
                                         array[i].pathItems[j].selected = true;
                                          //$.sleep(2000);
                                           app.doScript("Select same","Automation Set");
                                           // $.sleep(2000);
                                            app.doScript("Clear","Automation Set");
                                            // IsDone = true;
                                          $.writeln ("Clear ");
                                }   
                            $.writeln ("Position of Compound Item " + compoundPathItem.pathItems[j].position[0]+ ":" + compoundPathItem.pathItems[j].position[1]); 
                            }
                            catch(e){ }
                            }
                       
                    }
                //Path item thi tien hanh kiem tra
                else{
                     if(array[i].typename.toLowerCase() !== "pathitem") continue;
                      if(compare(array[i].fillColor)  && !IsDone )
                            {
                                     result.push(array[i].fillColor); 
                                     array[i].selected = true;
                                     // $.sleep(2000);
                                 app.doScript("Select same","Automation Set");
                                   // $.sleep(2000);
                                    app.doScript("Clear","Automation Set");
                                    // IsDone = true; 
                                          $.writeln ("Clear ");
                            }   
                       // $.writeln ("Position of Path Item " + array[i].position[0]+ ":" + array[i].position[1]);
                        pathItemCount++;
                  
                    }
            }
       
     
            //Luu file
            var exportOptions = new ExportOptionsPNG24();
            exportOptions.verticalScale = 416;
            exportOptions.horizontalScale = 416;
            activeDoc.exportFile(new File( generateOutputPath(imgPath)),ExportType.PNG24,exportOptions);
          
        $.writeln ( "Item in compound:" + compoundCount);
         $.writeln ( "Items:" + pathItemCount); 
        ///Thoat tab
       activeDoc.close(SaveOptions.DONOTSAVECHANGES);
        
} 
function csvparser(csvFile){
            if(!csvFile.exists)
                return false;
            var paths = [],opts = [];  
            csvFile.open('r', undefined, undefined);
            while( (line =  csvFile.readln())!=null  && line!=""){
                        try{
                                   var splittedValues = line.split(",");
                                    paths.push(splittedValues[0]);
                                    opts.push(splittedValues[1]); 
                               }
                        catch(e)
                        {
                            
                            }
                }
             return [paths,opts]; 
    }

function main(){ 
        var myFile = File.openDialog("CSV File"); 
        try{
            var infos = csvparser (myFile);
        }
        catch(e){
            return;
            }
        for(var i = 0; i<infos[0].length; i++){
            var iPath= infos[0][i];
            var opt = infos[1][i];
            try{
                   process(iPath,opt);  
                   $.sleep(1500);
                   logcat(myFile.path,[iPath,opt]);
            }
            catch(e){
                $.writeln("Process item error " +e );
                }
          }
}

function logcat(filePath, msg){ 
    var procFolder = filePath;
    var outputPath = procFolder +"/" +  logFile;
    outputPath = convertFilePath (outputPath);
    var outputFile = new File(outputPath);
    outputFile.open('a',undefined,undefined);
    outputFile.writeln (msg[0]+","+msg[1]);
    outputFile.close();
   }

var logFile = "processed.csv";
main();
 