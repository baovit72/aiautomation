#target illustrator
///PARM error

//Handle
///AI 
//Processing
function convertFilePath(filePath){
    if(filePath.indexOf("~") !=-1) return filePath;
    return "\/"  + filePath.replace(/\\/g,"\/").replace(/:/g,"")
    }
function compare(color1,  color2){
        return ( Math.abs(color1.black- color2.black)<2 && Math.abs(color1.cyan- color2.cyan)<2 && Math.abs(color1.magenta- color2.magenta)<2 &&Math.abs(color1.yellow- color2.yellow)<2);
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
        var pluginItem = placedItem.trace();
        pluginItem.tracing.tracingOptions.loadFromPreset(opt.toString() + " Colors"); 
        //Goi action expand 
        app.doScript("Composition","Automation Set");

        app.redraw();
        //Tien hanh lay compound path
        var array = activeDoc.selection;
         var result = [];
         var offset = 15;
         while(result.length == 0 && offset <= 200){
        for(var i=  0; i< array.length; i++){
            $.sleep(5);
            //Compound path thi tach ra 
            try{
                if(array[i] instanceof CompoundPathItem )
                    {
                        var compoundPathItem = array[i];
                        for(var j = 0; j< compoundPathItem.pathItems.length; j++){
                            try{
                                    if((Math.abs(array[i].pathItems[j].position[0]  -  placedItem.position[0] )<offset&&Math.abs( array[i].pathItems[j].position[1]  -  placedItem.position[1]) <offset)  )
                                    {
                                             result.push(array[i].pathItems[j].fillColor); 
                                             break;
                                    }  
                            }
                            catch(e){ }
                            }
                       
                    }
                //Path item thi tien hanh kiem tra
                else{
                    try{
                      if((Math.abs(array[i].position[0]  -  placedItem.position[0] )<offset &&Math.abs( array[i].position[1]  -  placedItem.position[1]) < offset)  )
                            {
                                     result.push(array[i].fillColor); 
                                     break;
                            }  
                        }
                        catch(e){}
                    }
                }
            catch(e){
                try{
                    if(array[i] instanceof PathItem)
                     { if((Math.abs(array[i].position[0]  -  placedItem.position[0] )<offset &&Math.abs( array[i].position[1]  -  placedItem.position[1]) < offset)  )
                            {
                                     result.push(array[i].fillColor); 
                                     break;
                            }  
                    }
                    }
                catch(e){}
                }
              //  $.writeln(typeof(array[i]));
                //$.writeln(array[i].toString());
            }
        offset += 10;
       }
        //Bat dau deselect 
         if(result.length==0) return;
        for(var i=  0; i< array.length; i++){
            $.sleep(5);
            //Compound path thi tach ra 
            try{
                if(array[i] instanceof CompoundPathItem )
                    { 
                        var compoundPathItem = array[i];
                        for(var j = 0; j< compoundPathItem.pathItems.length; j++){
                                var item = array[i].pathItems[j];
                                if(!compare(item.fillColor,result[0])){
                                   item.selected = false;
                                    }
                                
                                $.writeln(item.fillColor.yellow);
                                
                            }
                      
                    }
                //Path item thi tien hanh kiem tra
                else{
                         var item = array[i];
                         if(!compare(item.fillColor,result[0]))
                                    item.selected = false;
                         $.writeln(typeof item.fillColor.yellow);
                    }
                
                
            }
        catch(e){
            try{
                        var item = array[i];
                         if(!compare(item.fillColor,result[0]))
                                    item.selected = false;
                         $.writeln(typeof item.fillColor.yellow);
                         }catch(e){};
            }
        }
        app.doScript("Clear","Automation Set");
        //Luu file
        activeDoc.exportFile(new File( generateOutputPath(imgPath)),ExportType.PNG8);
        ///
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
 