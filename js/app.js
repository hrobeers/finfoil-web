// $(document).ready(function(){

$( "#downlBtn" ).attr("disabled", true);

var currentFileName;
var foil;

var outsideEditor;
var insideEditor;
var profileEditor;
var thicknessEditor;

function loadFile(evt) {
  //Retrieve the first (and only!) File from the FileList object
  var f = evt.target.files[0];
  currentFileName = f.name;

  readFile(f, function(content){
    foil = JSON.parse(content).foil;

    outsideEditor = initPathEditor(outsideEditor, foil.outline.path, "oImg");
    insideEditor = initPathEditor(insideEditor, foil.outline.path, "iImg");
    profileEditor = initPathEditor(profileEditor, foil.profile.topProfile, "pImg");
    thicknessEditor = initPathEditor(thicknessEditor, foil.thickness.topProfile, "tImg");
  });

  $( "#downlBtn" ).attr("disabled", false);
}

function download() {
  if (currentFileName === "")
  { /* TODO handle error*/ }

  ffserverStlCall(JSON.stringify(foil), currentFileName, function(data){
    var stlPath = config.filesUrl + data;
    $( "#permaLink" ).text(stlPath);
    window.location.href = stlPath;
  });

}

document.getElementById('fileinput').addEventListener('change', loadFile, false);

//});
