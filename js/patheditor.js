function initPathEditor(paper, path, elementID){

    // Initialize or clear the paper
    if (!isPaper(paper))
        paper = Raphael(elementID);
    else
        paper.clear();

    // Create the path
    var p = paper.path(path);//.attr({stroke: color || Raphael.getColor(), "stroke-width": 4, "stroke-linecap": "round"});
    var bBox = p.getBBox();
    paper.setViewBox(-5, -(bBox.height+5), paper.width + 10, paper.height + 10);
    createPointHandles(paper, p);

    // Decorate
    paper.rect(bBox.x, bBox.y, bBox.width, bBox.height);

    return paper;
}

function makeEditable(element){
    element.followingPnts = [];

    element.update = function(x, y){
        var X = this.attr("cx") + x,
            Y = this.attr("cy") + y;
        this.attr({cx: X, cy: Y});
        this.followingPnts.map( function(e){
           e.update(x, y);
        });
    }

    element.drag(move, up);

    return element;
}
function move(dx, dy) {
    this.update(dx - (this.dx || 0), dy - (this.dy || 0));
    this.dx = dx;
    this.dy = dy;
}
function up() {
    this.dx = this.dy = 0;
}

function createPointHandles(paper, path){
    var discattr = {fill: "#fff", stroke: "#000"}; //stroke: "none"};
    var discattr_cpnt = {fill: "#aaa", stroke: "#000"}; //stroke: "none"};
    var handlePath = [];
    var prevSet;
    path.realPath.map( function(e){
        var set;
        switch (e.length)
        {
        case 3:
            set = [ makeEditable(paper.circle(e[1], e[2], 5).attr(discattr)) ];
            handlePath.push(["M", e[1], e[2]]);
            break;

        case 7:
            prevSet.push( makeEditable(paper.circle(e[1], e[2], 5).attr(discattr_cpnt)) );
            prevSet[prevSet.length-2].followingPnts.push(prevSet[prevSet.length-1]);
            set = [
                makeEditable(paper.circle(e[3], e[4], 5).attr(discattr_cpnt)),
                makeEditable(paper.circle(e[5], e[6], 5).attr(discattr))
            ];
            set[1].followingPnts.push(set[0]);
            handlePath.push(["L", e[1], e[2]]);
            handlePath.push(["M", e[3], e[4]]);
            handlePath.push(["L", e[5], e[6]]);
            break;
        }
        prevSet = set;
    })
    paper.path(handlePath).attr({stroke: "#000", "stroke-dasharray": "- "});
}

function isPaper(obj){
    // If it looks like a duck and quacks like a duck, then it is a duck.
    if (typeof(obj)=="undefined") return false;
    if (typeof(obj.path)=="undefined") return false;
    return true;
}
