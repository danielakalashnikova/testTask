//Создаем канвас
function create_canvas() {
    var canvas_html = document.createElement('canvas');
    canvas_html.id = "canvas";
    canvas_html.width = 1500;
    canvas_html.height = 800;
 
    document.body.appendChild(canvas_html);
    return canvas_html.getContext('2d');
 
}
 
// координатные оси
function drawCoordLines() {
    canvas.beginPath();
    canvas.moveTo(300, 10);
    canvas.lineTo(300, 400);
    canvas.moveTo(10, 220);
    canvas.lineTo(600, 220);
    canvas.stroke();
    canvas.closePath();
}
 
//рисуем многоугольник
function drawPol() {
    canvas.beginPath();
    canvas.moveTo(300 + polygon[0].x, 220 - polygon[0].y);
    for (d in polygon) {
        canvas.lineTo(300 + polygon[d].x, 220 - polygon[d].y);
    }
    canvas.closePath();
    canvas.stroke();
}
 
// перерисовывает канвас
function update() {
    canvas.clearRect(0, 0, 1500, 800);
    drawCoordLines();
   drawPol();
    drawP();
}
 
// рисует точку
function drawP() {
    canvas.beginPath();
    canvas.fillStyle = '#00f';
    canvas.arc(300 + point.x, 220 - point.y, 3, 0, Math.PI * 2);
    canvas.fill();
 
}
 
// Основной алгоритм
 
function check() {
    var _point = pointValue.value.split(", ");
    var _polygon = polygonValue.value.split(", ");
 
    point = new Point(parseInt(_point[0]), parseInt(_point[1]));
 
    polygon = [];
 
    for (var i = 0; i < _polygon.length; i += 2) {
        polygon.push(new Point(parseInt(_polygon[i]), parseInt(_polygon[i + 1])));
    }
 
    update();
 
    txtValue.innerHTML = pointInPolygon() ? 'Точка лежит в многоугольнике' : 'Точка лежит вне многоугольника';
}
 
function pointInPolygon() {
    var res = false;
 
    while (polygon.length >= 3) {
        if (isLeft(polygon[0], polygon[1], polygon[2]) && !hasPointOfPolygin(polygon)) {
            if (inTriangle(polygon[0], polygon[1], polygon[2], point)) {
                res = true;
                break;
            }
            polygon.splice(1, 1);
        }
        else {
            var tmp = polygon[0];
            polygon.shift();
            polygon.push(tmp);
        }
    }
 
    return res;
}
 
var Point = function(x, y) {
    this.x = x;
    this.y = y;
}
 
// площадь треугольника
function calculateSqure(A, B, C) {
   return 1/2 * Math.abs((B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y));
}
 
// Принадлежит ли точка треугольнику?
function inTriangle(A, B, C, D) {
    return calculateSqure(A, B, C) === calculateSqure(A, B, D) + calculateSqure(A, C, D) + calculateSqure(B, D, C);
}
 
// Левая тройка векторов?
function isLeft(A, B, C) {
    var AB = {
            x: B.x - A.x,
           y: B.y - A.y
       },
        AC = {
           x: C.x - A.x,
            y: C.y - A.y
        }
 
   return AB.x * AC.y - AC.x * AB.y < 0;
}
 
// Есть ли другие точки внутри рассматриваемого треугольника?
function hasPointOfPolygin(points) {
    var A = points[0],
        B = points[1],
        C = points[2];
 
    for (var p = 3; p < points.length; p++) {
        if (inTriangle(A, B, C, points[p])) return true;
    }
 
    return false;
}

// запускается при загрузке страницы и создает многоугольник и точку
window.onload = function() {
    canvas = create_canvas(); // канвас
 
    // координаты многоугольника
    polygon = [
        new Point(10, 20),
        new Point(60, 160),
        new Point(110, 20),
        new Point(60, 80)
    ];
    // координаты точки
    point = new Point(0, 0);
 
    // получаем поля ввода
    polygonValue = document.getElementById('polygon');
    pointValue = document.getElementById('point');
    txtValue = document.getElementById('text');
 
    update();
 
    check();
}