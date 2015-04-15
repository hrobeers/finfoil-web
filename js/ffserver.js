
function ffserverImageCall(foil, projection, dataCallback)
{
    var url = config.wsUrl + '/image/' + projection;

    $.post(url, foil)
        .done(function(data, textStatus, jqXHR){
            dataCallback(data);
        })
        .fail(function(jqXHR, textStatus, errorThrown){
            alert(jqXHR.responseText);
        });
}

function ffserverStlCall(foil, fileName, dataCallback)
{
    var url = config.wsUrl + '/stl/' + fileName;

    $.post(url, foil)
        .done(function(data, textStatus, jqXHR){
            dataCallback(data);
        })
        .fail(function(jqXHR, textStatus, errorThrown){
            alert(jqXHR.responseText);
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
