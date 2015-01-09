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
    this.paper = paper;

    this.getBBox = function() { return this.path.getBBox(); }

    this.initPointHandles = function (){
        var paper = this.paper;
        var curve = this;
        var handlePath = [];
        var prevSet;

        var i=0;
        while(i<this.pathArray.length){
            var set;
            switch (this.pathArray[i].length)
            {
            case 3:
                set = [ new PointHandle(paper, curve, i, 1) ];
//                handlePath.push(["M", e[1], e[2]]);
                break;

            case 7:
                prevSet.push( new PointHandle(paper, curve, i, 1) );
                prevSet[prevSet.length-2].followingPnts().push(prevSet[prevSet.length-1]);
                set = [
                    new PointHandle(paper, curve, i, 2),
                    new PointHandle(paper, curve, i, 3)
                ];
                set[1].followingPnts().push(set[0]);
//                handlePath.push(["L", e[1], e[2]]);
//                handlePath.push(["M", e[3], e[4]]);
//                handlePath.push(["L", e[5], e[6]]);
                break;
            }
            prevSet = set;
            i++;
        }
//        paper.path(handlePath).attr({stroke: "#000", "stroke-dasharray": "- "});
    }
}

function PointHandle(paper, curve, elementIdx, pntIdx){
    var isCubic = (curve.pathArray[elementIdx][0] === "C");

    //
    // Init the circle
    //
    var discattr = (isCubic && pntIdx < 3) ?
                    {fill: "#aaa", stroke: "#000"}: // ControlPoint
                    {fill: "#fff", stroke: "#000"}; // PathPoint
    this.circle = paper.circle(curve.pathArray[elementIdx][pntIdx*2-1],
                                    curve.pathArray[elementIdx][pntIdx*2], 5).attr(discattr);

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
