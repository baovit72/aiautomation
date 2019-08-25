#target illustrator
///PARM error
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

function process(filePath, opt)
{
    filePath = filePath.replace("\\","\/");
app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
var activeDoc  = app.documents.add()
var placedItem = activeDoc.placedItems.add();
placedItem.file = new File(filePath); 
var pluginItem = placedItem.trace();
pluginItem.tracing.tracingOptions.loadFromPreset(opt.toString() + " Colors"); 
//Goi action expand 
app.doScript("Composition","Default Actions");

app.redraw();
//Tien hanh lay compound path
var array = activeDoc.selection;
 var result = [];
for(var i=  0; i< array.length; i++){
    //Compound path thi tach ra 
        if(array[i] instanceof CompoundPathItem )
            {
                var compoundPathItem = array[i];
                for(var j = 0; j< compoundPathItem.pathItems.length; j++){
                    if((Math.abs(array[i].pathItems[j].position[0]  -  placedItem.position[0] )<10 &&Math.abs( array[i].pathItems[j].position[1]  -  placedItem.position[1]) < 10)  )
                    {
                             result.push(array[i].pathItems[j].fillColor); 
                             break;
                    }  
                    }
               
            }
        //Path item thi tien hanh kiem tra
        else{
              if((Math.abs(array[i].position[0]  -  placedItem.position[0] )<10 &&Math.abs( array[i].position[1]  -  placedItem.position[1]) < 10)  )
                    {
                             result.push(array[i].fillColor); 
                             break;
                    }  
            }
        
        $.writeln(typeof(array[i]));
        $.writeln(array[i].toString());
    }


//Bat dau deselect 
for(var i=  0; i< array.length; i++){
    //Compound path thi tach ra 
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
app.doScript("Clear","Default Actions");
//Luu file
activeDoc.exportFile(new File( generateOutputPath(filePath)),ExportType.PNG8);
///
activeDoc.close(SaveOptions.DONOTSAVECHANGES);

}
process("D:/test.jpg",3);