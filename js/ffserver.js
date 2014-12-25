
function ffserverImageCall(foil, projection, dataCallback)
{
    var url = 'http://localhost:8080/image/' + projection;

    $.ajax(url, {
        type: "POST",
        contentType: "application/json",
        crossDomain: true,
        data: foil,
        success: function(data, textStatus, jqXHR)
        {
            dataCallback(data);
        },
        error: function(jqXHR, textStatus, errorThrown)
        {
            alert("failure");
        }
    });
}

function ffserverStlCall(foil, fileName, dataCallback)
{
    var url = 'http://localhost:8080/stl/' + fileName;

    $.ajax(url, {
        type: "POST",
        contentType: "application/json",
        crossDomain: true,
        data: foil,
        success: function(data, textStatus, jqXHR)
        {
            dataCallback(data);
        },
        error: function(jqXHR, textStatus, errorThrown)
        {
            alert("failure");
        }
    });
}

function setImage(foil, projection, imgId) {
    ffserverImageCall(foil, projection, function(data){
        document.getElementById(imgId).src = "data:image/png;base64," + data;
    });
}

function readFile(f, contentCallback)
{
    if (f) {
        var r = new FileReader();
        r.onload = function(e) {
            var content = e.target.result;
            contentCallback(content);
        }
        r.readAsText(f);
    }
    else {
        alert("Failed to load file");
    }
}
