function initPathEditor(paper, path, elementID){

    // Initialize or clear the paper
    if (!isPaper(paper))
        paper = Raphael(elementID);
    else
        paper.clear();

    // Create the path
    var p = paper.path(path);//.attr({stroke: color || Raphael.getColor(), "stroke-width": 4, "stroke-linecap": "round"});
    var bBox = p.getBBox();
    paper.width = bBox.width + 10;
    paper.height = bBox.height + 10;
    p.translate(5, bBox.height + 5);
    createPointHandles(paper, p);

    // Decorate
    paper.rect(bBox.x, bBox.y, bBox.width, bBox.height);

    return paper;
}

function createPointHandles(paper, path){
    var discattr = {fill: "#fff", stroke: "#000"}; //stroke: "none"};
    var discattr_cpnt = {fill: "#aaa", stroke: "#000"}; //stroke: "none"};
    var handlePath = [];
    path.realPath.map( function(e){
        switch (e.length)
        {
        case 3:
            paper.circle(e[1], e[2], 5).transform(path.matrix.toTransformString()).attr(discattr);
            handlePath.push(["M", e[1], e[2]]);
            break;

        case 7:
            paper.circle(e[1], e[2], 5).transform(path.matrix.toTransformString()).attr(discattr_cpnt);
            paper.circle(e[3], e[4], 5).transform(path.matrix.toTransformString()).attr(discattr_cpnt);
            paper.circle(e[5], e[6], 5).transform(path.matrix.toTransformString()).attr(discattr);
            handlePath.push(["L", e[1], e[2]]);
            handlePath.push(["M", e[3], e[4]]);
            handlePath.push(["L", e[5], e[6]]);
            break;
        }
    })
    paper.path(handlePath).transform(path.matrix.toTransformString()).attr({stroke: "#000", "stroke-dasharray": "- "});
}

function isPaper(obj){
    // If it looks like a duck and quacks like a duck, then it is a duck.
    if (typeof(obj)=="undefined") return false;
    if (typeof(obj.path)=="undefined") return false;
    return true;
}
