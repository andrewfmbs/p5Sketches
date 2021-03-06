/*
  Module of different p5 sketches. Each on can be plugged into a sketch.js file,
  calling their setup and draw functions in their respective p5 functions.

*/

let sketches = {

  /*************************************************
   * Hynotic Rings
  *************************************************/
  rings: function () {
    let r = 1;
    let g = 1;
    let b = 1;
    let rDirect = 1
    let gDirect = 1
    let bDirect = 1
    var circles;

    function setup() {
      circles = [];
      for (var i = 0; i < 100; i++) {
        circles.push(new _Ellipse())
      }

      noFill();
      strokeWeight(3);
      smooth(1)
    }

    function draw(vol) {
      var circleIncrease = 20;
      r += .3 * rDirect;
      g += .5 * gDirect;
      b += .8 * bDirect;

      if (r >= 50 || r <= 0) {
        rDirect = -rDirect;
      }
      if (g >= 50 || g <= 0) {
        gDirect = -gDirect;
      }
      if (b >= 50 || b <= 0) {
        bDirect = -bDirect;
      }
      background(r, g, b);

      for (let i = 0; i < circles.length; i++) {
        circles[i].grow(i, circleIncrease, vol);
        circles[i].display();
      }
      // Makes a new circle in one goes off the screen
      if (circles.length > 0) {
        if (circles[0].size > width + 200) {
          circles.splice(0, 1);
          // circles.push(new _Ellipse()); // to make a new one everytime one is removed
        }
      }
      if (vol > 4.5 && circles.length < 100) {
        circles.push(new _Ellipse());
        wait = 5
      }


    }

    var _Ellipse = function () {
      this.x = width / 2;
      this.y = height / 2;
      this.size = 25;
      this.color = 0;
    }

    _Ellipse.prototype.display = function () {
      // var sizeMap = map(this.size, 25, width + 200, 0, 255)
      stroke(this.color, this.color / 2, this.color / 4);
      ellipse(this.x, this.y, this.size);
    }

    _Ellipse.prototype.grow = function (i, increase, vol) {
      let colorMap = map(vol, 0, 100, 0, 255);
      if (vol > 6) {
        this.size += vol;
        circles[i].color += colorMap
      } else if (vol > 0) {
        this.size -= vol;
      } else {
        circles[i].color -= colorMap
      }
      this.size += increase / (i + 1);
    }

    function onMidiNote(note, velocity) {
      if (velocity > 0) {
        switch (note) {
          case 1:
            circles.push(new _Ellipse());
            break;

        }
      }
    }
    return {
      setup: setup,
      draw: draw,
      onMidiNote: onMidiNote
    }
  }(),


  /*************************************************
   * Random Walker 
  *************************************************/
  walker: function () {
    let walkerArray = [];
let walkerAmt = 250;
let scale = 4

    function setup() {
      for(let i = 0; i < walkerAmt; i ++){
        walkerArray.push(new Walker());
      }  
      background(0);
    }

    function draw() {
      for(let i = 0; i < walkerAmt; i ++){
        walkerArray[i].display();
        walkerArray[i].step();
      }
    }

    // Walker constructor

    function Walker() {
      this.x = width / 2;
      this.y = height / 2;
    }
    Walker.prototype.display = function () {
      noStroke();
      fill(255, 10);
      ellipse(this.x, this.y, scale);
    }
    // Function to "step" the walker in one random direction 
    // by the same size as the walker.
    Walker.prototype.step = function (){
      let stepX = (int(random(3)) - 1);
      let stepY = (int(random(3)) - 1);
      this.preventOffScreen();
      this.x += stepX * scale;
      this.y += stepY * scale;
    }
    
    // Function to stop the walker from going off the screen. If the walkers
    Walker.prototype.preventOffScreen = function () {
      if (this.x < 1) {
        this.x += scale
      } else if (this.x > width - 1) {
        this.x -= scale
      } else if (this.y < 1) {
        this.y += scale
      } else if (this.y > height - 1) {
        this.y -= scale
      }
    }
    // Low opacity black line that sweeps left and right to slowying fade out the walker trail.


    function onMidiNote(note, velocity) {

    }

    return {
      setup: setup,
      draw: draw,
      onMidiNote: onMidiNote
    }
  }(),

  /*************************************************
   * Ball 
  *************************************************/
  ball: function () {

    let lines;
    let lineAmt = 360;
    let timer;
    let angle;
    let xCenter;
    let yCenter;
    let radius;
    let angleMultiplyer = 1.1
    let direction = 1

    function setup() {
      timer = 1
      lines = [];
      background(0)
      for (let i = 0; i < lineAmt; i++) {
        // let xMap = map(i, 0, lineAmt, 0, width);
        angle = radians(i);
        xCenter = width / 2;
        yCenter = height;
        radius = height > width ? width / 2 : height / 2;

        let x = xCenter + sin(angle) * radius;
        let y = yCenter + cos(angle) * radius;

        let x2 = xCenter + sin(angle * angleMultiplyer) * radius;
        let y2 = yCenter + cos(angle * angleMultiplyer) * radius;
        lines.push(new Line(x, y, x2, y2));
      }
    }

    function draw() {
      timer += .05 * direction;
      background(10, 30)
      stroke(100, 60)
      for (let i = 0; i < lineAmt; i++) {
        lines[i].wave(i)
        line(lines[i].x1, lines[i].y1, lines[i].x2, lines[i].y2)
      }
      if (timer > 100) {
        direction = -direction
      } else if (timer < -100) {
        direction = -direction
      }
    }


    function Line(x1, y1, x2, y2) {
      this.x1 = x1
      this.y1 = y1;
      this.x2 = x2
      this.y2 = y2;
    }

    Line.prototype.wave = function (i) {
      var radi = radians(timer)
      let rad = radians(i)
      this.x2 = xCenter + sin(rad * timer) * radius;
      this.y2 = yCenter + cos(rad * timer) * radius;
      this.x1 = map(i, 0, lineAmt, 0, width)
      this.y1 = 0
    }


    function onMidiNote(note, velocity) {
      let velMap = map(velocity, 0, 127, 0, 100);
      switch (note) {
        case 15:
          angleMultiplyer = velMap;
          break;
        case 14:
          break;
      }
    }

    return {
      setup: setup,
      draw: draw,
      onMidiNote: onMidiNote
    }
  }(),

  /*************************************************
   * Swarm
  *************************************************/
  swarm: function () {

    let vectors;
    let points;
    let pointsAmt;

    function setup() {
      points = [];
      pointsAmt = 150;
      background(0)
      for (let i = 0; i < pointsAmt; i++) {
        points.push(new Point())
      }
    }

    function draw() {
      background(15, 80);
      for (let i = 0; i < pointsAmt; i++) {
        points[i].walk(i);
        points[i].display();

      }
    }

    function Point() {
      this.pos = createVector(width / 2, height / 2);
      this.vel = createVector(0);

    }

    Point.prototype.walk = function (i) {
      // Can use i as first argument of sub to have each point follow the previous one
      // i = i + 1;
      // i == pointsAmt ? i = 0 : i = i;

      let iMap = map(i, 0, pointsAmt, 0, 360);
      let rand = createVector(random(-4, 4), random(-4, 4));
      let rad = radians(iMap)
      let sine = mouseX + sin(rad) * 75
      let cosine = mouseY + cos(rad) * 75
      let prev = createVector(sine, cosine);
      this.acc = p5.Vector.sub(prev, this.pos);
      this.acc.normalize()
      this.acc.add(rand);
      this.acc.mult(2);
      // this.vel.add(this.acc)
      this.pos.add(this.acc);
    }
    Point.prototype.display = function () {
      stroke(255, 80);
      // fill(255, 80);
      ellipse(this.pos.x, this.pos.y, 20);
    }

    function onMidiNote(note, velocity) {

    }

    return {
      setup: setup,
      draw: draw,
      onMidiNote: onMidiNote
    }
  }(),


  /*************************************************
   * New
  *************************************************/

  new: function () {

    let particles;
    let particleAmt;

    function setup() {
      particles = [];
      particleAmt = 100;
      background(0);
      
      for(let i = 0; i < particleAmt; i++){
        let x = map(i, 0, particleAmt, 0, width);
        particles.push(new Particle(i, x, height/2))
      }

    }

    function draw() {
      background(0);

    


      for(let i = 0; i < particleAmt; i ++){
        let gravity = createVector(0, 0.2 * particles[i].size);
        let wind = createVector(0.5, 0);
        particles[i].applyForce(gravity)
        if(mouseIsPressed){
          particles[i].applyForce(wind);
        }
        particles[i].update();
        particles[i].edges();
        particles[i].display();
      }
    }

    function Particle(_size, x, y) {
      this.pos = createVector(x, y);
      this.vel = createVector(0, 0);
      this.acc = createVector(0, 0);
      this.size = _size;
    }

    Particle.prototype.applyForce = function(force){
      force = force.normalize()
      force.div(this.size)
      this.acc =(force);
    }

    Particle.prototype.edges = function() {
      if(this.pos.y > height){
        this.vel.y *= -1;
        this.pos.y = height;
      }
      if(this.pos.y < 0){
        this.vel.y *= -1;
        this.pos.y = 0;
      }
      if(this.pos.x > width){
        this.vel.x *= -1;
        this.pos.x = width;
      }
      if(this.pos.x < 0){
        this.vel.x *= -1;
        this.pos.x = 0;
      }
    }

    Particle.prototype.update = function () {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
    }

    Particle.prototype.display = function () {
      fill(255);
      ellipse(this.pos.x, this.pos.y, this.size)
    }

    function onMidiNote(note, velocity) {

    }

    return {
      setup: setup,
      draw: draw,
      onMidiNote: onMidiNote
    }
  }(),



  // new1: function () {

  //   function setup() {
  //     background(0)
  //   }

  //   function draw() {

  //   }

  //   function onMidiNote(note, velocity) {

  //   }

  //   return {
  //     setup: setup,
  //     draw: draw,
  //     onMidiNote: onMidiNote
  //   }
  // }(),

}