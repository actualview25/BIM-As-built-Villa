class BIMSystem {
  constructor() {
    this.nodes = [];         // كل الـ nodes من كل الأنظمة
    this.layers = {};        // عناصر DOM لكل طبقة
    this.systems = {};       // الأنظمة الفرعية: EL, GS, AC, PW
  }

  // تهيئة الأنظمة وربط الـ DOM
  init() {
    // ربط الأنظمة الفرعية
    this.systems = {
      EL: new ElectricalSystem(this),
      GS: new GasSystem(this),
      AC: new HVACSystem(this),
      PW: new PlumbingSystem(this)
    };

    // التأكد من وجود div لكل طبقة
    Object.keys(this.systems).forEach(type => {
      const layer = document.querySelector(`#layer-${type}`);
      if (!layer) {
        console.warn(`Layer DOM for ${type} not found!`);
        return;
      }
      this.layers[type] = layer;

      // إضافة SVG داخل كل div إذا لم يكن موجود
      let svg = layer.querySelector('svg');
      if (!svg) {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        layer.appendChild(svg);
      }

      // رسم كل nodes الموجودة في النظام
      if (this.systems[type].nodes) {
        this.systems[type].nodes.forEach(node => {
          this.systems[type].drawSpecial(node, svg, node.x, node.y);
        });
      }
    });
  }

  // تبديل الطبقة المرئية
  showLayer(type) {
    Object.keys(this.layers).forEach(t => {
      this.layers[t].style.display = t === type ? 'block' : 'none';
    });
  }

  // تحديث جميع الـ Hotspots في الطبقات الظاهرة
  update() {
    Object.keys(this.systems).forEach(type => {
      const layer = this.layers[type];
      if (!layer || layer.style.display === 'none') return;

      const svg = layer.querySelector('svg');
      // مسح الرموز القديمة
      svg.querySelectorAll('text, circle, path').forEach(el => el.remove());

      // رسم جميع nodes الحالية
      this.systems[type].nodes.forEach(node => {
        this.systems[type].drawSpecial(node, svg, node.x, node.y);
      });
    });
  }
}

// تهيئة النظام
const BIM = new BIMSystem();
BIM.init();

// مثال لتبديل الطبقة إلى الكهرباء
// BIM.showLayer('EL');
