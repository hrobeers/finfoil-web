function initPathEditor(editor, pathArray, elementID, editable){

    // Initialize or clear the paper
    if (!isPathEditor(editor))
        editor = new PathEditor(elementID, pathArray, editable);
    else
        editor.init(elementID, pathArray, editable);

    return editor;
}

function PathEditor(elementID, pathArray, editable){
    this.isPathEditor = true;
    this.initialized = false;

    this.paper = Raphael(elementID); this.getPaper = function() { return this.paper; }
    this.init(elementID, pathArray, editable);
    this.initialized = true;
}

PathEditor.prototype.init = function(elementID, pathArray, editable)
{
    if (this.initialized)
        this.paper.clear();

    this.curve = new EditableCurve(pathArray, this);

    var bBox = this.curve.getBBox();
    this.paper.setViewBox(-5, -(bBox.height+5), this.paper.width + 10, this.paper.height + 10);
    this.paper.rect(bBox.x, bBox.y, bBox.width, bBox.height);

    if (editable)
        this.curve.initPointHandles();
}

function EditableCurve(pathArray, parent){
    this.getPaper = function() { return parent.getPaper(); }
    this.getCurve = function() { return this; }

    this.pathArray = pathArray;
    this.path = this.getPaper().path(pathArray);
    this.handlePathArray = [];
    this.handlePath = {};
}

EditableCurve.prototype.getBBox = function() { return this.path.getBBox(); }

EditableCurve.prototype.initPointHandles = function (){
    var paper = this.getPaper();
    var curve = this;
    var prevSet;

    var i=0;
    while(i<this.pathArray.length){
        var set;
        switch (this.pathArray[i].length)
        {
        case 3:
            set = [ new PointHandle(i, 1, this.handlePathArray, this) ];
            break;

        case 7:
            prevSet.push( new PointHandle(i, 1, this.handlePathArray, this) );
            prevSet[prevSet.length-2].followingPnts().push(prevSet[prevSet.length-1]);
            set = [
                new PointHandle(i, 2, this.handlePathArray, this),
                new PointHandle(i, 3, this.handlePathArray, this)
            ];
            set[1].followingPnts().push(set[0]);
            break;
        }
        prevSet = set;
        i++;
    }
    this.handlePath = paper.path().attr({stroke: "#000", "stroke-dasharray": "- "});
    this.handlePath.attr({path: this.handlePathArray});
}

function PointHandle(elementIdx, pntIdx, handlePathArray, parent){
    this.getPaper = function() { return parent.getPaper(); }
    this.getCurve = function() { return parent.getCurve(); }

    // TODO support for "L"
    var isCubic = (this.getCurve().pathArray[elementIdx][0] === "C");

    var x = this.getCurve().pathArray[elementIdx][pntIdx*2-1];
    var y = this.getCurve().pathArray[elementIdx][pntIdx*2];

    var handleIdx = handlePathArray.length;

    //
    // Init the circle
    //
    var discattr = (isCubic && pntIdx < 3) ?
                    {fill: "#aaa", stroke: "#000"}: // ControlPoint
                    {fill: "#fff", stroke: "#000"}; // PathPoint
    this.circle = this.getPaper().circle(x, y, 5).attr(discattr);

    this.circle.followingPnts = [];

    var curve = this.getCurve();
    this.circle.update = function(x, y){
        var X = this.attr("cx") + x,
            Y = this.attr("cy") + y;
        this.attr({cx: X, cy: Y});
        this.followingPnts.forEach( function(e){
           e.circle.update(x, y);
        });
        curve.pathArray[elementIdx][pntIdx*2-1] = X;
        curve.pathArray[elementIdx][pntIdx*2] = Y;
        curve.path.attr({path: curve.pathArray});

        curve.handlePathArray[handleIdx][1] = X;
        curve.handlePathArray[handleIdx][2] = Y;
        curve.handlePath.attr({path: curve.handlePathArray});
    };

    this.circle.move = function(dx, dy) {
        this.update(dx - (this.dx || 0), dy - (this.dy || 0));
        this.dx = dx;
        this.dy = dy;
    }
    this.circle.up = function() {
        this.dx = this.dy = 0;
    }
    this.circle.drag(this.circle.move, this.circle.up);

    //
    // Adding to the handlePathArray
    //
    if (isCubic)
    {
        switch (pntIdx)
        {
        case 2:
            handlePathArray.push(["M", x, y]);
            break;
        default:
            handlePathArray.push(["L", x, y]);
            break;
        }
    }
    else
    {
        handlePathArray.push(["M", x, y]);
    }
}

PointHandle.prototype.followingPnts = function() { return this.circle.followingPnts; }

function isPathEditor(obj){
    // If it looks like a duck and quacks like a duck, then it is a duck.
    if (typeof(obj)=="undefined") return false;
    if (typeof(obj.isPathEditor)=="undefined") return false;
    return true;
}
