//https://stackoverflow.com/questions/25134998/how-to-give-a-unique-id-for-each-cell-when-adding-custom-columns

$("button#c").on("click", addColumn); 
$("button#r").on("click", addRow); 
$("table[data-canexpand]").on("click", "th:nth-child(n+2)", removeColumn);

let finalMap = new Map();

function getConfig() {
  console.log(JSON.parse($("textarea#thetextarea").val()));
  return $("textarea#thetextarea").val();
}

function removeColumn(e) {
  var currentCell = $(this);

  currentCell = colIndex = +currentCell.attr("data-colindex").split("#")[1];
  currentCell = forTable = $(this).parents("table").first();
  currentCell = rows = forTable.find("tr");

 
  if (rows.last().find("td").length < 2) {
    return alert("utolsó oszlop nem törölhető");
  }
  console.log(colIndex);
  rows.each(function (i, row) {
    row.removeChild(row.childNodes[colIndex]);
  });
  reNumber(forTable);
}

$("table[data-canexpand]").on("click", "tr td:nth-child(1)", removeRow); 


$("table[data-canexpand]").each(function (i, tbl) {
  reNumber($(tbl));
});


function reNumber(table, row, i) {
 
  if (row && $(row).find("th").length) {
    return numberColumnHeaders(row);
  }

  
  if (row) {
    return numberRow(row, i);
  }

  
  return $.each(table.find("tr"), function (i, row) {
    if (i > 0) {
      numberRow(row, i);
    } else {
      numberColumnHeaders(row);
    }
  });

  
  function numberRow(rw, rnr) {
    $(rw)
      .find("td")
      .each(function (j, cell) {
        void (
          (j > 0 && $(cell).attr("data-cellindex", "r" + rnr + "c" + j)) ||
          ($(cell).attr("data-rowindex", "row#" + rnr), $(cell).html(rnr - 1))
        );
      });
  }

  
  function numberColumnHeaders(headerRow) {
    $.each($(headerRow).find("th"), function (j, head) {
      $(head).attr("data-colindex", "col#" + j);
    });
  }
}


function addCell(currentRow, rownr) {
  console.log(currentRow + " : " + rownr);
  var nwcell = $(
    "<td>" + '<input type="text" id="new" size="5" maxlength="10" >'
  ).addClass("new");
  $(currentRow).append(nwcell);
}


function addColumnHeader(headerRow) {
  if (
    document.getElementById("addcolumn").value.match(/^ *$/) === null ||
    document.getElementById("addcolumn").value == ""
  ) {
    var nwcell = $(
      '<th> <input type="text" id="new" size="3" maxlength="10" value="' +
        document.getElementById("addcolumn").value +
        '"> ' +
        "</th>"
    );
    $(headerRow).append(nwcell);
    reNumber(null, headerRow);
  } else {
    alert("adj meg az ábécé egy betüjét");
  }
}


function addColumn() {
  if (
    document.getElementById("addcolumn").value.match(/^ *$/) === null ||
    document.getElementById("addcolumn").value == ""
  ) {
    var forTable = $("#" + $(this).attr("data-tableID"));
    $.each(forTable.find("tr"), function (i, row) {
      return i < 1 ? addColumnHeader(row) : addCell(row, i);
    });
    
    reNumber(forTable);
  } else {
    alert("meg kell adj az ábácá egy betüjét");
  }
}


function addRow(e) {
  
  var forTable = $("#" + $(this).attr("data-tableID")),
    nCells = forTable.find("tr").last().find("td").length,
    row = $("<tr>"),
    cell = $(
      "<td>" + '<input type="text" id="new" size="3" maxlength="10" required>'
    ).addClass("new");
  while (nCells) {
    row.append(cell.clone());
    nCells -= 1;
  }
  forTable.append(row);
  reNumber(null, row, forTable.find("tr").length - 1);
}


function removeRow() {
  var currentCell = $(this),
    row = currentCell.parents("tr").first(),
    forTable = currentCell.parents("table").first();
  if (forTable.find("tr").length < 3) {
    return alert("utlosó sort nem lehet törölni");
  }
  row.remove();
  reNumber(forTable);
}


function removeColumn(e) {
  var currentCell = $(this);
  console.log(currentCell);
  currentCell = colIndex = +currentCell.attr("data-colindex").split("#")[1];
  currentCell = forTable = $(this).parents("table").first();
  currentCell = rows = forTable.find("tr");

  
  if (rows.last().find("td").length < 2) {
    return alert("utlosó oszlopot nem lehet törölni");
  }
  console.log(colIndex);
  rows.each(function (i, row) {
    row.removeChild(row.childNodes[colIndex]);
  });
  reNumber(forTable);
}
//function tabletofile
document.getElementById('tabletofile').addEventListener('click', async e => {
 
  fetchToServer('savefile',JSON.stringify(fromTableToObject()))
      
})


//function submitTable
 document.getElementById('submitTable').addEventListener('click', async e => {
  
  Obj = await fetchToServer("appendToDiv", document.getElementById("fileSelect").value);

  Obj = JSON.parse(Obj);

 
  
  document.getElementById("theTable").innerHTML = ""

  properties = [];
  tableMap = new Map();

  for (var key in Obj) {
    if (Obj.hasOwnProperty(key)) {
      for (var key2 in Obj[key]) {
        if (Obj[key].hasOwnProperty(key2)) {
          properties.push(Obj[key][key2]);
        }
      }
      var fields = key.split(":");
      if (tableMap.has(fields[0]) == false)
        tableMap.set(fields[0], [fields[1], properties]);
      else tableMap.get(fields[0]).push(fields[1], properties);

      properties = [];
    }
  }


  header = [];
  temp = "";

  tableMap.forEach(function (value) {
    value.forEach(function (value2) {
      if (value2.length == 1) {
        if (header.includes(value2) == false) {
          header.push(value2);
          temp = value2;
        } else header.indexOf(temp);
      }
      if (value2 == "" && header.includes(value2) == false) header.push("");
    });
  });
  var table = document.getElementById("theTable");
  var hrow = table.insertRow(-1);
  hrow.insertCell(-1).innerHTML =
    "<input type='text' size='7' value='Táblázat'>";
  header.forEach(function (value) {
    hrow.insertCell(-1).innerHTML =
      "<input type='text' size='7' value='" + value + "'>";
  });

  tableMap.forEach(function (value, key) {
    onetime = true;
    var row = table.insertRow(-1);
    header.forEach(function (item) {
      if (onetime) {
        row.insertCell(-1).innerHTML =
          "<input type='text' size='7' value='" + key + "'>";
        onetime = false;
      }
      if (value[value.indexOf(item) + 1].length != 1) {
        row.insertCell(-1).innerHTML =
          "<input type='text' size='7' value='" +
          value[value.indexOf(item) + 1] +
          "'>";
        //console.log(value[value.indexOf(item)+1])
      } else {
        row.insertCell(-1).innerHTML = "<input type='text' size='7' value=>";
      }
    });
  });
});

function fromTableToObject(){
  fromTableObj = new Object()

  var table = document.getElementById("theTable");
  
  header = []
  
  for (i = 0; i < table.rows.length; i++) {
    
    row = table.rows.item(i).getElementsByTagName("input");
    

    for (var j = 0; j < row.length; j++) {
      if(i==0) header.push(row[j].value)
    }
    for (var j = 1; j < row.length; j++) {
      if(i !=0 && row[j].value != ""){
        
        keys = row[0].value+":"+header[j]
        values = { state: row[j].value.split(",")[0],value: row[j].value.split(",")[1],move: row[j].value.split(",")[2] }

        fromTableObj[keys] = values
      }
    }
  }
 
  return fromTableObj
}

