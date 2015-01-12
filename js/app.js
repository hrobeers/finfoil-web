// $(document).ready(function(){

$( "#downlBtn" ).attr("disabled", true);
var currentStlFile;
var foil;

var outsideEditor;
var insideEditor;
var profileEditor;
var thicknessEditor;

function loadFile(evt) {
  //Retrieve the first (and only!) File from the FileList object
  var f = evt.target.files[0];

  readFile(f, function(content){
    foil = JSON.parse(content).foil;

    outsideEditor = initPathEditor(outsideEditor, foil.outline.path, "oImg");
    insideEditor = initPathEditor(insideEditor, foil.outline.path, "iImg");
    profileEditor = initPathEditor(profileEditor, foil.profile.topProfile, "pImg");
    thicknessEditor = initPathEditor(thicknessEditor, foil.thickness.topProfile, "tImg");
  });

  // Reset currentStlFile
  currentStlFile = "";
  $( "#downlBtn" ).attr("disabled", true);

  readFile(f, function(content){
    $( "#foil" ).empty().append( content );

    ffserverStlCall(content, f.name, function(data){
      currentFile = config.filesUrl + data;
      $( "#downlBtn" ).attr("disabled", false);
      $( "#permaLink" ).text(currentFile);
    });
  });
}

function download() {
  if (currentFile != "")
    window.location.href = currentFile;
}

document.getElementById('fileinput').addEventListener('change', loadFile, false);

//});
