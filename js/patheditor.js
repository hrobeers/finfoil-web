function initPathEditor(paper, path, elementID){

    // Initialize or clear the paper
    if (!isPaper(paper))
        paper = Raphael(elementID);
    else
        paper.clear();

    // Create the path
    var p = new EditableCurve(paper, path);
    var bBox = p.getBBox();
    paper.setViewBox(-5, -(bBox.height+5), paper.width + 10, paper.height + 10);
    p.initPointHandles();

    // Decorate
    paper.rect(bBox.x, bBox.y, bBox.width, bBox.height);

    return paper;
}

function EditableCurve(paper, pathArray){
    this.pathArray = pathArray;
    this.path = paper.path(pathArray);
    this.handlePathArray = [];
    this.handlePath = {};
    this.paper = paper;

    this.getBBox = function() { return this.path.getBBox(); }

    this.initPointHandles = function (){
        var paper = this.paper;
        var curve = this;
        var prevSet;

        var i=0;
        while(i<this.pathArray.length){
            var set;
            switch (this.pathArray[i].length)
            {
            case 3:
                set = [ new PointHandle(paper, curve, i, 1, this.handlePathArray) ];
                break;

            case 7:
                prevSet.push( new PointHandle(paper, curve, i, 1, this.handlePathArray) );
                prevSet[prevSet.length-2].followingPnts().push(prevSet[prevSet.length-1]);
                set = [
                    new PointHandle(paper, curve, i, 2, this.handlePathArray),
                    new PointHandle(paper, curve, i, 3, this.handlePathArray)
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
}

function PointHandle(paper, curve, elementIdx, pntIdx, handlePathArray){
    // TODO support for "L"
    var isCubic = (curve.pathArray[elementIdx][0] === "C");

    var x = curve.pathArray[elementIdx][pntIdx*2-1];
    var y = curve.pathArray[elementIdx][pntIdx*2];

    var handleIdx = handlePathArray.length;

    //
    // Init the circle
    //
    var discattr = (isCubic && pntIdx < 3) ?
                    {fill: "#aaa", stroke: "#000"}: // ControlPoint
                    {fill: "#fff", stroke: "#000"}; // PathPoint
    this.circle = paper.circle(x, y, 5).attr(discattr);

    this.circle.followingPnts = [];

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

    //
    // PointHandle methods
    //
    this.followingPnts = function() { return this.circle.followingPnts; }
}

function isPaper(obj){
    // If it looks like a duck and quacks like a duck, then it is a duck.
    if (typeof(obj)=="undefined") return false;
    if (typeof(obj.path)=="undefined") return false;
    return true;
}
