let canvas;

let effect;
let blurH;
let blurV;

var fbo;
var effectFbo;
var bhFbo;
var bvFbo;

var charFbos = {};

var cl1, cl2, cl3, cl4;

var mm;
var WW, HH;
var ratio = Math.sqrt(2);
//var resx = map(fxrand(), 0, 1,  1000, 1400);
//var resy = Math.round(1580*1000/resx);
var resx, resy;
if(fxrand() < -.5){
    resx = 1400;
    resy = Math.round(1400/ratio);
}
else{
    resx = Math.round(1400/ratio);
    resy = 1400;
}
//resx=resy=1400;
var res = Math.min(resx, resy);
var zoom = .8;
var globalseed = Math.floor(fxrand()*1000000);

var hasmargin = 1.0 * (fxrand()*100 < 50);
var numleaves = 10;
let inconsolata;
var letters = 'abcdefghijklmnopqrstuvwxyz!?$%&()<>';
var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!?$%&()<>';
var letters = 'abcdefghijklmnopqrstuvwxyz';
var letters = '023456789';
var letters = 'abcdeghkmnopqsuvwxyz';

var randomtint = [.1, .1, .1]

var pts = [];


//var variant = Math.floor(fxrand()*5);

var variant = search.get('variant') || Math.floor(fxrand() * 5);

if(variant > 4)
    variant = 4;

///////
function getVariantString(value) {
    if (value == 0) return "hobby";
    if (value == 1) return "spikes";
    if (value == 2) return "windows";
    if (value == 3) return "function composition";
    if (value == 4) return "simulation";
}

window.$fxhashFeatures = {
    "variant": getVariantString(variant),
}
///////


function preload() {
    effect = loadShader('assets/shaders/effect.vert', 'assets/shaders/effect.frag');
    blurH = loadShader('assets/shaders/blur.vert', 'assets/shaders/blur.frag');
    blurV = loadShader('assets/shaders/blur.vert', 'assets/shaders/blur.frag');
    inconsolata = loadFont('assets/fonts/couriermb.ttf');
    //inconsolata = loadFont('assets/fonts/helveticaneue/HelveticaNeueBd.ttf');
}

var deadness = map(fxrand(), 0, 1, 3, 16);
var slant = map(fxrand(), 0, 1, 11, 51);

function getRandomRYB(p){
    if(!p)
        p = fxrand();
    p = p%1.;
    var cryb = map2(p);
    cryb = saturatecol(cryb, map(fxrand(), 0, 1, -.3, .3));
    cryb = brightencol(cryb, map(fxrand(), 0, 1, -.3, .3));
    return cryb;
}

function setup(){
    pixelDensity(2);
    var or = innerWidth/innerHeight;
    var cr = resx / resy;
    var cw, ch;

    if(or > cr){
        ch = innerHeight;
        cw = round(ch*cr);
    }
    else{
        cw = innerWidth;
        ch = round(cw/cr);
    }

    canvas = createCanvas(cw-50, ch-50, WEBGL);
    canvas.id('maincanvas');

    var p5Canvas = document.getElementById("maincanvas");
    var w = document.getElementById("maincanvas").offsetWidth;
    var h = document.getElementById("maincanvas").offsetHeight;
    //p5Canvas.style.height = h-50 + 'px';
    //p5Canvas.style.width = w-50 + 'px';


    imageMode(CENTER);
    randomSeed(globalseed);
    noiseSeed(globalseed+123.1341);

    print('fxhash:', fxhash);

    //setAttributes('premultipliedAlpha', true);
    //setAttributes('antialias', true);

    //pg = createGraphics(resx, resy, WEBGL);
    //pg.colorMode(RGB, 1);
    //pg.noStroke();
    curveDetail(44);
    //pg.textFont(inconsolata);
    //ortho(-resx/2, resx/2, -resy/2, resy/2, 0, 4444);
    textFont(inconsolata);
    textAlign(CENTER, CENTER);
    imageMode(CENTER);
    rectMode(CENTER);
    colorMode(RGB, 1);

    //prepareFbos();

    //drawCube(pg);


    //pg.rotateY(accas);
    //mask.rotateY(accas);

    fbo = new p5Fbo({renderer: canvas, width: resx*2, height: resy*2});
    effectFbo = new p5Fbo({renderer: canvas, width: resx*2, height: resy*2});
    bhFbo = new p5Fbo({renderer: canvas, width: resx*2, height: resy*2});
    bvFbo = new p5Fbo({renderer: canvas, width: resx*2, height: resy*2});

    
    fbo.begin();
    ortho(-resx/2, resx/2, -resy/2, resy/2, 0, 4444);
    if(issim){
        initSim();
    }
    else{
        initSim();
        var thth = round(random(3, 40))
        for(var k = 0; k < 46; k++){
            if(k == thth){
                engine.gravity.x = 0;
                engine.gravity.y = 0;
            }
            //for(var q = 0; q < grounds.length; q++){
                //Matter.Body.translate(grounds[q], Matter.Vector.create(13*cos(frameCount*0.01+q*0.1), 0))
                //Matter.Body.rotate(grounds[q], 2)
            //}
            runSim();
        }
        //drawSim();
    }

    drawText();

    fbo.end();
    //drawShapes(mask, shapes);
    //drawLines(bgpg, shapes);
    showall();
    showall();
    //fbo.draw();
    //fbo.draw();
    fxpreview();

    if(!issim){
        noLoop();
    }
    //frameRate(2);
    //noLoop();

    //prepareAutomata();
}

var issim = false;
function draw(){

    if(issim){
        fbo.begin();
        clear();
        ortho(-resx/2, resx/2, -resy/2, resy/2, 0, 4444);
        background(0.65);
        runSim();
        drawSim();
        fbo.end();
        showall();
    }

    //drawAutomata();
    //stepAutomata();

    //drawText();

    //stroke(1,0,0);
    //line(-1000,-1000,1000,1000)
    //line(+1000,-1000,-1000,1000)
    //fbo.end();
    //drawShapes(mask, shapes);
    //drawLines(bgpg, shapes);
    //showall();
    //fbo.draw();
    //fbo.draw();
    //drawPlants(pg);
    if(frameCount > 33)
        noLoop();

}


function prepareAutomata(){
    for(var j = 0; j < nc; j++){
        var row = [];
        for(var i = 0; i < nc; i++){
            var v = 0;
            if(fxrand() < .1 || i==j)
                v = 1;
            row.push(v);
        }
        automata.push(row);
    }
}


var automata = [];
var nc = 22;
var dat = 11;

function drawAutomata(){
    for(var j = 0; j < nc; j++){
        for(var i = 0; i < nc; i++){
            var v = map(automata[j][i], 0, 1, .1, .9);
            var x = i*dat - (nc-1)/2*dat;
            var y = j*dat - (nc-1)/2*dat;

            fill(v);
            noStroke();
            rect(x, y, dat-2, dat-2);
        }
    }
}

function stepAutomata(){
    var nat = [];
    for(var j = 0; j < nc; j++){
        var nrow = [];
        for(var i = 0; i < nc; i++){
            var v =automata[j][i];
            var vr = automata[j][(i+1)%nc]
            var vl = automata[j][(i-1+nc)%nc]
            var vd = automata[(j+1)%nc][i]
            var vu = automata[(j-1+nc)%nc][i]
            var sum = vr + vl + vd + vu;
            //v = v + (.5 - v)*random(0, 1.01);
            if(v > .5){
                if(sum > 3){
                    v = max(v-.2, 0);
                }
            }
            else{
                if(sum > .3){
                    v = min(v+.2, 1);
                }
            }
            nrow.push(v);
        }
        nat.push(nrow);
    }
    automata = nat;
}

function prepareFbos(){
    for(var k = 0; k < letters.length; k++){
        var c = letters[k];
        var cfbo = new p5Fbo({renderer: canvas, width: 40, height: 40});

        cfbo.begin();
        ortho(-20, 20, -20, 20, 0, 4444);
        clear();
        textAlign(CENTER, CENTER);
        noStroke();
        fill(0);
        textSize(34);
        text(c, 0, 0);
        cfbo.end();

        charFbos[c] = cfbo;
    }
}

function showall(){
    background(1);
    //pg.push();
    //pg.scale(0.8);
    //pg.pop();
    //pg.line(0,0,mouseX-width/2,mouseY-height/2);

    var an = fxrand()*PI;
    var dir = [cos(an), sin(an)]
    blurH.setUniform('tex0', fbo.getTexture());
    //blurH.setUniform('tex1', mask);
    blurH.setUniform('texelSize', [1.0/resx, 1.0/resy]);
    blurH.setUniform('direction', [dir[0], [1]]);
    blurH.setUniform('u_time', frameCount*0+globalseed*.01);
    blurH.setUniform('amp', .25);
    blurH.setUniform('seed', (globalseed*.12134)%33.+random(.1,11));
    //blurpass1.shader(blurH);
    //blurpass1.quad(-1,-1,1,-1,1,1,-1,1);
    bhFbo.begin();
    clear();
    shader(blurH);
    quad(-1,-1,1,-1,1,1,-1,1);
    bhFbo.end();
    
    blurV.setUniform('tex0', bhFbo.getTexture());
    //blurV.setUniform('tex1', mask);
    blurV.setUniform('texelSize', [1.0/resx, 1.0/resy]);
    blurV.setUniform('direction', [-dir[1], [0]]);
    blurV.setUniform('u_time', frameCount*0+globalseed*.01);
    blurV.setUniform('amp', .25);
    blurV.setUniform('seed', (globalseed*.12134)%33.+random(.1,11));
    //blurpass2.shader(blurV);
    //blurpass2.quad(-1,-1,1,-1,1,1,-1,1);
    bvFbo.begin();
    clear();
    shader(blurV);
    quad(-1,-1,1,-1,1,1,-1,1);
    bvFbo.end();

    effect.setUniform('tex0', fbo.getTexture());
    effect.setUniform('tex1', bvFbo.getTexture());
    //effect.setUniform('tex2', blurpass2);
    //effect.setUniform('tex3', bgpg);
    effect.setUniform('u_usemask', 0.);
    effect.setUniform('u_resolution', [resx, resy]);
    effect.setUniform('u_mouse',[dir[0], [1]]);
    effect.setUniform('u_time', frameCount);
    effect.setUniform('incolor', randomtint);
    effect.setUniform('seed', globalseed+random(.1,11));
    effect.setUniform('noiseamp', mouseX/width*0+1);
    effect.setUniform('hasmargin', hasmargin);
    //effect.setUniform('tintColor', HSVtoRGB(fxrand(), 0.2, 0.95));
    var hue1 = fxrand();
   //effect.setUniform('tintColor', HSVtoRGB(fxrand(),.3,.9));
    //effect.setUniform('tintColor2', HSVtoRGB((hue1+.45+fxrand()*.1)%1,.3,.9));
    effect.setUniform('tintColor', [0.,0.,1.]);
    effect.setUniform('tintColor2', [0.,0.,1.]);

    effectFbo.begin();
    clear();
    shader(effect);
    quad(-1,-1,1,-1,1,1,-1,1);
    effectFbo.end();
    //effectpass.shader(effect);
    //effectpass.quad(-1,-1,1,-1,1,1,-1,1);
  
    // draw the second pass to the screen
    //image(effectpass, 0, 0, mm-18, mm-18);
    var xx = 0;
    //image(pg, 0, 0, mm*resx/resy-xx, mm-xx);
    effectFbo.draw(0, 0, width, height);

}

function windowResized() {
    var or = windowWidth/windowHeight;
    var cr = resx / resy;
    var cw, ch;

    if(or > cr){
        ch = windowHeight;
        cw = round(ch*cr);
    }
    else{
        cw = windowWidth;
        ch = round(cw/cr);
    }
    resizeCanvas(cw-50, ch-50, true);
    
    var p5Canvas = document.getElementById("maincanvas");
    var w = cw;
    var h = ch;
    //p5Canvas.style.height = h-50 + 'px';
    //p5Canvas.style.width = w-50 + 'px';

    showall();
}

var randomstring = function(){
    var le = round(random(1, 33));
    var ou = '';
    for(var k = 0; k < le; k++){
        ou += letters[floor(random(letters.length))];
    }
    return ou;
}

function drawText(){

    clear();
    textSize(18);
    background(.05);
    background(.65, .1,.2);
    background(.65);
    push();
    //scale(2.);
    noStroke();
    fill(.12, .9);
    /*for(var k = 0; k < 2; k++){
        var a = k*radians(137.507764050037854646)
        var rr = map(k, 0, 2300, 0 ,1);
        rr = pow(rr, .25);
        rr *= res/2-44;
        var x = rr*cos(a);
        var y = rr*sin(a);
    }*/

    footer();

    //if(variant == 0) filledRectangles();
    if(variant == 0) textOnCurve(true);
    if(variant == 1) textOnCurve(false);
    if(variant == 2) textOnPoly();
    if(variant == 3) mathComposition();
    if(variant == 4){
        drawSim(1);
        //runSim();
        //runSim();
        //runSim();
        //runSim();
        //runSim();
        //runSim();
        //runSim();
        //drawSim(1);
    }


    pop();

}

function footer(){
    var symbs = ",*xae";
    symbs = "*xz";
    var symb = symbs[floor(random(symbs.length))];
    var fu = 15;
    var ddx = resx-fu*2;
    var nnx = round(ddx/12);
    for(var k = 0; k < nnx; k++){
        var x = map(k, 0, nnx-1, -resx/2+fu, resx/2-fu);
        var y = resy/2-fu*1.;
        //text('*', x, +y);
        //text('*', x, -y);
    }

    var ddy = resy-fu*2;
    var nny = round(ddy/12);
    for(var k = 0; k < nny; k++){
        var y = map(k, 0, nny-1, -resy/2+fu, resy/2-fu);
        var x = resx/2-fu*1.;
        //text('*', +x, y);
        //text('*', -x, y);
    }

    var x1 = -resx/2 + fu;
    var y1 = -resy/2 + fu;
    var x2 = +resx/2 - fu;
    var y2 = +resy/2 - fu;

    var det = 12;
    var nn;
    nn = round(dist(x1,y1,x2,y1)/det);
    fill(0.004);
    noStroke();
    push();
    if(symb == '.' || symb == ','){
        translate(0, -det/2);
    }
    for(var kk = 0; kk < nn; kk++){
        var x = map(kk, 0, nn, x1, x2);
        var y = y1;
        text(symb, x, y);
        if(symb!='*') text(symb, x+random(-.5,.5), y+random(-.5,.5));
    }

    nn = round(dist(x2,y1,x2,y2)/det);
    for(var kk = 0; kk < nn; kk++){
        var x = x2;
        var y = map(kk, 0, nn, y1, y2);
        text(symb, x, y);
        if(symb!='*') text(symb, x+random(-.5,.5), y+random(-.5,.5));
    }

    nn = round(dist(x2,y2,x1,y2)/det);
    for(var kk = 0; kk < nn; kk++){
        var x = map(kk, 0, nn, x2, x1);
        var y = y2;
        text(symb, x, y);
        if(symb!='*') text(symb, x+random(-.5,.5), y+random(-.5,.5));
    }

    nn = round(dist(x1,y2,x1,y1)/det);
    for(var kk = 0; kk < nn; kk++){
        var x = x1;
        var y = map(kk, 0, nn, y2, y1);
        text(symb, x, y);
        if(symb!='*') text(symb, x+random(-.5,.5), y+random(-.5,.5));
    }
    pop();
}

var Engine = Matter.Engine,
Bodies = Matter.Bodies,
Composite = Matter.Composite;

var engine;
var grounds;
var bodies = [];

function polyToColliders(poly){
    var grounds = [];
    for(var i = 0; i < poly.length-1; i++){
        var p1 = poly[i];
        var p2 = poly[(i+1)%poly.length];

        var mid = p5.Vector.add(p1, p2);
        mid.mult(.5);
        var p12 = p5.Vector.sub(p2, p1);
        var dd = p12.mag();
        var ang = p12.heading();

        var body = Bodies.rectangle(mid.x, mid.y, dd, 20, {isStatic: true, label: "custom",friction: 1,frictionStatic: Infinity});
        Matter.Body.rotate(body, ang);

        grounds.push(body);
    }
    return grounds;
}

var colpolys = [];

function initSim(){
    
    engine = Engine.create()
    engine.gravity.x = random(-3,3);
    engine.gravity.y = 8;
    grounds = [
        //Bodies.rectangle(0, 200, 410, 60, { isStatic: true, label: "ground"})
    ]

    var pos = createVector(0, -400);

    ///
    var colpoly = [];
    for(var x = -200; x <= 200; x+=20){
        var y = map(x, -200, 200, 0, 1);
        y = 50*(1 - pow(2*abs(.5-y), 3));
        colpoly.push(createVector(x, y));
    }

    ///
    colpoly1 = [];
    var ra = PI/2 + radians(random(-44, 44));
    for(var k = 0; k < 33; k++){
        var a = map(k, 0, 33-1+20, 0, 2*PI);
        a = a + radians(random(-0, 0));
        var rr = random(211, 211);
        var x = pos.x + rr*cos(a+ra);
        var y = pos.y + rr*sin(a+ra);
        //colpoly.push(createVector(x, y));
    }
    
    colpoly1 = [];
    colpoly1.push(createVector(-200, +200));
    colpoly1.push(createVector(+250, +100));
    
    colpoly2 = [];
    colpoly2.push(createVector(+200, +200));
    colpoly2.push(createVector(+50, +200));

    grounds = [];
    var frq = random(0.005, 0.05);
    var ruru = random(5, 50);
    var realized = 0;
    while(realized == 0){
        realized = 0;
        for(var x = 0; x < ruru; x += 1){
            var y = 0;
            var colpoly = [];
            var rx = random(-(resx/2-50), (resx/2-50));
            var ry = random(-(resy/2-50), (resy/2-50));
            var ang = floor(random(360/90))*90;
            ang = 0;
            var r = random(100, resy);
            var rx2 = rx + r*cos(radians(ang));
            var ry2 = ry + r*sin(radians(ang));
            if(rx2 > (resx/2-30)){
                continue;
                rx2 = resx/2 - 50;
            }
            if(ry2 > (resy/2-30)){
                continue;
                ry2 = resy/2 - 50;
            }
            if(rx2 < -(resx/2-30)){
                continue;
                rx2 = -resx/2 + 50;
            }
            if(ry2 < -(resy/2-30)){
                continue;
                ry2 = -resy/2 + 50;
            }
            realized++;
            //colpoly.push(createVector(x+map(power(noise(x*frq, 22.9), 3), 0, 1, -100, 100), y-300));
            //colpoly.push(createVector(x+map(power(noise(x*frq, 31.4), 3), 0, 1, -100, 100), y+300));
            //colpoly.push(createVector(rx+rw/2, ry+rh/2+rh/2*random(-.5,.5)));
            //colpoly.push(createVector(rx-rw/2, ry+rh/2+rh/2*random(-.5,.5)));
            //colpoly.push(createVector(rx-rw/2, ry-rh/2+rh/2*random(-.5,.5)));
            //colpoly.push(createVector(rx+rw/2, ry-rh/2+rh/2*random(-.5,.5)));
            //colpoly.push(colpoly[0]);
            colpoly.push(createVector(rx, ry));
            colpoly.push(createVector(rx2, ry2));
            //grounds.push(Bodies.rectangle(rx, ry, rw, rh, {isStatic: true,label: "ground",friction: 1,frictionStatic: Infinity}));
            colpolys.push(colpoly);
            grounds = grounds.concat(polyToColliders(colpoly))
        }
    }
    var colpoly = [];
    var rx = 0;
    var ry = 0;
    var rw = resx-33;
    var rh = resy-33;
    //colpoly.push(createVector(x+map(power(noise(x*frq, 22.9), 3), 0, 1, -100, 100), y-300));
    //colpoly.push(createVector(x+map(power(noise(x*frq, 31.4), 3), 0, 1, -100, 100), y+300));
    colpoly.push(createVector(rx-rw/2, ry-rh/2));
    colpoly.push(createVector(rx+rw/2, ry-rh/2));
    colpoly.push(createVector(rx+rw/2, ry+rh/2));
    colpoly.push(createVector(rx-rw/2, ry+rh/2));
    colpoly.push(createVector(rx-rw/2, ry-rh/2));
    //colpolys.push(colpoly);
    grounds = grounds.concat(polyToColliders(colpoly))

    //var it = 0;
    var ddim = 600;
    //grounds.push(Bodies.rectangle(pos.x+ddim/3, pos.y-ddim/2, ddim/3, 10, {isStatic: true,label: "ground"+(it++),friction: 1,frictionStatic: Infinity}));
    //grounds.push(Bodies.rectangle(pos.x-ddim/3, pos.y-ddim/2, ddim/3, 10, {isStatic: true,label: "ground"+(it++),friction: 1,frictionStatic: Infinity}));
    //grounds.push(Bodies.rectangle(pos.x+0, pos.y+ddim/2, ddim, 10, {isStatic: true,label: "ground"+(it++),friction: 1,frictionStatic: Infinity}));
    //grounds.push(Bodies.rectangle(pos.x-ddim/2, pos.y+0, 10, ddim, {isStatic: true,label: "ground"+(it++),friction: 1,frictionStatic: Infinity}));
    //grounds.push(Bodies.rectangle(pos.x+ddim/2, pos.y+0, 10, ddim, {isStatic: true,label: "ground"+(it++),friction: 1,frictionStatic: Infinity}));
    var ddx = 180;
    var ddy = 880;
    var detx = 10;
    var dety = 10;
    var partsx = round(ddx/detx);
    var partsy = round(ddy/dety);
    detx = ddx/partsx;
    dety = ddy/partsy;
    for(var j = 0; j < partsy; j++){
        for(var i = 0; i < partsx; i++){
            var x = i*detx - detx*(partsx-1)/2; 
            var y = j*dety - dety*(partsy-1)/2; 
            var box = Bodies.rectangle(
                pos.x + x, 
                pos.y + y,
                detx,
                dety,
                {
                    damping: 0.001,
                    stiffness: 0.9,
                    friction: .0001,
                    restitution: 0,
                }
            );
            Matter.Body.setMass(box, .0004);
            Matter.Body.rotate(box, radians(random(-13, 13)));
            //bodies.push(box);
        }
    }
    var nunu = random(1600, 2500);
    for(var k = 0; k < nunu; k++){
        var box = Bodies.rectangle(
            pos.x + random(-400, 400), 
            pos.y + random(-400, 400),
            detx,
            dety,
        );
        box.friction = 1110.1;
        box.frictionAir = random(.0005, .14);
        box.restitution = 0;
        var ang = random(40, 50);
        if(fxrand() < .5)
            ang = random(-50, -40);
        Matter.Body.rotate(box, radians(random(-3,3)));
        bodies.push(box);
    }

    var allbodies = grounds.concat(bodies);
    Composite.add(engine.world, allbodies);
}


function initBoxSim(){
    engine = Engine.create()
    engine.gravity.y = .5;
    grounds = [
        //Bodies.rectangle(0, 200, 410, 60, { isStatic: true, label: "ground"})
    ]

    var pos = createVector(0, 300);

    var it = 0;
    var ddim = 400;
    grounds.push(Bodies.rectangle(pos.x+ddim/3, pos.y-ddim/2, ddim/3, 10, {isStatic: true,label: "ground"+(it++),friction: 1,frictionStatic: Infinity}));
    grounds.push(Bodies.rectangle(pos.x-ddim/3, pos.y-ddim/2, ddim/3, 10, {isStatic: true,label: "ground"+(it++),friction: 1,frictionStatic: Infinity}));
    grounds.push(Bodies.rectangle(pos.x+0, pos.y+ddim/2, ddim, 10, {isStatic: true,label: "ground"+(it++),friction: 1,frictionStatic: Infinity}));
    grounds.push(Bodies.rectangle(pos.x-ddim/2, pos.y+0, 10, ddim, {isStatic: true,label: "ground"+(it++),friction: 1,frictionStatic: Infinity}));
    grounds.push(Bodies.rectangle(pos.x+ddim/2, pos.y+0, 10, ddim, {isStatic: true,label: "ground"+(it++),friction: 1,frictionStatic: Infinity}));

    for(var k = 0; k < 4333; k++){
        var box = Bodies.circle(pos.x+ddim*.8*random(-.5, .5), pos.y+ddim*.8*random(-.5, .5), 5);
        box.friction = 1110.1;
        box.restitution = 0;
        Matter.Body.rotate(box, radians(random(-30, 30)));
        bodies.push(box);
    }

    var allbodies = grounds.concat(bodies);
    Composite.add(engine.world, allbodies);
}

function initBasicSim(){
    engine = Engine.create()
    engine.gravity.y = 1;
    grounds = [
        //Bodies.rectangle(0, 200, 410, 60, { isStatic: true, label: "ground"})
    ]

    for(var x = -300, it = 0; x <= 300; x += 100, it++){
        var y = map(it%2, 0, 1, -100, 100);
        var a = map(it%2, 0, 1, 6, -6) + 90 + random(-4, 4);
        a = random(-55, 55) + 90;
        var grnd = Bodies.rectangle(x, y, 500, 20, {
            isStatic: true,
            label: "ground"+it,
            friction: 1,
            frictionStatic: Infinity
        })
        Matter.Body.rotate(grnd, radians(a));
        grounds.push(grnd);
    }
    for(var k = 0; k < 1233; k++){
        var box = Bodies.rectangle(random(-333, 333), -200+random(-200, 200), 10, 10);
        box.friction = 0.1;
        box.restitution = 0;
        Matter.Body.rotate(box, radians(random(-30, 30)));
        bodies.push(box);
    }

    var allbodies = grounds.concat(bodies);
    Composite.add(engine.world, allbodies);
}

function runSim(){
    Engine.update(engine, 1000 / 60);
}

function drawSim(flag){
    textSize(16);
    push();
    for (var i = 0; i < bodies.length; i += 1) {
        var vertices = bodies[i].vertices;

        noFill();
        stroke(0);
        fill(0);
        stroke(.65);
        noStroke(),
        beginShape();
        for (var j = 0; j < vertices.length; j += 1) {
            var xx = vertices[j].x;
            var yy = vertices[j].y;
            xx -= bodies[i].position.x;
            yy -= bodies[i].position.y;
            xx *= .75;
            yy *= .75;
            xx += bodies[i].position.x;
            yy += bodies[i].position.y;
            //vertex(xx, yy);
        }
        endShape(CLOSE);

        push();
        fill(0);
        noStroke();
        translate(bodies[i].position.x, bodies[i].position.y, 10*flag);
        rotate(bodies[i].angle);
        
        var liftx = 0;
        var lifty = 0;
        var lettr = letters[floor(random(letters.length))];
        var lettr = letters[i%letters.length];
        if('acemnosuvwxz'.includes(lettr)){
            lifty = -3;
        }
        if('bdhk'.includes(lettr)){
            lifty = -2;
        }
        if('gpqy'.includes(lettr)){
            lifty = -4;
        }
        fill(0.65);
        noStroke();
        //rect(0, 0, 10, 10);
        fill(0);
        noStroke();
        //var cc = map2(floor(random(3))/9.);
        //cc = saturatecol(cc, -.2+random(-.05, .05));
        //cc = brightencol(cc, random(-.05, .05));
        fill(.9);
        if(flag)
            fill(0);

        if(bodies[i].position.x < resx/2-35 && bodies[i].position.y < resy/2-35 && bodies[i].position.x > -resx/2+35 && bodies[i].position.y > -resy/2+35){
            text(lettr, liftx, lifty);
            text(lettr, liftx+random(-.5,.5), lifty+random(-.5,.5));
        }
        stroke(.65);
        //rect(0, 0, 20, 20);
        
        pop();
    }

    for(var k = 0; k < grounds.length; k++){
        var ground = grounds[k];
        push();
        noFill();
        stroke(0);
        beginShape();
        for (var j = 0; j < ground.vertices.length; j += 1) {
            //vertex(ground.vertices[j].x, ground.vertices[j].y);
        }
        endShape(CLOSE);
        pop();

    }

    noStroke();
    fill(0);

    var symbs = "*#";
    var symb = symbs[floor(random(symbs.length))];

    for(var kk = 0; kk < colpolys.length; kk++){

        for(var k = 0; k < colpolys[kk].length-1; k++){
            var ptq = colpolys[kk][k];
            var nptq = colpolys[kk][(k+1)%colpolys[kk].length];
            var pt = createVector(ptq.x, ptq.y); 
            var npt = createVector(nptq.x, nptq.y); 
            var det = 14;
            var d = pt.dist(npt);
            var parts = 2+round(d/det);
            for(var pa = 0; pa < parts; pa++){
                var p = map(pa, 0, parts, 0, 1);
                var x = lerp(pt.x, npt.x, p);
                var y = lerp(pt.y, npt.y, p);
                
                var liftx = 0;
                var lifty = 0;
                var lettr = symb;
                if('acemnosuvwxz'.includes(lettr)){
                    lifty = -3;
                }
                if('bdhkQWERTZUIOPASDFGHJKLYXCVBNM'.includes(lettr)){
                    lifty = -2;
                }
                if('gpqy'.includes(lettr)){
                    lifty = -4;
                }
                var ttp = createVector(x+liftx, y+lifty);
                var zas = false;
                if(kk < colpolys.length-1){
                    for(var qkk = kk+1; qkk < colpolys.length; qkk++){
                        for(var qk = 0; qk < colpolys[qkk].length; qk++){
                            var qptq = colpolys[qkk][qk];
                            var qnptq = colpolys[qkk][(qk+1)%colpolys[qkk].length];
                            var qpt = createVector(qptq.x, qptq.y);
                            var qnpt = createVector(qnptq.x, qnptq.y);
                            var qdet = 14;
                            var qd = qpt.dist(qnpt);
                            var qparts = 2+round(qd/qdet);
                            for(var qpa = 0; qpa < qparts; qpa++){
                                var qp = map(qpa, 0, qparts, 0, 1);
                                var qx = lerp(qpt.x, qnpt.x, qp);
                                var qy = lerp(qpt.y, qnpt.y, qp);
                                var qv = createVector(qx, qy);
                                if(qv.dist(ttp) < 14)
                                    zas = true;
                            }

                        }
                    }
                }
                if(zas)
                    continue;

                fill(0.1);
                noStroke();
                //rect(x, y, 14, 14);
                //fill(0.65);
                noStroke();
                text(lettr, ttp.x, ttp.y);
                text(lettr, ttp.x+random(-.5,.5), ttp.y+random(-.5,.5));
            }
        }
    }
    
    for(var kk = 0; kk < grounds.length; kk++){
        if(grounds[kk].label == 'custom')
            continue;
        for(var k = 0; k < grounds[kk].vertices.length; k++){
            var ptq = grounds[kk].vertices[k];
            var nptq = grounds[kk].vertices[(k+1)%grounds[kk].vertices.length];
            var pt = createVector(ptq.x, ptq.y); 
            var npt = createVector(nptq.x, nptq.y); 
            var det = 14;
            var d = pt.dist(npt);
            var parts = 2+round(d/det);
            for(var pa = 0; pa < parts; pa++){
                var p = map(pa, 0, parts, 0, 1);
                var x = lerp(pt.x, npt.x, p);
                var y = lerp(pt.y, npt.y, p);
                
                var liftx = 0;
                var lifty = 0;
                var lettr = symb;
                if('acemnosuvwxz'.includes(lettr)){
                    lifty = -3;
                }
                if('bdhk'.includes(lettr)){
                    lifty = -2;
                }
                if('gpqy'.includes(lettr)){
                    lifty = -4;
                }
                var ttp = createVector(x+liftx, y+lifty);
                var zas = false;
                if(kk < grounds.length-1){
                    for(var qkk = kk+1; qkk < grounds.length; qkk++){
                        if(grounds[qkk].label == 'custom')
                            continue;
                        for(var qk = 0; qk < grounds[qkk].vertices.length; qk++){
                            var qptq = grounds[qkk].vertices[qk];
                            var qnptq = grounds[qkk].vertices[(qk+1)%grounds[qkk].vertices.length];

                            var qpt = createVector(qptq.x, qptq.y);
                            var qnpt = createVector(qnptq.x, qnptq.y);
                            var qdet = 14;
                            var qd = qpt.dist(qnpt);
                            var qparts = 2+round(qd/qdet);
                            for(var qpa = 0; qpa < qparts; qpa++){
                                var qp = map(qpa, 0, qparts, 0, 1);
                                var qx = lerp(qpt.x, qnpt.x, qp);
                                var qy = lerp(qpt.y, qnpt.y, qp);
                                var qv = createVector(qx, qy);
                                if(qv.dist(ttp) < 14)
                                    zas = true;
                            }

                        }
                    }
                }
                if(zas)
                    continue;
                text(lettr, ttp.x, ttp.y);
            }
        }
    }
    

    pop();
}

function getCompositionImpl(){
    var s = 'X+Y';
    /*var rules = [
        '(Q+R)',
        '(Q*R)',
        '(Q-R)',
        'pow(Q,'+v4+')',
        'pow(Q,R)',
        'sqrt((Q-.5)*(Q-.5)-(R-.5)*(R-.5))',
        '(.5+.5*sin('+v3+'*Q))',
        '((Q%R)/R)',
        '((Q%'+v1+')/'+v1+')',
        '((R%'+v2+')/'+v2+')',
        'abs(Q)',
        '(((Q*'+v5+')&(R*'+v5+'))/'+v5+')',
        '(((Q*'+v5+')|(R*'+v5+'))/'+v5+')',
        '(~R)',
        '(((Q*'+v5+')^(R*'+v5+'))/'+v5+')',
    ]

    var rules2 = [
        '(Q+R)',
        '(Q*R)',
        '(Q-R)',
        'pow(Q,'+v4+')',
        'pow(Q,R)',
        'sqrt((Q-.5)*(Q-.5)-(R-.5)*(R-.5))',
        '(.5+.5*sin('+v3+'*Q))',
        '((Q%R)/R)',
        '((Q%'+v1+')/'+v1+')',
        '((R%'+v2+')/'+v2+')',
        'abs(Q)',
        '(((Q*'+v5+')&(R*'+v5+'))/'+v5+')',
        '(((Q*'+v5+')|(R*'+v5+'))/'+v5+')',
        '(~R)',
        '(((Q*'+v5+')^(R*'+v5+'))/'+v5+')',
    ]*/

    var v1 = round(random(3, 30));
    var v2 = round(random(3, 30));
    var v5 = random(1, 8);
    rules = [
        '(X+Y)',
        '(X*Y)',
        '(X/Y)',
        '(Y/X)',
        '(X*' + random(.1, 10) + ')',
        '(Y*' + random(.1, 10) + ')',
        '(X-Y)',
        'pow(X,' + random(.5, 2) + ')',
        'pow(X,Y)',
        'sqrt((X-.5)*(X-.5)-(Y-.5)*(Y-.5))',
        '(.5+.5*sin(' + random(2, 10) + '*X))',
        '(.5+.5*sin(' + random(2, 10) + '*Y))',
        '((X%Y)/Y)',
        '((X%' + v1 + ')/' + v1 + ')',
        '((Y%' + v2 + ')/' + v2 + ')',
        'abs(X)',
        'abs(Y)',
        '(((X*' + v5 + ')&(Y*' + v5 + '))/' + v5 + ')',
        '(((X*' + v5 + ')|(Y*' + v5 + '))/' + v5 + ')',
        '(((X*' + v5 + ')^(Y*' + v5 + '))/' + v5 + ')',
        'myf1(X, Y, ' + random(5, 50) + ')',
        'noise(X*' + random(.1, 2) + ', Y*' + random(.1, 2) + ')',
        '1/X',
        '1/Y',
    ]

    var rules = [];
    for (var k = 0; k < 15; k++) {
        var v1 = round(random(3, 30));
        var v2 = round(random(3, 30));
        var v5 = random(1, 8);
        var trules = [
            '(X+Y)',
            '(X*Y)',
            '(-X)',
            '(-Y)',
            'pow(X,' + random(.5, 2) + ')',
            'pow(X,Y)',
            '(.5+.5*sin(' + random(.1, .52) + '*X + ' + random(.1, .52) + '*Y + ' + random(.1, .52) + '))',
            'noise(X*' + random(.1, 2) + ', Y*' + random(.1, 2) + ')',
            '(round(X*'+'10*Y'+')/'+'10*Y'+')',
            '(X+Y)',
            '(X*Y)',
            '(X*' + random(.1, 10) + ')',
            '(Y*' + random(.1, 10) + ')',
            '(X-Y)',
            '(X+' + random(.1, 5) + ')',
            '(Y+' + random(.1, 5) + ')',
            'pow(X,' + random(.5, 2) + ')',
            'pow(X,Y)',
            'sqrt((X-.5)*(X-.5)-(Y-.5)*(Y-.5))',
            '(.5+.5*sin(' + random(2, 10) + '*X))',
            '(.5+.5*sin(' + random(2, 10) + '*Y))',
            '((X%Y)/Y)',
            '((X%' + v1 + ')/' + v1 + ')',
            '((Y%' + v2 + ')/' + v2 + ')',
            'abs(X)',
            'abs(Y)',
            '(((X*' + v5 + ')&(Y*' + v5 + '))/' + v5 + ')',
            '(((X*' + v5 + ')|(Y*' + v5 + '))/' + v5 + ')',
            '(((X*' + v5 + ')^(Y*' + v5 + '))/' + v5 + ')',
            'myf1(X, Y, ' + random(5, 50) + ')',
            'noise(X*' + random(.1, 2) + ', Y*' + random(.1, 2) + ')',
            '(1/X)',
            '(1/Y)',
            '(X/Y)',
            '(Y/X)',
        ]
        rules = rules.concat(trules);
    }


    for(var k = 0; k < rulelevel; k++){
        var rrules = rules;
        var ns = '';
        for(var i = 0; i < s.length; i++){
                var chc = floor(random(rrules.length));
            if(s[i] == 'X' || s[i] == 'Y'){
                ns += rrules[chc]
            }
            else{
                ns += s[i];
            }
        }
        s = ns;
    }

    return s;
}

function myf1(X, Y, nn){
    if(abs(X-nn/2) < 25 && abs(Y-nn/2)<25){
        return .9;
    }
    return fxrand();
}


function getComposition(nx, ny, rx, ry, scan){
    var avgr = 0;
    var avgd = 0;
    var maxd = 0;
    var sum = 0;
    zas = true;
    var comp = '';
    //while((maxd < .2 || avgd < .2 || avgr < .2) || zas || sum == 0){
    while(sum < .1 || maxd < .01 || isNaN(maxd)){
        zas = false;
        comp = getCompositionImpl();
        var vals = [];
        maxd = 0;
        var nn = 5;
        for(var j = 0; j < nn; j++){
            for(var i = 0; i < round(nn*resx/resy); i++){
                var X = ((i+rx)%nn+1)/nn;
                var Y = ((j+ry)%nn+1)/nn;
                rez = (eval(comp) + 0.)%1;
                if(isNaN(rez))
                    zas = true;
                vals.push(rez);
            }
        }
        sum = 0;
        for(var k = 0; k < vals.length; k++){
            if(!isNaN(vals[k]))
                sum += vals[k];
        }
        avgr = sum/vals.length;
    
        var sumd = 0;
        for(var k = 0; k < vals.length; k++){
            sumd += abs(vals[k]-avgr);
            maxd = max(maxd, abs(vals[k]-avgr));
        }
        print("he", sum)
        print("he2", maxd)
        avgd = sumd/vals.length;
        //print('hello')

    }
    print(avgr, avgd, maxd)
    return comp;
}

var re1 = map(fxrand(), 0, 1, 0.1, .5);
var re2 = map(fxrand(), 0, 1, 0.1, .5);
var re3 = map(fxrand(), 0, 1, 0.2, 2.5);
var re4 = map(fxrand(), 0, 1, .2, 2.5);
var re5 = map(fxrand(), 0, 1, 3, 10);
var rules = [
    //'abs(sin((X-.5)*10)*sin((Y-.5)*10))',
    //'((X-.5)%.1)/.1',
    '((((X)%.1)/.1 > .5)*1.)',
    '((((Y)%.1)/.1 > .5)*1.)',
    '(X*Y*10.)',
    '(X%Y*10.)',
    '((X%.1)/.1)',
    '(X/Y)',
    '(.5+.5*sin(X*3.))',
    'round(X)',
    '(-X)',
    '(-Y)',
]
var rulelevel = 4 + Math.floor(3*Math.random());
rulelevel = 4;

function mathComposition(){
    fill(0.004);
    //var cc = map2(floor(random(3))/9.);
    //cc = saturatecol(cc, -.2+random(-.05, .05));
    //cc = brightencol(cc, random(-.05, .05));
    push();
    scale(1.1);
    fill(0);
    noStroke();
    
    var rind = floor(random(1, letters.length-1));
    var ltrs = letters.slice(0, rind) + letters.slice(0, rind);

    var det = 8;
    var nx = (resx-50)/det;  
    var ny = (resy-50)/det;  
    var dw = nx*det;
    var dh = ny*det;

    var rx = floor(random(nx*3));
    var ry = floor(random(ny*3));
    var scan = random(nx/10, nx/2);
    scan = nx;
    var comp = getComposition(nx, ny, rx, ry, scan);
    var comp2 = getComposition(nx, ny, rx, ry, scan);
    print(comp)

    var ola = '.-/=*caxwKHR';
    ola = ' .,:+>roaexwW';
    ola = ' .,:+>roaexwWwxeaor<+:,.';
    ola = ' .^",:;!i><~+-?][}{1)(/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*MW&8B$';
    var olash = floor(random(ola.length));

    for (var j = 1; j < ny-1; j++){
        for(var i = 1; i < nx-1; i++){
            var X = ((i+rx)%nx+1)/scan;
            var Y = ((j+ry)%ny+1)/scan;
            rez = round(eval(comp)*100);

            rez2 = round(eval(comp2) * 100);


            var x = map(i, 0, nx, 0, dw) - (nx-.5)/2*det;
            var y = map(j, 0, ny, 0, dh) - (ny-.5)/2*det;
            
            //fill(rez);
            //rect(x, y, det, det);
            if (isNaN(rez))
                rez = 0;
            var ltr = ola[abs(rez+olash)%ola.length];
            /*ltr = ltrs[floor(rez*ltrs.length)]
            if(rez < .33)
                ltr = ' ';
            else if(rez < .44)
                ltr = ',';
            else if(rez < .77)
                ltr = '-';
            else if(rez < 1)
                ltr = ltrs[floor(rez*ltrs.length)];*/
            
            var liftx = 0;
            var lifty = 0;
            if('acemnosuvwxz'.includes(ltr)){
                //lifty = -3;
            }
            if('bdhk'.includes(ltr)){
                //lifty = -2;
            }
            if('gpqy'.includes(ltr)){
                //lifty = -4;
            }

            push();
            //var cc = map2(floor(random(3))/9.);
            //cc = saturatecol(cc, -.2+random(-.05, .05));
            //cc = brightencol(cc, random(-.05, .05));
            textSize(14);
            translate(x+liftx, y+lifty);

            push();
            translate(0, 0, 1);
            var va = 0;
            var va2 = 0;
            va = abs(rez) / 1000.;
            va2 = abs(rez2) / 1000.;
            if (isNaN(va))
                va = 0.;
            if (!isFinite(va))
                va = fxrand();
            if (isNaN(va2))
                va2 = 0.;
            if (!isFinite(va2))
                va2 = fxrand();
            
            var c1 = map2((va + .05) % 1.);
            var c2 = map2((va + .05) % 1.);
            c1 = brightencol(c1, .5*(-.5 + va2))
            c2 = brightencol(c2, .5*(-.5 + va2))
            fill(...c1);
            rect(0, 0, 10, 10);
            fill(...c2);
            rect(0, 0, 5, 5);
            pop();

            fill(0.01);
            //text(ltr, 0, 0);
            //text(ltr, random(-.5, .5), random(-.5, .5));
            pop();
        } 
    } 
    pop();

    //stroke(1,0,0);
    //line(-1000,-1000,1000,1000)
    //line(+1000,-1000,-1000,1000)

}

function textOnPoly(){
    fill(0.004);
    noStroke();

    var polys = []
    
    var pts = [];
    for(var k = 0; k < 7; k++){
        //pts.push([random(-res/2, res/2), random(-res/2, res/2)]);
        var x = .8*resx*(-.5 + power(noise(k*31.314), 12));
        var y = .8*resy/2*random(-1, 1);
        var vec = createVector(x, y);
        //pts.push(vec);
    }
    polys.push(pts);

    var minx = 10000;
    var miny = 10000;
    var maxx = -10000;
    var maxy = -10000;
    for(var k = 0; k < 42; k++){
        var w = round(random(100, 400));
        var h = round(100*400/w) * random(.9, 1.1)*3.5;
        var x = map(pow(fxrand(), 1), 0, 1, -resx/2+133+w/2, resx/2-133-w/2);
        //var y = map(pow(fxrand(), 1), 0, 1, -res/2+300+h/2, res/2-300-h/2);
        var y = map(pow(fxrand(), 1), 0, 1, -resy/2+133+h/2, resy/2-133-h/2);
        w = 100 + 400*(power(noise(k*.05, 205.422), 4));
        h = 100 + 900*(power(noise(k*.05, 680.71), 4));
        x = (resx - w - 50)*(-.5 + power(noise(k*.05, 55.422), 4));
        y = (resy - h - 50)*(-.5 + power(noise(k*.05, 21.341), 4));
        var pts = [];
        pts.push(createVector(x-w/2, y-h/2));
        pts.push(createVector(x+w/2, y-h/2));
        pts.push(createVector(x+w/2, y+h/2));
        pts.push(createVector(x-w/2, y+h/2));
        polys.push(pts);
        for(var qq = 0; qq < pts.length; qq++){
            var p = pts[qq];
            if(p.x < minx) minx = p.x;
            if(p.y < miny) miny = p.y;
            if(p.x > maxx) maxx = p.x;
            if(p.y > maxy) maxy = p.y;
        }
    }

    var midx = (maxx+minx)/2;
    var midy = (maxy+miny)/2;
    push();
    translate(-midx, -midy);
    
    //var polys = []
    //var pts = [];


    var allpolypts = [];
    for(var q = 0; q < polys.length; q++){
        var pts = polys[q];
        var hasf = letters[floor(random(fxrand()*letters.length))];
        var polypts = [];
        for(var k = 0; k < pts.length; k++){
            var pt = pts[(k+0)%pts.length];
            var npt = pts[(k+1)%pts.length];
    
            var det = 14;
            var d = pt.dist(npt);
            var parts = 2+round(d/det);
            for(var pa = 0; pa < parts; pa++){
                var p = map(pa, 0, parts, 0, 1);
                var x = lerp(pt.x, npt.x, p);
                var y = lerp(pt.y, npt.y, p);
    
                /*var zas = false;
                for(var aaa = 0; aaa < allpolypts.length; aaa++){
                    for(var bbb = 0; bbb < allpolypts[aaa].length; bbb++){
                        if(dist(x, y, allpolypts[aaa][bbb].pos.x, allpolypts[aaa][bbb].pos.y) < 16){
                            zas = true;
                        }
                    }
                }
                if(zas)
                    continue;*/
                    
                var zas = false;
                for(var bbb = 0; bbb < allpolypts.length-1; bbb++){
                    if(dist(x, y, allpolypts[bbb].pos.x, allpolypts[bbb].pos.y) < 15){
                        if(q == 0){
                                zas = true;
                        }
                        else{
                            if(q != allpolypts[bbb].polyid){ // ovaj ludi poligon je zadnji
                                zas = true;
                            }
                        }
                    }
                }

                if(zas)
                    continue;
                    polypts
                //if(noise(q) < .3 && q < polys.length-1){
                if(q == 3 || q == 20){
                    push();
                    translate(x, y, -5);
                    fill(0.004);
                    fill(...randomtint)
                    rect(0, 0, 16, 16);
                    pop();

                    push();
                    translate(x, y);
                    if((0.2126*randomtint[0] + 0.7152*randomtint[1] + 0.0722*randomtint[2]) < .4)
                        fill(0.6);
                    else
                        fill(0.004);
                    text(hasf, 0, 0);
                    text(hasf, random(-.5,.5), random(-.5,.5));
                    pop();
                }
                else{
                    push();
                    translate(x, y);
                    text(hasf, 0, 0);
                    text(hasf, random(-.5,.5), random(-.5,.5));
                    pop();
                }
                allpolypts.push({'pos': createVector(x, y), 'polyid': q});

            }
        }
        //allpolypts.push(polypts);
    }
    pop();
}

function textOnCurve(isHobby=true){
    fill(0.004);
    noStroke();
    for(var y = -res/2; y < res/2; y+=10){

        var x = 5*(-.5+power(noise(y*.03), 12));
        //text("hello", x,y);
    }

    var pts = [];
    var spread = random(.8, .9)*.3;
    if(fxrand() < 1.5){
        spread = .99;
    }
    var ququ = 144*spread;
    ququ = random(190, 200)*.99;
    var exx = random(.3, .6);
    var exy = random(.3, .6);
    if(fxrand() < .5){
        exx = 1./exx;
    }
    if(fxrand() < .5){
        exy = 1./exy;
    }
    var strfunx = fxrand() < .5 ? pow : power;
    var strfuny = fxrand() < .5 ? pow : power;
    if(strfunx == pow && strfuny == pow && false){
        strfunx = fxrand() < .5 ? pow : power;
        strfuny = fxrand() < .5 ? pow : power;
    }
    strfunx = strfuny = power;
    exx = exy = random(3, 4);
    var kfrq = random(.08, .4);
    var israndom = fxrand() < .5;
    var zoom = 1;
    if(fxrand() < .5){
        zoom = random(1, 2);
    }

    for(var k = 0; k < ququ; k++){
        var x = -(resx/2-30) + 2*(resx/2-30)*(k%2);
        var y = -(resy/2-30) + 2*(resy/2-30)*((1.*power(noise(k*1.05), 5))%1);
        if(israndom){
            x = map(strfunx(fxrand(), exx), 0, 1, -(resx/2-30), (resx/2-30))*spread;
            y = -map(strfuny(fxrand(), exy), 0, 1, -(resy/2-30), (resy/2-30))*spread;
        }
        else{
            x = map(strfunx(noise(k*kfrq, 331.2), exx), 0, 1, -(resx/2-30), (resx/2-30))*spread;
            y = -map(strfuny(noise(k*kfrq, 228.5), exy), 0, 1, -(resy/2-30), (resy/2-30))*spread;
        }
        if(k==0 && spread < .5){
            x*=15;
            y*=15;
        }
        x *= zoom;
        y *= zoom;
        pts.push(createVector(x, y));
        //pts.push([-.4*resx/2 + 2*.4*resx/2*(k%2)+random(-55/2, 55/2), random(-.4*resx/2, .4*resx/2)]);
    }
    
    for(var k = 0; k < 155; k++){
        var y = map(k, 0, 155, -resy/2+100, resy/2-100);
        y = map(fxrand(), 0, 1, -resy/2, resy/2)
        var x = k%2 ? -resx/2+100 : resx/2-100;
        //pts.push(createVector(x, y));
        //pts.push([-.4*resx/2 + 2*.4*resx/2*(k%2)+random(-55/2, 55/2), random(-.4*resx/2, .4*resx/2)]);
    }

    var knots = makeknots(pts, 1, true);
    var hobbypts = gethobbypoints(knots, true, 10);

    //pts = [];
    for(var k = 0; k < 117; k++){
        //pts.push([random(-res/2, res/2), random(-res/2, res/2)]);
        var x = .8*resx*(-.5 + power(noise(k*31.314), 12));
        var y = .8*resy*(-.5 + power(noise(k*.00214), 2));
        var vec = createVector(x, y);
        //pts.push(vec);
    }
    var npts = [];
    for(var k = 0; k < pts.length; k++){
        var pt = pts[(k+0)%pts.length];
        var npt = pts[(k+1)%pts.length];

        var det = 10;
        var d = pt.dist(npt);
        var parts = 2+round(d/det);
        for(var pa = 0; pa < parts; pa++){
            var p = map(pa, 0, parts, 0, 1);
            var x = lerp(pt.x, npt.x, p);
            var y = lerp(pt.y, npt.y, p);
            
            npts.push(createVector(x, y));
        }
    }
    if(!isHobby)
        hobbypts = npts;

    stroke(0.004);
    strokeWeight(2);
    noFill();
    fill(0.004);
    noStroke();
    var wasf = letters[floor(random(letters.length))];

    var subletters = "acemnorsuvwxyz"
    var ola = '.^",:;!i><~+-?/tfjrxnmwqpdbkhao*';
    var lettr = subletters[floor(random(subletters.length))];
    var fff = random(.001, .03);
    var modk = round(random(10, 200));
    var shf = floor(random(ola.length));
    for(var k = 0; k < hobbypts.length; k++){
        var zas = false;
        var ang = 0;
        var pt = hobbypts[k];
        var ppt = hobbypts[(k-1+hobbypts.length)%hobbypts.length];
        var npt = hobbypts[(k+1)%hobbypts.length];
        var dir = p5.Vector.sub(npt, ppt);
        ang = dir.heading();
        if(abs(ang) > PI/2){
            //ang = ang + PI;
        }

        if(abs(pt.x) > resx/2-40 || abs(pt.y) > resy/2-40)
            zas = true;

        if(zas)
            continue;

        if(k > 1){
            for(var w = 0; w < k-1; w++){
                var wpt = hobbypts[w];
                if(wpt.dist(pt) < 10)
                    zas = true;
            }
        }

        if(zas)
            continue;

        var x = pt.x;
        var y = pt.y;

        push();
        fill(.1,.1,.2);
        fill(1);
        fill(0.004);
        noStroke();
        translate(x, y);

        //rect(0, 0, 14, 14);
        //  fill(0.65);

        //rotateZ(ang);
        //text(k%10, 0, 0);
        //var wasf = letters[floor(random(letters.length))];
        //wasf = harry[k%harry.length];
        //wasf = 'a';
        
        var liftx = 0;
        var lifty = 0;
        //lettr = ola[round(k*fff + shf)%ola.length];
        if(k%modk == 0){
            lettr = ola[floor(random(ola.length))];
        }
        if('acemnosuvwxz'.includes(lettr)){
            lifty = -3;
        }
        if('bdhk'.includes(lettr)){
            lifty = -2;
        }
        if('gpqy'.includes(lettr)){
            lifty = -4;
        }

        text(lettr, liftx, lifty);
        text(lettr, liftx+random(-.5,.5), lifty+random(-.5,.5));
        //ellipse(0, 0, 5, 5);
        pop();

        push();
        fill(.35);
        fill(.1,.1,.2);
        noStroke();
        translate(x, y);
        //rect(0, 0, 17, 17);
        pop();
        
        var pt = hobbypts[(k-1+hobbypts.length)%hobbypts.length];
        var x = pt.x;
        var y = pt.y;
        push();
        fill(.7,.2,.3);
        translate(x, y, k);
        //text(k%10, 0, 0);
        pop();
    }
}

function filledRectangles(){
    var polys = [];
    var frompoint = fxrand() < -.5;
    var hasrowvar = fxrand() < -.5;
    var frq = random(.14, 1);
    var reduce = 10;
    for(var it = 0; it < 18; it++){
        var rx = random(100, 400)*1.5;
        var ry = rx*random(1.3, 1.5);
        var x = rnoise(it*frq, -(resx/2-rx/2-100), (resx/2-rx/2-100));
        var y = rnoise(it*frq+314.31, -(resy/2-ry/2-100), (resy/2-ry/2-100));
        var poly = [];
        poly.push(createVector(x-rx/2, y-ry/2));
        poly.push(createVector(x+rx/2, y-ry/2));
        poly.push(createVector(x+rx/2, y+ry/2));
        poly.push(createVector(x-rx/2, y+ry/2));
        var polypts;
        var det = random(9, 13)*0 + 11;
        polypts = getRectFillPoints(poly, polys, det, reduce);
        polys.push(poly);
    
        push();
        translate(0, 0, -it*4);
        
        var polyrr = reducePoly(poly, 10);
        noStroke();
        //stroke(...map2(fxrand()));
        var aaa = round(fxrand()*5)/5.;
        while(aaa == 0.8 || aaa == 0.4){
            aaa = round(fxrand()*5)/5.;
        }
        //stroke(...map2(aaa));
        strokeWeight(4);
        fill(.1 + it/6.);
        noFill();
        beginShape();
        for(var k = 0; k < polyrr.length; k++){
            var p = polyrr[k];
            //vertex(p.x, p.y, -200);
        }
        endShape(CLOSE);
    
        fill(0.7);
        //fill(...map2(round(fxrand()*5)/5.));
        fill(0.004);
        noStroke();
        for(var k = 0; k < polypts.length; k++){
            var p = polypts[k].pos;
            var i = polypts[k].i;
            var j = polypts[k].j;
            var idx;
            if(frompoint){
                idx = floor(3.213*letters.length*power(noise(i*3.1313*hasrowvar, it), 3)) % letters.length;
            }
            else{
                idx = floor(3.213*letters.length*power(noise(j*3.1313*hasrowvar, it), 3)) % letters.length;
            }
            var rang = radians(map(power(noise(j*3.1313), 3), 0, 1, -10, 10));
            
            var x = p.x;
            var y = p.y;
            if(abs(y-88) < 20){
                //var p = abs(y-88)/11;
                //p = pow(1.-p, 6)*166;
                //x += p;
            }
            push();
            translate(x, y);
            rotate(rang);
            var liftx = 0;
            var lifty = 0;
            var lettr = letters[idx];
            if('acemnosuvwxz'.includes(lettr)){
                lifty = -3;
            }
            if('bdhk'.includes(lettr)){
                lifty = -2;
            }
            if('gpqy'.includes(lettr)){
                lifty = -4;
            }
            //var cc = map2(floor(random(3))/9.);
            //cc = saturatecol(cc, -.2+random(-.05, .05));
            cc = brightencol(cc, random(-.05, .05));
            //fill(0);
            text(lettr, liftx, lifty);
            text(lettr, liftx+random(-.5,.5), lifty+random(-.5,.5));
            //charFbos[letters[idx]].draw(0, 0, 20, 20)
            //charFbos[letters[idx]].draw(random(-.5,.5), random(-.5,.5), random(-.5,.5), random(-.5,.5), 20, 20)
            push();
            //fill(...map2(0.0));
            //ellipse(0, 0, 3, 3);
            pop();
            pop();
        }
        pop();
    }
}

function filledPolys(){
    var polys = [];
    var frompoint = fxrand() < -.5;
    var hasrowvar = fxrand() < -.5;
    var frq = random(.14, 1);
    for(var it = 0; it < 6; it++){
        var rx = random(100, 200)*1.5;
        var ry = rx*random(1.3, 1.5);
        var x = rnoise(it*frq, -(resx/2-rx/2-100), (resx/2-rx/2-100));
        var y = rnoise(it*frq+314.31, -(resy/2-ry/2-100), (resy/2-ry/2-100));
        var poly = generatePolygon(x, y,rx, ry, it);
        var polypts
        if(frompoint){
            polypts = getPolyFillPoints2(poly, polys);
        }
        else{
            var det = random(9, 13);
            polypts = getPolyFillPoints(poly, polys, det);
        }
        polys.push(poly);
    
        push();
        translate(0, 0, -it*4);
        
        var polyrr = reducePoly(poly, 0);
        noStroke();
        //stroke(...map2(fxrand()));
        var aaa = round(fxrand()*5)/5.;
        while(aaa == 0.8 || aaa == 0.4){
            aaa = round(fxrand()*5)/5.;
        }
        //stroke(...map2(aaa));
        strokeWeight(4);
        fill(.1 + it/6.);
        noFill();
        beginShape();
        for(var k = 0; k < polyrr.length; k++){
            var p = polyrr[k];
            //vertex(p.x, p.y, -200);
        }
        endShape(CLOSE);
    
        fill(0.7);
        //fill(...map2(round(fxrand()*5)/5.));
        fill(0.004);
        noStroke();
        for(var k = 0; k < polypts.length; k++){
            var p = polypts[k].pos;
            var i = polypts[k].i;
            var j = polypts[k].j;
            var idx;
            if(frompoint){
                idx = floor(3.213*letters.length*power(noise(i*3.1313*hasrowvar, it), 3)) % letters.length;
            }
            else{
                idx = floor(3.213*letters.length*power(noise(j*3.1313*hasrowvar, it), 3)) % letters.length;
            }
            var rang = radians(map(power(noise(j*3.1313), 3), 0, 1, -10, 10));
            
            var x = p.x;
            var y = p.y;
            if(abs(y-88) < 20){
                //var p = abs(y-88)/11;
                //p = pow(1.-p, 6)*166;
                //x += p;
            }
            push();
            translate(x, y);
            rotate(rang);
            var liftx = 0;
            var lifty = 0;
            var lettr = letters[idx];
            if('acemnosuvwxz'.includes(lettr)){
                lifty = -3;
            }
            if('bdhk'.includes(lettr)){
                lifty = -2;
            }
            if('gpqy'.includes(lettr)){
                lifty = -5;
            }
            text(lettr, liftx, lifty);
            //text(lettr, liftx+random(-.5,.5), lifty+random(-.5,.5));
            //charFbos[letters[idx]].draw(0, 0, 20, 20)
            //charFbos[letters[idx]].draw(random(-.5,.5), random(-.5,.5), random(-.5,.5), random(-.5,.5), 20, 20)
            push();
            //fill(...map2(0.0));
            //ellipse(0, 0, 3, 3);
            pop();
            pop();
        }
        pop();
    }
}

function generatePolygon(x0=0, y0=0, w=0, h=0, it=0){
    var nk = round(random(3, 26));
    var nk = 4;
    var poly = [];
    var shf = fxrand()*2*PI*0;
    var ra = radians(random(-180, 180));
    ra = 0*radians(rnoise(it*.08+543.23, -33, 33));
    //ra = radians(round(random(4))*90) + radians(random(-10, 10));
    for(var k = 0; k < nk; k++){
        var ang = map(k, 0, nk, 0, 2*PI);
        var dang = 1/nk*2*PI;
        ang += dang*0;
        var x = w*cos(ang+shf+dang/2*(nk%2==0));
        var y = h*sin(ang+shf+dang/2*(nk%2==0));
        var nx = x*cos(ra) - y*sin(ra);
        var ny = x*sin(ra) + y*cos(ra);
        x = x0 + nx;
        y = y0 + ny;
        poly.push(createVector(x, y));
    }
    return poly;
}

function getRectFillPoints(poly0, polys, det=10, reduce=0){
    var poly = reducePoly(poly0, reduce);
    var minx = 10000;
    var miny = 10000;
    var maxx = -10000;
    var maxy = -10000;
    for(var k = 0; k < poly.length; k++){
        var p = poly[k];
        if(p.x < minx) minx = p.x;
        if(p.y < miny) miny = p.y;
        if(p.x > maxx) maxx = p.x;
        if(p.y > maxy) maxy = p.y;
    }

    minx -= 100;
    miny -= 100;
    maxx += 100;
    maxy += 100;

    var dy = 11 + round(random(3));
    var dx = 11 + round(random(5));
    dy = det;
    dx = det;
    var fillpoints = [];
    var j = 0;
    var i = 0;
    var frq = 0.001;
    var ra = 0*radians(random(-22, 22));

    var x1 = poly[0].x;
    var x2 = poly[1].x;
    var y1 = poly[0].y;
    var y2 = poly[2].y;

    if(x1 > x2){
        var tmp = x1; x1 = x2; x2 = x1;
    }
    if(y1 > y2){
        var tmp = y1; y1 = y2; y2 = y1;
    }

    var nx = round(abs(x2-x1)/det);
    var ny = round(abs(y2-y1)/det);

    for(var j = 0; j < ny; j++){
        for(var i = 0; i < nx; i++){
            var px = map(i, 0, nx-1, 0, 1);
            var py = map(j, 0, ny-1, 0, 1);
            var x = lerp(x1+det/2, x2-det/2, px);
            var y = lerp(y1+det/2, y2-det/2, py);
            var pos = createVector(x, y);
            var zas = true;
            for(var po = 0; po < polys.length; po++){
                if(isinside(pos, polys[po]))
                    zas = false;
            }
            if(zas) fillpoints.push({'pos': pos, 'i': i, 'j': j});
        }
    }

    /*for(var y = miny; y < maxy; y += dy){
        for(var x = minx+random(-dx,dx)*.0; x < maxx; x += dx){
            var pos = createVector(x, y);
            var nx = pos.x + 0*(-.5 + power(noise(pos.x*frq, pos.y*frq*20.+poly0[0].x, 3314.341), 2));
            var ny = pos.y + 0*(-.5 + power(noise(pos.x*frq, pos.y*frq+poly0[0].x, 1133.554), 2));
            var nnx = nx*cos(ra) - ny*sin(ra);
            var nny = nx*sin(ra) + ny*cos(ra);
            pos.x = nnx;
            pos.y = nny;
            if(isinside(pos, poly)){
                var zas = true;
                for(var po = 0; po < polys.length; po++){
                    if(isinside(pos, polys[po]))
                        zas = false;
                }
                if(zas) fillpoints.push({'pos': pos, 'i': i++, 'j': j});
            }
        }
        j++;
        i = 0;
        //dy = random(4,16)*0+16;
    }*/

    return fillpoints;
}

function getPolyFillPoints(poly0, polys, det=10){
    var poly = reducePoly(poly0, 0);
    var minx = 10000;
    var miny = 10000;
    var maxx = -10000;
    var maxy = -10000;
    for(var k = 0; k < poly.length; k++){
        var p = poly[k];
        if(p.x < minx) minx = p.x;
        if(p.y < miny) miny = p.y;
        if(p.x > maxx) maxx = p.x;
        if(p.y > maxy) maxy = p.y;
    }

    minx -= 100;
    miny -= 100;
    maxx += 100;
    maxy += 100;

    var dy = 11 + round(random(3));
    var dx = 11 + round(random(5));
    dy = det;
    dx = det;
    var fillpoints = [];
    var j = 0;
    var i = 0;
    var frq = 0.001;
    var ra = radians(random(-22, 22));
    for(var y = miny; y < maxy; y += dy){
        for(var x = minx+random(-dx,dx)*.0; x < maxx; x += dx){
            var pos = createVector(x, y);
            var nx = pos.x + 330*(-.5 + power(noise(pos.x*frq, pos.y*frq*20.+poly0[0].x, 3314.341), 2));
            var ny = pos.y + 30*(-.5 + power(noise(pos.x*frq, pos.y*frq+poly0[0].x, 1133.554), 2));
            var nnx = nx*cos(ra) - ny*sin(ra);
            var nny = nx*sin(ra) + ny*cos(ra);
            pos.x = nnx;
            pos.y = nny;
            if(isinside(pos, poly)){
                var zas = true;
                for(var po = 0; po < polys.length; po++){
                    if(isinside(pos, polys[po]))
                        zas = false;
                }
                if(zas) fillpoints.push({'pos': pos, 'i': i++, 'j': j});
            }
        }
        j++;
        i = 0;
        //dy = random(4,16)*0+16;
    }

    return fillpoints;
}


var hasshf = fxrand() < .5 ? 1 : 0;
var dt = map(fxrand(), 0, 1, 8, 14);
var stepd = map(fxrand(), 0, 1, 10, 22);
function getPolyFillPoints2(poly0, polys){
    var zeropoint = poly0[floor(random(poly0.length))];
    var poly = reducePoly(poly0, 10);
    var minx = 10000;
    var miny = 10000;
    var maxx = -10000;
    var maxy = -10000;
    for(var k = 0; k < poly.length; k++){
        var p = poly[k];
        if(p.x < minx) minx = p.x;
        if(p.y < miny) miny = p.y;
        if(p.x > maxx) maxx = p.x;
        if(p.y > maxy) maxy = p.y;
    }

    minx -= 100;
    miny -= 100;
    maxx += 100;
    maxy += 100;

    var dy = 11 + round(random(3));
    var dx = 11 + round(random(5));
    dy = 11;
    dx = 13;
    var fillpoints = [];
    var j = 0;
    var i = 0;
    var frq = 0.001;
    var ra = radians(random(-22, 22));
    
    var dims = max((maxx-minx), (maxy-miny));
    var radi = 0;
    for(var rad = 0; rad < dims; rad += dt, radi++){
        var steps = 1 + round(rad*2*PI/stepd);
        var shf = fxrand()*2*PI*hasshf*0;
        for(var k = 0; k < steps; k++){
            var ang = map(k, 0, steps, 0, 2*PI);
            var pos = createVector(0, 0);
            pos.x = zeropoint.x + rad*cos(ang+shf);
            pos.y = zeropoint.y + rad*sin(ang+shf);
            
            if(isinside(pos, poly)){
                var zas = true;
                for(var po = 0; po < polys.length; po++){
                    if(isinside(pos, polys[po]))
                        zas = false;
                }
                if(zas) fillpoints.push({'pos': pos, 'i': radi, 'j': k});
            }
        }
    }

    return fillpoints;
}


function reducePoly(poly, amp){
    var normals = [];

    for(var k = 0; k < poly.length; k++){
        var p = poly[k];
        var pn = poly[(k+1)%poly.length];
        var pp = poly[(k-1+poly.length)%poly.length];
        var left = p5.Vector.sub(pn, p);
        var right = p5.Vector.sub(pp, p);
        left.normalize();
        right.normalize();
        var normal = p5.Vector.add(left, right);
        normal.normalize();
        normal.mult(amp);
        normals.push(normal);
    }

    var npts = [];
    for(var k= 0; k < poly.length; k++){
        var p = poly[k].copy();
        var n = normals[k].copy();
        p.add(n);
        npts.push(p);
    }

    return npts;
}


var accas = fxrand()*6.28;
var ooo = Math.round(1+3*fxrand());

function max(a, b){
    if(a >= b)
        return a;
    return b;
}

function min(a, b){
    if(a <= b)
        return a;
    return b;
}


/*
var cshif = fxrand();
var range = Math.round(2 + fxrand()*7)*45/360;
var invsat = Math.round(fxrand());
var invs1 = Math.round(fxrand());
var invb1 = Math.round(fxrand());
var invs2 = Math.round(fxrand());
var invb2 = Math.round(fxrand());
var invs3 = Math.round(fxrand());
var fff = map(fxrand(), 0, 1, .05, .4);
var aaa = fxrand()*3.14;
var ooo = Math.round(1+3*fxrand());
var ppp = 1;
function drawColorArray(pgr, index=0){

    //COLORS
     pgr.push();
     var nn = 30;
     var dd = 500;
     var rr = dd/nn;
     pgr.noStroke();
     var nc = round(random(3, 12));
     nc = 3 + index%5;
     nc = round(8 + 5*sin(index*fff+aaa));
     for(var k = 0; k < nn; k++){
         var p = map(k, 0, nn, 0, 1);
         var x = map(k, 0, nn-1, -dd/2, dd/2);
         var y = 0;
 
         var ang = ((k+1)%nc)*(360/nc)/360 + cshif;

         if((k+1)%nc < nc-2){
            ang = (((k+1)%nc)*(360/nc)/360*range)%range + cshif;
         }
         else if((k+1)%nc < nc-1){
            ang = max(90/360., (((k+1)%nc)*(360/nc)/360*range)%range+15/360.) + cshif;
         }
         else{
            ang = 180/360. + cshif;
         }

         var pp = ang%1.;

         var cryb = map2(p);
         pgr.fill(...cryb);
         //pgr.rect(x, y-rr*8, rr+1, rr+1);
         
         var cryb = map2(ang);
         if((k+1)%nc < nc-2) cryb = saturatecol(cryb, .4*(-1+2*invsat)*(-1+2*invs1));
         if((k+1)%nc < nc-2) cryb = brightencol(cryb, +.0*(-1+2*invsat)*(-1+2*invb1));
         if((k+1)%nc == nc-1) cryb = saturatecol(cryb, -.5*(-1+2*invsat)*(-1+2*invs2));
         if((k+1)%nc == nc-1) cryb = brightencol(cryb, -.2*(-1+2*invsat)*(-1+2*invb2));
         if((k+1)%nc == nc-2) cryb = saturatecol(cryb, +.5*(-1+2*invsat)*(-1+2*invs3));
         if((k+1)%nc == nc-2) cryb = brightencol(cryb, +.0);
         //if(k%nc == nc-1) cryb = saturatecol(cryb, .5*(invsat));
         //if(k%nc == nc-2) cryb = saturatecol(cryb, .5*(invsat));
         //if(k%nc == nc-1) cryb = brightencol(cryb, -.2*(1.-invsat));
         //if(k%nc == nc-2) cryb = brightencol(cryb, -.2*(1.-invsat));
         pgr.fill(...cryb);

         pgr.fill(...getRandomColor(round(ppp*((k+1)*(k+1)*1*(index+1)+index+k*ooo))));
         pgr.rect(x, y-rr*4*0, rr+1, rr*1+2);

         var chsv = hsv2rgb(p, 1., 1.);
         pgr.fill(...chsv);
         //pgr.rect(x, y+rr*4, rr+1, rr+1);
         
         var chsv = hsv2rgb(ang, 1., 1.);
         if(k%nc == nc-1) cryb = hsv2rgb(ang, .5, .8);
         if(k%nc == nc-2) cryb = hsv2rgb(ang, 1.2, 1.2);
         pgr.fill(...chsv);
         //pgr.rect(x, y+rr*8, rr+1, rr+1);
         
     }

     pg.fill(1.);
     pg.noStroke();
     for(var k = 0; k < nc; k++){
        
        var ang = (k%nc)*(360/nc)/360 + cshif;

        if(k%nc < nc-2){
           ang = (k*(360/nc)/360*range)%range + cshif;
        }
        else if(k%nc < nc-1){
           ang = max(90/360., (k*(360/nc)/360*range)%range+15/360.) + cshif;
        }
        else{
           ang = 180/360. + cshif;
        }

        var pp = ang%1.;

        var x = map(pp, 0, 1-1./nn, -(dd/2-rr/2), (dd/2-rr/2));
        //pg.ellipse(x, 0-rr*8-rr/2, 4, 4);
        //pg.ellipse(x, 0+rr*4-rr/2, 4, 4);
     }
     pgr.pop();
}
*/

function subdividePath(path, det){
    var newpath = [];
    for(var k = 0; k < path.length-1; k++){
        var p1 = path[k];
        var p2 = path[k+1];
        var parts = 2 + round(p1.dist(p2)/det);
        for(var pa = 0; pa < parts; pa++){
            var ppa = map(pa, 0, parts-1, 0, 1);
            var cp = createVector(0, 0, 0);
            cp.x = lerp(p1.x, p2.x, ppa);
            cp.y = lerp(p1.y, p2.y, ppa);
            cp.z = lerp(p1.z, p2.z, ppa);
            newpath.push(cp.copy());
        }
    }
    return newpath;
}

function rotateAround(vect, axis, angle) {
    // Make sure our axis is a unit vector
    axis = p5.Vector.normalize(axis);
  
    return p5.Vector.add(
      p5.Vector.mult(vect, cos(angle)),
      p5.Vector.add(
        p5.Vector.mult(
          p5.Vector.cross(axis, vect),
          sin(angle)
        ),
        p5.Vector.mult(
          p5.Vector.mult(
            axis,
            p5.Vector.dot(axis, vect)
          ),
          (1 - cos(angle))
        )
      )
    );
  }



function myline(x1, y1, z1, x2, y2, z2){
    var d = dist(x1,y1,z1,x2,y2,z2);
    var det = 1.5;
    var parts = 2 + round(d/det);
    var amp = 2.;
    var frq = 0.01;
    for(var k = 0; k < parts; k++){
        var p = map(k, 0, parts-1, 0, 1);
        var x = lerp(x1, x2, p);
        var y = lerp(y1, y2, p);
        var z = lerp(z1, z2, p);
        var nx = x + amp*(-.5 + power(noise(x*frq, y*frq, z*frq+311.13), 2));
        var ny = y + amp*(-.5 + power(noise(x*frq, y*frq, z*frq+887.62), 2));
        var rr = map(power(noise(k*0.03, x1+x2), 3), 0, 1, .5, 1.6);
        ellipse(nx, ny, rr, rr);
    }
}

function gethobbypoints(knots, cycle, det=12){
    var hobbypts = [];
    for (var i=0; i<knots.length; i++) {
        var p0x = knots[i].x_pt;
        var p1x = knots[i].rx_pt;
        var p2x = knots[(i+1)%knots.length].lx_pt;
        var p3x = knots[(i+1)%knots.length].x_pt;
        var p0y = knots[i].y_pt;
        var p1y = knots[i].ry_pt;
        var p2y = knots[(i+1)%knots.length].ly_pt;
        var p3y = knots[(i+1)%knots.length].y_pt;

        //bezier(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y);

        var steps = 44;
        var totald = 0;
        var algorithm = 1;
        if(algorithm == 0){
            for(var st = 0; st < steps; st++){
                var t = map(st, 0, steps, 0, 1);
                var tn = map(st+1, 0, steps, 0, 1);
                x = (1-t)*(1-t)*(1-t)*p0x + 3*(1-t)*(1-t)*t*p1x + 3*(1-t)*t*t*p2x + t*t*t*p3x;
                y = (1-t)*(1-t)*(1-t)*p0y + 3*(1-t)*(1-t)*t*p1y + 3*(1-t)*t*t*p2y + t*t*t*p3y;
                
                xn = (1-tn)*(1-tn)*(1-tn)*p0x + 3*(1-tn)*(1-tn)*tn*p1x + 3*(1-tn)*tn*tn*p2x + tn*tn*tn*p3x;
                yn = (1-tn)*(1-tn)*(1-tn)*p0y + 3*(1-tn)*(1-tn)*tn*p1y + 3*(1-tn)*tn*tn*p2y + tn*tn*tn*p3y;
    
                var tonext = dist(xn, yn, x, y);
                totald += tonext;
            }
            steps = 2 + round(totald/det);
    
    
            for(var st = 0; st < steps; st++){
                var t = map(st, 0, steps, 0, 1);
                x = (1-t)*(1-t)*(1-t)*p0x + 3*(1-t)*(1-t)*t*p1x + 3*(1-t)*t*t*p2x + t*t*t*p3x;
                y = (1-t)*(1-t)*(1-t)*p0y + 3*(1-t)*(1-t)*t*p1y + 3*(1-t)*t*t*p2y + t*t*t*p3y;
    
                hobbypts.push(createVector(x, y));
            }
        }
        if(algorithm == 1){
            var t = 0;
            var dt = 0.05;
            while(t < 1.-dt/2){
                x = (1-t)*(1-t)*(1-t)*p0x + 3*(1-t)*(1-t)*t*p1x + 3*(1-t)*t*t*p2x + t*t*t*p3x;
                y = (1-t)*(1-t)*(1-t)*p0y + 3*(1-t)*(1-t)*t*p1y + 3*(1-t)*t*t*p2y + t*t*t*p3y;
                hobbypts.push(createVector(x, y));
    
                var tn = t + dt;
                xn = (1-tn)*(1-tn)*(1-tn)*p0x + 3*(1-tn)*(1-tn)*tn*p1x + 3*(1-tn)*tn*tn*p2x + tn*tn*tn*p3x;
                yn = (1-tn)*(1-tn)*(1-tn)*p0y + 3*(1-tn)*(1-tn)*tn*p1y + 3*(1-tn)*tn*tn*p2y + tn*tn*tn*p3y;
                var tonext = dist(xn, yn, x, y);
                var offsc = tonext/det;
                dt = dt/offsc;
    
                t = t + dt;
            }
        }
        
    }
    return hobbypts;
}


function drawhobby(knots, cycle) {
    
    for (var i=0; i<knots.length-1; i++) {
        push();
        fill(0);
        noStroke();
        translate(knots[i].x_pt, knots[i].y_pt, 0);
        ellipse(0, 0, 5, 5);
        pop();
    }

    var det = 10;
    for (var i=0; i<knots.length; i++) {
        var p0x = knots[i].x_pt;
        var p1x = knots[i].rx_pt;
        var p2x = knots[(i+1)%knots.length].lx_pt;
        var p3x = knots[(i+1)%knots.length].x_pt;
        var p0y = knots[i].y_pt;
        var p1y = knots[i].ry_pt;
        var p2y = knots[(i+1)%knots.length].ly_pt;
        var p3y = knots[(i+1)%knots.length].y_pt;

        //bezier(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y);

        var steps = 10;
        var totald = 0;
        for(var st = 0; st < steps; st++){
            var t = map(st, 0, steps, 0, 1);
            var tn = map(st+1, 0, steps, 0, 1);
            x = (1-t)*(1-t)*(1-t)*p0x + 3*(1-t)*(1-t)*t*p1x + 3*(1-t)*t*t*p2x + t*t*t*p3x;
            y = (1-t)*(1-t)*(1-t)*p0y + 3*(1-t)*(1-t)*t*p1y + 3*(1-t)*t*t*p2y + t*t*t*p3y;
            
            xn = (1-tn)*(1-tn)*(1-tn)*p0x + 3*(1-tn)*(1-tn)*tn*p1x + 3*(1-tn)*tn*tn*p2x + tn*tn*tn*p3x;
            yn = (1-tn)*(1-tn)*(1-tn)*p0y + 3*(1-tn)*(1-tn)*tn*p1y + 3*(1-tn)*tn*tn*p2y + tn*tn*tn*p3y;

            totald += dist(xn, yn, x, y);
        }
        steps = 2 + round(totald/det);


        for(var st = 0; st < steps; st++){
            var t = map(st, 0, steps, 0, 1);
            x = (1-t)*(1-t)*(1-t)*p0x + 3*(1-t)*(1-t)*t*p1x + 3*(1-t)*t*t*p2x + t*t*t*p3x;
            y = (1-t)*(1-t)*(1-t)*p0y + 3*(1-t)*(1-t)*t*p1y + 3*(1-t)*t*t*p2y + t*t*t*p3y;

            push();
            fill(0);
            noStroke();
            translate(x, y, 0);
            ellipse(0, 0, 5, 5);
            pop();
        }
    }

    return;

    beginShape();
    vertex(knots[0].x_pt, knots[0].y_pt, 0);
    for (var i=0; i<knots.length-1; i++) {
      //   knots[i+1].lx_pt.toFixed(4), knots[i+1].ly_pt.toFixed(4),
      //   knots[i+1].x_pt.toFixed(4), knots[i+1].y_pt.toFixed(4));
        
        bezierVertex(
            knots[i].rx_pt, knots[i].ry_pt,
            knots[i+1].lx_pt, knots[i+1].ly_pt, 
            knots[i+1].x_pt, knots[i+1].y_pt,
        );
  
        //push();
        //noStroke();
        //fill(...getRandomColor());
        //ellipse(knots[i].x_pt,  knots[i].y_pt, 3, 3);
        //ellipse(knots[i].rx_pt, knots[i].ry_pt, 1, 1);
        //ellipse(knots[i+1].lx_pt, knots[i+1].ly_pt, 1, 1);
        //ellipse(knots[i+1].x_pt,  knots[i+1].y_pt, 3, 3);
        //pop();
    }
    if (cycle) {
        i = knots.length-1;
        bezierVertex(
            knots[i].rx_pt, knots[i].ry_pt,
            knots[0].lx_pt, knots[0].ly_pt,
            knots[0].x_pt, knots[0].y_pt,
        );
    }
    endShape();

}

function map(v, v1, v2, v3, v4){
    return (v-v1)/(v2-v1)*(v4-v3)+v3;
}


function mouseClicked(){
    //createShapes();
}

function keyPressed(){
    //noiseSeed(round(random(1000)));
    //createShapes();
    if(key == 's'){
        var data = effectFbo.readToPixels();
        var img = createImage(effectFbo.width, effectFbo.height);
        for (i = 0; i < effectFbo.width; i++){
          for (j = 0; j < effectFbo.height; j++){
            var pos = (j * effectFbo.width*4) + i * 4;
            img.set(i,effectFbo.height-1-j, [data[pos], data[pos+1], data[pos+2],255]);
          }
        }
        img.updatePixels();
        img.save('outputTest', 'png');
    }
}

function rnoise(s, v1, v2){
    return v1 + (v2-v1)*((power(noise(s), 3)*1)%1.0);
}


function power(p, g) {
    if (p < 0.5)
        return 0.5 * Math.pow(2*p, g);
    else
        return 1 - 0.5 * Math.pow(2*(1 - p), g);
}
