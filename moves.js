// Perfect scrollbar 
const ps = new PerfectScrollbar("#cells", {
    wheelSpeed: 15
  });
  

// row and columns 
for(let i=1;i<=100;i++) 
{
    let str = "";
    let n = i;
  
    while (n > 0) {
        let rem = n % 26;
        if (rem == 0) {
            str = "Z" + str;
            n = Math.floor(n / 26) - 1;
        } else {
            str = String.fromCharCode((rem - 1) + 65) + str;
            n = Math.floor(n / 26);
        }
    }
    $("#columns").append(`<div class="column-name">${str}</div>`)
    $("#rows").append(`<div class="row-name">${i}</div>`)
}

// cells
let cellData={
    "Sheet1":{}
}

let selectedsheet="Sheet1";
let totalSheet=1;

let deafaultProperties={
    "font-family": "Noto Sans",
  "font-size": 14,
  "text": "",
  "bold": false,
  "italic": false,
  "underlined": false,
  "alignment": "left",
  "color": "#444",
  "bgcolor": "#fff",
}


for (let i = 1; i <= 100; i++) {
    let row = $('<div class="cell-row"></div>');
    for (let j = 1; j <= 100; j++) {
        row.append(`<div id="row-${i}-col-${j}" class="input-cell" contenteditable="false"></div>`);
    }

    $("#cells").append(row);
  }

//to scroll

$("#cells").scroll(function (e) {
    $("#columns").scrollLeft(this.scrollLeft);
    $("#rows").scrollTop(this.scrollTop);
  });
  
  $(".input-cell").dblclick(function (e) {
      $(".input-cell.selected").removeClass("selected top-selected bottom-selected left-selected right-selected")
 $(this).addClass("selected");
      $(this).attr("contenteditable","true");
    $(this).focus();
  
  })

  $(".input-cell").blur(function(e) {
      $(this).attr("contenteditable","false");
      updateCellData("text", $(this).text());
  })

  // to select multiple cells through keyboard
  $(".input-cell").click(function(e){
      let [rowId,colId]=getRowCol(this);
    let [topCell, bottomCell, leftCell, rightCell] = getTopLeftBottomRightCell(rowId, colId);

      if(e.ctrlKey)
      {
          if($(this).hasClass("selected"))
          {
              unselectCell(this,e,topCell,bottomCell,leftCell,rightCell);
          }else{
              selectCell(this,e,topCell,bottomCell,leftCell,rightCell);
          }

      }else{
        
        selectCell(this,e,topCell,bottomCell,leftCell,rightCell);
      }


  })

  function  getRowCol(ele) {
     
    let ID=$(ele).attr("id");
    let arr=ID.split("-");
    return [parseInt(arr[1]),parseInt(arr[3])];

  }

  function getTopLeftBottomRightCell(rowId,colId){

    let topCell = $(`#row-${rowId - 1}-col-${colId}`);
    let bottomCell = $(`#row-${rowId + 1}-col-${colId}`);
    let leftCell = $(`#row-${rowId}-col-${colId - 1}`);
    let rightCell = $(`#row-${rowId}-col-${colId + 1}`);
    return [topCell, bottomCell, leftCell, rightCell];

  }

function selectCell(ele,e,topCell,bottomCell,leftCell,rightCell){

 if(e.ctrlKey)
 {
            
     let topSelected;
     if(topCell)
      {
          topSelected=topCell.hasClass("selected");
      }
      let bottomSelected;
     if(bottomCell)
      {
          bottomSelected=bottomCell.hasClass("selected");
      }
      let leftSelected;
     if(leftCell)
      {
          leftSelected=leftCell.hasClass("selected");
      }
      let rightSelected;
     if(rightCell)
      {
          rightSelected=rightCell.hasClass("selected");
      }

      if(topSelected)
       {
           $(ele).addClass("top-selected");
           topCell.addClass("bottom-selected");
       }

       if(bottomSelected)
       {
           $(ele).addClass("bottom-selected");
           bottomCell.addClass("top-selected");
       }
       if(leftSelected)
       {
           $(ele).addClass("left-selected");
           leftCell.addClass("right-selected");
       }
       if(rightSelected)
       {
           $(ele).addClass("right-selected");
           rightCell.addClass("left-selected");
       }

 }else{

    $(".input-cell.selected").removeClass("selected top-selected bottom-selected left-selected right-selected");
 }


 $(ele).addClass("selected");
changeHeader(getRowCol(ele));
}

function changeHeader([rowId,colId])
{ 
    
    //###################################################################################
console.log(cellData);
   let data;

   if(cellData[selectedsheet][rowId - 1]!=undefined && cellData[selectedsheet][rowId - 1][colId - 1]!=undefined)
   { 
       data=cellData[selectedsheet][rowId - 1][colId - 1];
   }else{
 
     data=deafaultProperties;

   }

    $(".alignment.selected").removeClass("selected");
    $(`.alignment[data-type=${data.alignment}]`).addClass("selected");
    addRemoveSelectFromFontStyle(data, "bold");
    addRemoveSelectFromFontStyle(data, "italic");
    addRemoveSelectFromFontStyle(data, "underlined");
    $(`#fill-color`).css("border-bottom",`4px solid ${data.bgcolor}`)
    $("#text-color").css("border-bottom",`4px solid ${data.color}`);
    $("#font-family").css("font-family",data["font-family"]);
    $("#font-size").val(data["font-size"]);
    $("#font-family").val(data["font-family"]);

}

function addRemoveSelectFromFontStyle(data, property) {
    if (data[property]) {
        $(`#${property}`).addClass("selected");
    } else {
        $(`#${property}`).removeClass("selected");
    }
  }

function unselectCell(ele,e,topCell,bottomCell,leftCell,rightCell){

    if($(ele).attr("contenteditable")=="false"){

        if($(ele).hasClass("top-selected"))
        {
            topCell.removeClass("bottom-selected");
        }
        if($(ele).hasClass("bottom-selected"))
        {
            bottomCell.removeClass("top-selected");
        }
        if($(ele).hasClass("left-selected"))
        {
            leftCell.removeClass("right-selected");
        }
        if($(ele).hasClass("right-selected"))
        {
            rightCell.removeClass("left-selected");
        }
    
       $(ele).removeClass("selected top-selected bottom-selected left-selected right-selected");
    
    }
}



// to select multiple cells through mouse
let startcellSelected=false;
let startCell={};
let endCell={};
let scrollXRStarted = false;
let scrollXLStarted = false;

$(".input-cell").mousemove(function (e) {
    e.preventDefault();
        if(e.buttons==1 && !startcellSelected)
        {
            if (e.pageX > ($(window).width() - 10) && !scrollXRStarted) {
                scrollXR();
            } else if (e.pageX < (10) && !scrollXLStarted) {
                scrollXL();
            }

            let [rowId,colId]=getRowCol(this);
            startCell={"rowId":rowId,"colId":colId};
            startcellSelected=true;
             selectAllBetweenCells(startCell,startCell);
        }
})

$(".input-cell").mouseenter(function (e) {
    
    if(e.buttons==1 && startcellSelected)
    {
        if (e.pageX < ($(window).width() - 10) && scrollXRStarted) {
            clearInterval(scrollXRInterval);
            scrollXRStarted = false;
        }
  
        if (e.pageX > 10 && scrollXLStarted) {
            clearInterval(scrollXLInterval);
            scrollXLStarted = false;
        }

        let [rowId,colId]=getRowCol(this);
        endCell={"rowId":rowId,"colId":colId};
        selectAllBetweenCells(startCell,endCell);
    }else{
        startcellSelected=false;
    }
})


function selectAllBetweenCells(start, end) {

    $(".input-cell.selected").removeClass("selected top-selected bottom-selected left-selected right-selected");
    for (let i = Math.min(start.rowId, end.rowId); i <= Math.max(start.rowId, end.rowId); i++) {
        for (let j = Math.min(start.colId, end.colId); j <= Math.max(start.colId, end.colId); j++) {
            let [topCell, bottomCell, leftCell, rightCell] = getTopLeftBottomRightCell(i, j);
            selectCell($(`#row-${i}-col-${j}`)[0], { "ctrlKey": true }, topCell, bottomCell, leftCell, rightCell);
        }
    }
    }

    let scrollXRInterval;
    let scrollXLInterval;
    function scrollXR() {
      scrollXRStarted = true;
      scrollXRInterval = setInterval(() => {
          $("#cells").scrollLeft($("#cells").scrollLeft() + 100);
      }, 100);
    }
    
    
    function scrollXL() {
      scrollXLStarted = true;
      scrollXLInterval = setInterval(() => {
          $("#cells").scrollLeft($("#cells").scrollLeft() - 100);
      }, 100);
    }
    
      $(".data-container").mousemove(function (e) {
  e.preventDefault();
  if (e.buttons == 1) {
      if (e.pageX > ($(window).width() - 10) && !scrollXRStarted) {
          scrollXR();
      } else if (e.pageX < (10) && !scrollXLStarted) {
          scrollXL();
      }
  }
});

$(".data-container").mouseup(function (e) {
  clearInterval(scrollXRInterval);
  clearInterval(scrollXLInterval);
  scrollXRStarted = false;
  scrollXLStarted = false;
});

   
$(".alignment").click(function(e){

    let alignment=$(this).attr("data-type");
    $(".alignment.selected").removeClass("selected")
     $(this).addClass("selected");
     $(".input-cell.selected").css("text-align",alignment);
    // console.log(deafaultProperties);
     updateCellData("alignment",alignment);

    })
     

$("#bold").click(function(e) {
  
   setStyle(this,"bold","font-weight","bold");
})

$("#italic").click(function (e) {
    setStyle(this, "italic", "font-style", "italic");
  });
  
  $("#underlined").click(function (e) {
    setStyle(this, "underlined", "text-decoration", "underline");
  });
  

function setStyle(ele,property,key,value) {
    if($(ele).hasClass("selected"))
    {
          $(ele).removeClass("selected");
          $(".input-cell.selected").css(key,"");
        updateCellData(property,false);
         
    }else{

         $(ele).addClass("selected");
         $(".input-cell.selected").css(key,value);
         updateCellData(property,true);
         
    }

}


$(".pick-color").colorPick({
    'initialColor': "#abcd",
    'allowRecent': true,
    'recentMax': 5,
    'allowCustomColor': true,
    'palette': ["#1abc9c", "#16a085", "#2ecc71", "#27ae60", "#3498db", "#2980b9", "#9b59b6", "#8e44ad", "#34495e", "#2c3e50", "#f1c40f", "#f39c12", "#e67e22", "#d35400", "#e74c3c", "#c0392b", "#ecf0f1", "#bdc3c7", "#95a5a6", "#7f8c8d"],
    'onColorSelected': function () {

    if($((this.element.children()[1])).attr("id")=="fill-color")
    {
        $(".input-cell.selected").css("background-color",this.color);
        $(this.element.children()[1]).css("border-bottom",`4px solid ${this.color}`);
        updateCellData("bgcolor",this.color);
    }

    if($((this.element.children()[1])).attr("id")=="text-color")
    {
        $(".input-cell.selected").css("color",this.color);
        $(this.element.children()[1]).css("border-bottom",`4px solid ${this.color}`);
        updateCellData("color",this.color);
    }



    }
});


$("#fill-color").click(function (e) {
    setTimeout(() => {
        $(this).parent().click();
    }, 10);
});

$("#text-color").click(function (e) {
    setTimeout(() => {
        $(this).parent().click();
    }, 10);
});

$(".menu-selector").change(function (e) {
    let value=$(this).val();
    let key=$(this).attr("id");

    if(key=="font-family")
    {
        $("#font-family").css(key,value);
    }
if(!isNaN(value))
{
    value=parseInt(value);
}

$(".input-cell.selected").css(key,value);
 updateCellData(key,value);

})



function  updateCellData(property ,value) {
  
    let newCellData=JSON.stringify(cellData);
    if(value != deafaultProperties[property])
        {
            $(".input-cell.selected").each(function (idx,data) {
                let [rowId,colId]=getRowCol(data);
                if(cellData[selectedsheet][rowId - 1]==undefined)
                {
                    cellData[selectedsheet][rowId - 1]={};
                    cellData[selectedsheet][rowId - 1][colId - 1]={...deafaultProperties};
                    cellData[selectedsheet][rowId - 1][colId - 1][property]=value;
                    

                }else{
                  
                     if(cellData[selectedsheet][rowId - 1][colId - 1]==undefined)
                     {
                        cellData[selectedsheet][rowId - 1][colId - 1]={...deafaultProperties};
                        cellData[selectedsheet][rowId - 1][colId - 1][property]=value;  

                    }else{

                        cellData[selectedsheet][rowId - 1][colId - 1][property]=value;  

                     }
                   
                 }
            })
            
    
        }else{

            $(".input-cell.selected").each(function (idx,data) {
                let [rowId,colId]=getRowCol(data);

                if(cellData[selectedsheet][rowId - 1] && cellData[selectedsheet][rowId - 1][colId - 1])
                {
                    cellData[selectedsheet][rowId - 1][colId - 1][property]=value;
                    if(JSON.stringify(cellData[selectedsheet][rowId - 1][colId - 1])==JSON.stringify(deafaultProperties))
                    {
                            delete cellData[selectedsheet][rowId - 1][colId - 1];       
                           if(Object.keys(cellData[selectedsheet][rowId - 1]).length == 0)
                           {
                               delete cellData[selectedsheet][rowId - 1];
                           }                    
                    }
   
                }
            })
        
        }

        if(saved && newCellData!=JSON.stringify(cellData))
        {
            saved=false;
        }
}





let lastlyaddedSheet=1;
let saved=true;

function addSheetEvents() {
    $(".sheet-tab.selected").on("contextmenu",function (e) {
        e.preventDefault();
        
            selectSheet(this);
        

       $(".sheet-options-modal").remove();
       let modal=$(`<div class="sheet-options-modal">
       <div class="option sheet-rename">Rename</div>
       <div class="option sheet-delete">Delete</div>
    </div>`);
    
     modal.css({"left":e.pageX});
     $(".container").append(modal);
   $(".sheet-rename").click(function (e) {
       
          let renameModal=$(`<div class="sheet-modal-parent">
          <div class="sheet-rename-modal">
              <div class="sheet-modal-title">Rename Sheet</div>
      
              <div class="sheet-modal-input-container">
                  <span class="sheet-modal-input-title">Rename Sheet</span>
                  <input class="sheet-modal-input" type="text"/>
              </div>
      
              <div class="sheet-modal-confirmation">
               <div class="button yes-button">Ok</div>
               <div class="button no-button">Cancel</div>
              </div>
      
          </div>
      </div>`)

     $(".container").append(renameModal);
     $(".sheet-modal-input").focus();

    $(".no-button").click(function (e) {
        $(".sheet-modal-parent").remove(); 
    })
    $(".yes-button").click(function (e) {
          
        renameSheet();
    })
  
    $(".sheet-modal-input").keypress(function (e) {
        if(e.key=='Enter')
        {
            renameSheet();
        }

    })


   })


   $(".sheet-delete").click(function (e) {
     
    if(totalSheet>1)
    {

        let deleteModal=$(`<div class="sheet-modal-parent">
        <div class="sheet-delete-modal">
            <div class="sheet-modal-title">${selectedsheet}</div>
    
            <div class="sheet-modal-detail-container">
                <span class="sheet-modal-detail-title">Are you Sure?</span>
            </div>
    
            <div class="sheet-modal-confirmation">
             <div class="button yes-button">Delete</div>
             <div class="button no-button">Cancel</div>
            </div>
    
        </div>
    </div>`)
   
      $(".container").append(deleteModal);
   
       $(".no-button").click(function (e) {
           $(".sheet-modal-parent").remove(); 
       })
   
       $(".yes-button").click(function (e) {
           
           deleteSheet();
           
       })
   

    }else{
        alert("this sheet cannot be deleted");
    }
    
   })
    
    })
    
    $(".sheet-tab.selected").click(function (e) {
    
            selectSheet(this);    
        
    })
    
    
}
addSheetEvents();


$(".add-sheet").click(function (params) {
    saved=false;
    console.log("hello2");
    lastlyaddedSheet++;
    totalSheet++;
    cellData[`Sheet${lastlyaddedSheet}`]={};
    $(".sheet-tab.selected").removeClass("selected");
    let sheet=$(`<div class="sheet-tab selected">Sheet${lastlyaddedSheet}</div>`)
    $(".sheet-tab-container").append(sheet);
    selectSheet();
    addSheetEvents();
    $(".sheet-tab.selected")[0].scrollIntoView();
})


function selectSheet(ele) {
    if( ele && !$(ele).hasClass("selected"))
    {
        $(".sheet-tab.selected").removeClass("selected");
        $(ele).addClass("selected");

    }
  emptyPreviousSheet();
  selectedsheet=$(".sheet-tab.selected").text();
   loadCurrentSheet();
   $("#row-1-col-1").click();
}

function emptyPreviousSheet() {
    let data = cellData[selectedsheet];
    let rowKeys = Object.keys(data);
    for (let i of rowKeys) {
        let rowId = parseInt(i);
        let colKeys = Object.keys(data[rowId]);
        for (let j of colKeys) {
            let colId = parseInt(j);
            let cell = $(`#row-${rowId + 1}-col-${colId + 1}`);
            cell.text("");
            cell.css({
                "font-family": "NotoSans",
                "font-size": 14,
                "background-color": "#fff",
                "color": "#444",
                "font-weight": "",
                "font-style": "",
                "text-decoration": "",
                "text-align": "left"
            });
        }
    }
  }
  
  function loadCurrentSheet() {
    let data = cellData[selectedsheet];
    let rowKeys = Object.keys(data);
    for (let i of rowKeys) {
        let rowId = parseInt(i);
        let colKeys = Object.keys(data[rowId]);
        for (let j of colKeys) {
            let colId = parseInt(j);
            let cell = $(`#row-${rowId + 1}-col-${colId + 1}`);
            cell.text(data[rowId][colId].text);
            cell.css({
                "font-family": data[rowId][colId]["font-family"],
                "font-size": data[rowId][colId]["font-size"],
                "background-color": data[rowId][colId]["bgcolor"],
                "color": data[rowId][colId].color,
                "font-weight": data[rowId][colId].bold ? "bold" : "",
                "font-style": data[rowId][colId].italic ? "italic" : "",
                "text-decoration": data[rowId][colId].underlined ? "underline" : "",
                "text-align": data[rowId][colId].alignment
            });
        }
    }
  }
  

  $(".container").click(function  (e) {
      $(".sheet-options-modal").remove();
  })



  function  renameSheet()
  {
       let newSheetName=$(".sheet-modal-input").val();
        if(newSheetName && !Object.keys(cellData).includes(newSheetName))
         {
             saved=false;
               let newCellData={};

        for(let i of Object.keys(cellData))
            {
                    if(i==selectedsheet)
                    {
                         newCellData[newSheetName]=cellData[i]; 

                    }else{
                        newCellData[i]=cellData[i];

                    }

            }

               cellData=newCellData;
              selectedsheet=newSheetName;

              $(".sheet-tab.selected").text(newSheetName);
              $(".sheet-modal-parent").remove();
         }else{

                if(!$(".sheet-modal-input-container").hasClass("present")){

                    $(".sheet-modal-input-container").append(`<div class="rename-error">Sheet name is not Valid or it already exists</div>`)
                    $(".sheet-modal-input-container").addClass("present");
                }
                

         }


  }



  
function deleteSheet() {

    $(".sheet-modal-parent").remove();

    let sheetIndex = Object.keys(cellData).indexOf(selectedsheet);

    //select the current selecsted Sheet from bottom container through its class;
    let currSelectedSheet = $(".sheet-tab.selected");

    //to select the next or prev sheet we pass it to selectSheet(this)-> so that the function update the sheet data and the selectedsheet; 
    if (sheetIndex == 0) {
        selectSheet(currSelectedSheet.next()[0]);
    } else {
        selectSheet(currSelectedSheet.prev()[0]);
    }
    //remove the data from the cells
    delete cellData[currSelectedSheet.text()];

    //remove the respective sheet1,sheet2,sheet3  from bottom container
    currSelectedSheet.remove();
    totalSheet--;
  }


  $(".scroller").click(function(e){
   let idx=Object.keys(cellData).indexOf(selectedsheet);
   let currSelectedSheet=$(".sheet-tab.selected");

   if($(this).hasClass("left-scroller"))
   {
        if(idx!=0)
        {
        selectSheet(currSelectedSheet.prev()[0]);
        currSelectedSheet[0].scrollIntoView();
        }

   }else{

        if(idx!=Object.keys(cellData).length-1)
        {
        selectSheet(currSelectedSheet.next()[0]);
        currSelectedSheet[0].scrollIntoView();
        }
   }
   

  })


 $(".file").click(function(e){

     
 
      if($(this).hasClass("selected"))
       {
           $(".file-bar").remove();

       }else{
       
    let filemodal=$(`<div class="file-bar ">
    <div class="file-menu">
        <div class=" file-menu-options Close"><span class="material-icons">west</span>Close</div>
        <div class="  file-menu-options new"><span class="material-icons">insert_drive_file</span>New</div>
        <div class="  file-menu-options open"><span class="material-icons">folder_open</span>Open</div>
        <div class="  file-menu-options save"><span class="material-icons">save</span>Save</div>
    </div>
    
    <div class="documents-menu"></div>
    <div class="transparent-menu"></div>
    </div>
    `)
     
    
       $(".container").append(filemodal);
       $(".file-bar").animate({width:"100vw"},100,"swing");
       $(".Close,.transparent-menu, .new, .save, .open").click(function(e){

         $(".file-bar").animate({width: "0vw"},100,"swing",()=>{
                $(".file-bar").remove();
         })       

     })

     $(".new").click(function(e){

        if(saved)
        {
           newFile();

        }else{

            let SavedModal=$(`<div class="sheet-modal-parent">
        <div class="sheet-delete-modal">
            <div class="sheet-modal-title">${$(".title").text()}</div>
    
            <div class="sheet-modal-detail-container">
                <span class="sheet-modal-detail-title">Do You Want To Save Changes?</span>
            </div>
    
            <div class="sheet-modal-confirmation">
             <div class="button yes-button">Yes</div>
             <div class="button no-button">No</div>
            </div>
    
        </div>
    </div>`)

             $(".container").append(SavedModal);

             $(".yes-button").click(function(e){
                 
                $(".sheet-modal-parent").remove();
                  saveFile(true);               
                 
               //  newFile();  
             })

             $(".no-button").click(function(e){
                   
                 $(".sheet-modal-parent").remove();
                 newFile();  
                     
             })                          
         }
         })////////

      $(".save").click(function (e){
           saveFile()    
      })

        $(".open").click(function (e){
            
              openFile();

        })

       }

 }) 


 function saveFile(currClick)
 {

   $(".container").append($(`<div class="sheet-modal-parent">
   <div class="sheet-rename-modal">
       <div class="sheet-modal-title">File Name</div>

       <div class="sheet-modal-input-container">
           <span class="sheet-modal-input-title">Rename Sheet</span>
           <input class="sheet-modal-input" value="${$(".title").text()}" type="text"/>
       </div>

       <div class="sheet-modal-confirmation">
        <div class="button yes-button">Ok</div>
        <div class="button no-button">Cancel</div>
       </div>

   </div>
</div>`))


$(".yes-button").click(function(e){
      
    $(".title").text($(".sheet-modal-input").val());
    let a=document.createElement("a");
    a.href=`data:application/json,${encodeURIComponent( JSON.stringify(cellData))}`;
    a.download=$('.title').text()+'.json';
    $(".container").append(a);
    a.click();
    a.remove();
    // $(".sheet-modal-parent").remove();
    // $(".file-bar").remove(); 
    saved=true;
})

   $(".no-button,.yes-button").click(function(e){
         
    $(".sheet-modal-parent").remove();
          $(".file-bar").remove(); 

          if(currClick){
              newFile();
          }
   })    

 }

    function newFile()
    {   emptyPreviousSheet();
        cellData={"Sheet1":{}};
        $(".sheet-tab").remove();
       totalSheet=0;
       lastlyaddedSheet=0;
       selectedsheet="Sheet1";
       $(".Close").click();
         $(".add-sheet").click();

    }

    function openFile()
    {
          
        let inputFile=$(`<input accept="application/json" type="file" />`)
        $(".container").append(inputFile);
            inputFile.click();
  inputFile.change(function(e){
     let file=e.target.files[0];
     $(".title").text(file.name.split(".json")[0]);
     let reader=new FileReader();
     reader.readAsText(file);
     reader.onload=()=>{
          let data=JSON.parse(reader.result);
          
         emptyPreviousSheet();
          $(".sheet-tab").remove();
          totalSheet=0;
          lastlyaddedSheet=0;
          cellData=data;

          let sheets=Object.keys(cellData);
          for(let i=0;i<sheets.length;i++)
          {
               lastlyaddedSheet++;
                totalSheet++;
               
                let sheet=$(`<div class="sheet-tab selected">${sheets[i]}</div>`)
                $(".sheet-tab-container").append(sheet);
               
          }

          addSheetEvents();
        $(".sheet-tab.selected").removeClass("selected");
        $($(".sheet-tab")[0]).addClass("selected");
       selectedsheet=sheets[0];
          loadCurrentSheet();
          inputFile.remove();
       }
  }) 
}

let clipboard={startCell:[] ,cellData :{}}

$("#copy").click(function(e){
    clipboard={startCell:[] ,cellData :{}}
 clipboard.startCell=getRowCol($(".input-cell.selected")[0]);


 $(".input-cell.selected").each(function(idx,data){

  let [rowId,colId]=getRowCol(data);

  if(cellData[selectedsheet][rowId - 1]!=undefined && cellData[selectedsheet][rowId - 1][colId - 1]!=undefined)
   {
       console.log("hello");
        if(!clipboard.cellData[rowId])
          {
              clipboard.cellData[rowId]={};
          }
          clipboard.cellData[rowId][colId]={...cellData[selectedsheet][rowId - 1][colId - 1]}
   }

 });

})


$("#cut").click(function(e){
    clipboard={startCell:[] ,cellData :{}}
    clipboard.startCell=getRowCol($(".input-cell.selected")[0]);
   
   

    $(".input-cell.selected").each(function(idx,data){
    console.log("hello");
     let [rowId,colId]=getRowCol(data);
   



     
     if(cellData[selectedsheet][rowId - 1]!=undefined && cellData[selectedsheet][rowId - 1][colId - 1]!=undefined)
      {
           if(!clipboard.cellData[rowId])
             {
                 clipboard.cellData[rowId]={};
             }
             clipboard.cellData[rowId][colId]={...cellData[selectedsheet][rowId - 1][colId - 1]}
             console.log(cellData[selectedsheet][rowId - 1][colId - 1]);
             delete cellData[selectedsheet][rowId - 1][colId - 1];
            cellData[selectedsheet][rowId - 1][colId - 1]={...deafaultProperties};
             

             loadCurrentSheet();

        } 
   
    });
   
   

   })
   
   

$("#paste").click(function(e){

let startCell=getRowCol($(".input-cell.selected")[0]);
 let rows=Object.keys(clipboard.cellData);

 for(let i of rows)
 {
       let cols=Object.keys(clipboard.cellData[i]);

       for(let j of cols)
          {

            let rowDistance=parseInt(i) - parseInt(clipboard.startCell[0]);
            let colDistance=parseInt(j) - parseInt(clipboard.startCell[1]);

            if(!cellData[selectedsheet][startCell[0] + rowDistance - 1])
            {
                cellData[selectedsheet][startCell[0] + rowDistance - 1]={};

            }
cellData[selectedsheet][startCell[0] + rowDistance - 1][startCell[1] + colDistance - 1]={...clipboard.cellData[i][j]}

          }


 }

 loadCurrentSheet();

})











