let canción;
let analizador;
let sonando = false;

let btnPlay, elStatus;
let volTrack, volFill, volThumb;
let vol = 0.8;

let smooth = [];
let particulas = [];

function preload() {
    canción = loadSound('assets/tini.mp3');
}

function setup() {
    let lienzo = createCanvas(windowWidth, windowHeight);
    lienzo.parent('canvasWrap');

    analizador = new p5.FFT(0.78, 128);

    btnPlay = select('#btnPlay');
    elStatus = select('#statusInfo');
    volTrack = select('#volBar');
    volFill = select('#volFill');
    volThumb = select('#volThumb');

    btnPlay.mousePressed(togglePlay);

    canción.setVolume(vol);

    for (let i = 0; i < 128; i++) smooth[i] = 0;

    configurarVolumen();
    actualizarVol();

    for (let i = 0; i < 50; i++) {
        particulas.push(new Particula());
    }
}

function draw() {
    clear();
    dibujarFondo();

    let esp = analizador.analyze();
    for (let i = 0; i < esp.length; i++) {
        smooth[i] = lerp(smooth[i], esp[i], 0.18);
    }

    let graves = analizador.getEnergy('bass');
    let agudos = analizador.getEnergy('treble');

    dibujarAnillos(smooth, graves);
    dibujarParticulas(graves, agudos);
    dibujarCentro(graves);
    dibujarMouseEfecto(graves, agudos);
}

function dibujarFondo() {
    noStroke();
    for (let i = 0; i < 6; i++) {
        let r = map(i, 0, 6, 0.2, 0.05);
        let alpha = map(i, 0, 6, 8, 2);
        fill(236, 72, 153, alpha);
        ellipse(width / 2, height / 2, width * r);
    }
}

function dibujarAnillos(esp, graves) {
    let cx = width / 2;
    let cy = height / 2;
    let radioBase = min(width, height) * 0.3;
    let pulso = map(graves, 0, 255, 1, 1.15);

    noFill();
    strokeWeight(2);
    colorMode(HSB, 360, 100, 100, 100);

    let n = esp.length;
    for (let i = 0; i < n; i++) {
        let angulo = map(i, 0, n, 0, TWO_PI);
        let val = esp[i] * pulso;
        let desplazamiento = map(val, 0, 255, 0, min(width, height) * 0.25);
        let radio = radioBase + desplazamiento;

        let h = map(i, 0, n, 300, 340);
        let s = map(val, 0, 255, 40, 95);
        let bri = map(val, 0, 255, 40, 90);
        let alpha = map(val, 0, 255, 30, 160);

        stroke(h, s, bri, alpha);
        strokeWeight(map(val, 0, 255, 1.5, 5));

        let x1 = cx + cos(angulo) * radioBase;
        let y1 = cy + sin(angulo) * radioBase;
        let x2 = cx + cos(angulo) * radio;
        let y2 = cy + sin(angulo) * radio;

        line(x1, y1, x2, y2);

        if (val > 30) {
            noStroke();
            fill(h, s, bri, alpha * 0.5);
            ellipse(x2, y2, map(val, 0, 255, 3, 12));
        }
    }

    colorMode(RGB, 255);
}

function dibujarCentro(graves) {
    let cx = width / 2;
    let cy = height / 2;
    let r = map(graves, 0, 255, 20, 50);

    noStroke();
    fill(236, 72, 153, map(graves, 0, 255, 40, 140));
    ellipse(cx, cy, r * 2);

    fill(255, map(graves, 0, 255, 100, 220));
    ellipse(cx, cy, r * 0.4);
}

function dibujarMouseEfecto(graves, agudos) {
    let r = map(graves, 0, 255, 15, 60);
    let rot = map(agudos, 0, 255, 0, TWO_PI);

    push();
    translate(mouseX, mouseY);
    rotate(rot);

    noStroke();
    fill(236, 72, 153, map(graves, 0, 255, 25, 90));
    ellipse(0, 0, r * 2);

    fill(255, map(graves, 0, 255, 40, 160));
    ellipse(0, 0, 5);

    stroke(255, 255, 255, 40);
    strokeWeight(1);
    noFill();
    ellipse(0, 0, r * 3);

    pop();
}

function dibujarParticulas(graves, agudos) {
    for (let p of particulas) {
        p.actualizar(graves, agudos);
        p.mostrar();
    }
}

function togglePlay() {
    if (getAudioContext().state === 'suspended') {
        getAudioContext().resume();
    }

    if (sonando) {
        canción.pause();
        sonando = false;
        btnPlay.removeClass('playing');
        btnPlay.html(
            '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">' +
            '<polygon points="6,4 20,12 6,20"/></svg>'
        );
        elStatus.html('Pausado');
        elStatus.style('opacity', '1');
    } else {
        canción.play();
        sonando = true;
        btnPlay.addClass('playing');
        btnPlay.html(
            '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">' +
            '<rect x="6" y="4" width="4" height="16" rx="1"/>' +
            '<rect x="14" y="4" width="4" height="16" rx="1"/></svg>'
        );
        elStatus.html('Reproduciendo');
        elStatus.style('opacity', '1');
        setTimeout(() => { elStatus.style('opacity', '0'); }, 2500);
    }
}

function configurarVolumen() {
    let el = volTrack.elt;
    if (!el) return;

    function mover(e) {
        let rect = el.getBoundingClientRect();
        let x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
        vol = constrain(x / rect.width, 0, 1);
        canción.setVolume(vol);
        actualizarVol();
    }

    el.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        mover(e);
        let onMove = (ev) => mover(ev);
        let onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    });

    el.addEventListener('touchstart', (e) => {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
        mover(e);
        let onMove = (ev) => mover(ev);
        let onUp = () => {
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onUp);
        };
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onUp);
    });
}

function actualizarVol() {
    let pct = vol * 100;
    volFill.style('width', pct + '%');
    volThumb.style('left', pct + '%');
    if (vol === 0) volFill.style('background', 'rgba(255,255,255,0.2)');
    else volFill.style('background', 'rgba(236,72,153,0.7)');
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

class Particula {
    constructor() {
        this.reiniciar(true);
    }

    reiniciar(rand) {
        let ang = random(TWO_PI);
        let dist = rand ? random(50, 300) : 300;
        this.x = width / 2 + cos(ang) * dist;
        this.y = height / 2 + sin(ang) * dist;
        this.vx = random(-0.8, 0.8);
        this.vy = random(-0.8, 0.8);
        this.tam = random(2, 6);
        this.hue = random(300, 340);
    }

    actualizar(graves, agudos) {
        let f = map(graves, 0, 255, 0.3, 2);

        this.x += this.vx * f + random(-0.3, 0.3);
        this.y += this.vy * f + random(-0.3, 0.3);

        let cx = width / 2;
        let cy = height / 2;
        let d = dist(this.x, this.y, cx, cy);
        let maxR = max(width, height) * 0.5;

        if (d > maxR) {
            let ang = atan2(this.y - cy, this.x - cx);
            this.x = cx + cos(ang) * maxR * 0.9;
            this.y = cy + sin(ang) * maxR * 0.9;
            this.vx *= -0.5;
            this.vy *= -0.5;
        }
    }

    mostrar() {
        noStroke();
        colorMode(HSB, 360, 100, 100, 100);
        fill(this.hue, 80, 90, 50);
        ellipse(this.x, this.y, this.tam);
        colorMode(RGB, 255);
    }
}