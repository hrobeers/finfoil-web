
function ffserverImageCall(foil, projection, dataCallback)
{
    var url = config.wsUrl + '/image/' + projection;

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
    var url = config.wsUrl + '/stl/' + fileName;

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
