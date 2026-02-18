// ================================
// bim-core.js - النسخة الجاهزة
// ================================

// الحصول على overlay
const overlay = document.getElementById('bim-overlay');

// ================================
// تعريف الأنظمة
// ================================
class ElectricalSystem {
  constructor(svgLayer) {
    this.svgLayer = svgLayer;
    this.group = this.createGroup('electric');
  }

  createGroup(id) {
    let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute('id', id);
    svgLayer.appendChild(g);
    return g;
  }

  draw() {
    // مثال رسم خط كهرباء
    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute('x1', 100);
    line.setAttribute('y1', 100);
    line.setAttribute('x2', 300);
    line.setAttribute('y2', 100);
    line.setAttribute('stroke', 'yellow');
    line.setAttribute('stroke-width', 3);
    this.group.appendChild(line);
  }

  show() { this.group.style.display = 'block'; }
  hide() { this.group.style.display = 'none'; }
}

class PlumbingSystem {
  constructor(svgLayer) {
    this.svgLayer = svgLayer;
    this.group = this.createGroup('plumbing');
  }

  createGroup(id) {
    let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute('id', id);
    svgLayer.appendChild(g);
    return g;
  }

  draw() {
    // مثال رسم خط مياه
    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute('x1', 100);
    line.setAttribute('y1', 150);
    line.setAttribute('x2', 300);
    line.setAttribute('y2', 150);
    line.setAttribute('stroke', 'blue');
    line.setAttribute('stroke-width', 3);
    this.group.appendChild(line);
  }

  show() { this.group.style.display = 'block'; }
  hide() { this.group.style.display = 'none'; }
}

class GasSystem {
  constructor(svgLayer) {
    this.svgLayer = svgLayer;
    this.group = this.createGroup('gas');
  }

  createGroup(id) {
    let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute('id', id);
    svgLayer.appendChild(g);
    return g;
  }

  draw() {
    // مثال رسم خط غاز
    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute('x1', 100);
    line.setAttribute('y1', 200);
    line.setAttribute('x2', 300);
    line.setAttribute('y2', 200);
    line.setAttribute('stroke', 'red');
    line.setAttribute('stroke-width', 3);
    this.group.appendChild(line);
  }

  show() { this.group.style.display = 'block'; }
  hide() { this.group.style.display = 'none'; }
}

class ACSystem {
  constructor(svgLayer) {
    this.svgLayer = svgLayer;
    this.group = this.createGroup('ac');
  }

  createGroup(id) {
    let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute('id', id);
    svgLayer.appendChild(g);
    return g;
  }

  draw() {
    // مثال رسم خط تكييف
    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute('x1', 100);
    line.setAttribute('y1', 250);
    line.setAttribute('x2', 300);
    line.setAttribute('y2', 250);
    line.setAttribute('stroke', 'cyan');
    line.setAttribute('stroke-width', 3);
    this.group.appendChild(line);
  }

  show() { this.group.style.display = 'block'; }
  hide() { this.group.style.display = 'none'; }
}

// ================================
// تهيئة كل الأنظمة
// ================================
const electrical = new ElectricalSystem(overlay);
const plumbing   = new PlumbingSystem(overlay);
const gas        = new GasSystem(overlay);
const ac         = new ACSystem(overlay);

// رسم خطوط تجريبية لكل نظام
electrical.draw();
plumbing.draw();
gas.draw();
ac.draw();

// إخفاء كل الأنظمة كبداية
electrical.hide();
plumbing.hide();
gas.hide();
ac.hide();

// ================================
// ربط أزرار التحكم
// ================================
document.querySelectorAll('#bim-controls .bim-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const layer = btn.dataset.layer;
    btn.classList.toggle('active');

    switch(layer) {
      case 'EL': btn.classList.contains('active') ? electrical.show() : electrical.hide(); break;
      case 'PW': btn.classList.contains('active') ? plumbing.show() : plumbing.hide(); break;
      case 'GS': btn.classList.contains('active') ? gas.show() : gas.hide(); break;
      case 'AC': btn.classList.contains('active') ? ac.show() : ac.hide(); break;
    }
  });
});
