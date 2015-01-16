
define(["config", "app/ffserver", "app/patheditor"],function(config, ffserver, pe){

var currentFileName;
var currentFoil;

var outsideEditor;
var insideEditor;
var profileEditor;
var thicknessEditor;

function loadFoil(foil) {
    outsideEditor = pe.initPathEditor(outsideEditor, foil.outline.path, "oImg", true);
    insideEditor = pe.initPathEditor(insideEditor, foil.outline.path, "iImg", false);
    profileEditor = pe.initPathEditor(profileEditor, foil.profile.topProfile, "pImg", true);
    thicknessEditor = pe.initPathEditor(thicknessEditor, foil.thickness.topProfile, "tImg", true);
    currentFoil = foil;
}

function loadFile(evt) {
  //Retrieve the first (and only!) File from the FileList object
  var f = evt.target.files[0];
  currentFileName = f.name;

  readFile(f, function(content){
    loadFoil(JSON.parse(content).foil);
  });
}

function download() {
  if (currentFileName === "")
  { /* TODO handle error*/ }

  ffserver.stlCall(JSON.stringify(currentFoil), currentFileName, function(data){
    var stlPath = config.filesUrl + data;
    $( "#permaLink" ).text(stlPath);
    window.location.href = stlPath;
  });

}

document.getElementById('fileinput').addEventListener('change', loadFile, false);
loadFoil(config.defaultFoil);
$( "#downlBtn" ).click(download);
$( "#downlBtn" ).attr("disabled", false);

});
