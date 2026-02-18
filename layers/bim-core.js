// ===========================
// bim-core.js - النسخة الحديثة
// ===========================

// ========== تهيئة الـ SVG layer ==========
const overlayDiv = document.getElementById('bim-overlay');
const svgLayer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svgLayer.setAttribute("width", "100%");
svgLayer.setAttribute("height", "100%");
svgLayer.setAttribute("class", "bim-layer");
overlayDiv.appendChild(svgLayer);

// ===========================
// تعريف الأنظمة (الطبقات)
// ===========================

class BIMSystem {
  constructor(name, colorClass) {
    this.name = name;          // مثل 'EL', 'PW', 'GS', 'AC'
    this.colorClass = colorClass; // css class لتلوين الخطوط
    this.group = this.createGroup();
    this.visible = true;
  }

  createGroup() {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", `fixed-layer ${this.colorClass}`);
    svgLayer.appendChild(g);
    return g;
  }

  // إنشاء نقطة ثابتة
  createPoint(x, y, options = {}) {
    const pt = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    pt.setAttribute("cx", x);
    pt.setAttribute("cy", y);
    pt.setAttribute("r", options.r || 10);
    pt.setAttribute("class", "fixed-point");
    if(options.type) pt.setAttribute("data-type", options.type);
    if(options.title) pt.setAttribute("title", options.title);
    this.group.appendChild(pt);
    return pt;
  }

  // إنشاء خط
  createLine(x1, y1, x2, y2) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("class", `fixed-line ${this.colorClass}-line`);
    this.group.appendChild(line);
    return line;
  }

  show() {
    this.group.style.display = 'block';
    this.visible = true;
  }

  hide() {
    this.group.style.display = 'none';
    this.visible = false;
  }

  toggle() {
    this.visible ? this.hide() : this.show();
  }
}

// ===========================
// إنشاء كل الطبقات
// ===========================
const ElectricalSystem = new BIMSystem('EL', 'EL');
const PlumbingSystem = new BIMSystem('PW', 'PW');
const GasSystem = new BIMSystem('GS', 'GS');
const ACSystem = new BIMSystem('AC', 'AC');

// ===========================
// مثال على إضافة عناصر
// (يمكنك استبدال الإحداثيات بحسب مشروعك)
// ===========================
ElectricalSystem.createPoint(100, 100, {type: 'source', title: 'لوحة كهرباء'});
ElectricalSystem.createLine(100, 100, 200, 200);

PlumbingSystem.createPoint(300, 100, {type: 'junction', title: 'صمام مياه'});
PlumbingSystem.createLine(300, 100, 400, 200);

GasSystem.createPoint(500, 150, {type: 'endpoint', title: 'خط غاز'});
GasSystem.createLine(500, 150, 600, 250);

ACSystem.createPoint(200, 300, {type: 'source', title: 'وحدة تكييف'});
ACSystem.createLine(200, 300, 300, 400);

// ===========================
// التحكم بأزرار الـ BIM
// ===========================
document.querySelectorAll('.bim-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const layer = btn.dataset.layer;
    btn.classList.toggle('active');

    switch(layer) {
      case 'EL': ElectricalSystem.toggle(); break;
      case 'PW': PlumbingSystem.toggle(); break;
      case 'GS': GasSystem.toggle(); break;
      case 'AC': ACSystem.toggle(); break;
    }
  });
});

// ===========================
// تهيئة لوحة المعلومات (tooltip)
// ===========================
const infoPanel = document.getElementById('bim-info-panel');
const infoContent = document.getElementById('bim-panel-content');

svgLayer.addEventListener('click', e => {
  if(e.target.classList.contains('fixed-point')) {
    const title = e.target.getAttribute('title') || 'عنصر';
    infoContent.innerHTML = `<p><strong>${title}</strong></p>`;
    infoPanel.classList.add('visible');
  }
});

// إغلاق لوحة المعلومات
document.querySelector('#bim-panel-header button')
  .addEventListener('click', () => infoPanel.classList.remove('visible'));
