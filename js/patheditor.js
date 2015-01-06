function initPathEditor(paper, path, elementID){
    if (typeof paper == 'undefined')
        paper = Raphael(elementID);
    else
        paper.clear();
    var p = paper.path(path);//.attr({stroke: color || Raphael.getColor(), "stroke-width": 4, "stroke-linecap": "round"});
    var bBox = p.getBBox();
    paper.width = bBox.width + 10;
    paper.height = bBox.height + 10;
    p.translate(5, bBox.height + 5);
    paper.rect(bBox.x, bBox.y, bBox.width, bBox.height);
    return paper;
}
