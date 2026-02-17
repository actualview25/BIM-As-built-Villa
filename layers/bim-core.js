// layers/bim-core.js - نظام BIM الأساسي

class BIMSystem {
  constructor() {
    this.viewer = null;
    this.currentScene = null;
    this.networks = BIM_DATA.networks;
    this.types = BIM_DATA.types;
    this.activeLayers = new Set(['EL', 'PW', 'GS', 'AC']);
    this.svgLayers = {};
    this.nodes = [];
    this.lines = [];
  }

  // تهيئة النظام
  init(viewer) {
    this.viewer = viewer;
    this.createSVGLayers();
    this.setupEventListeners();
    console.log('✅ BIM System initialized');
  }

  // إنشاء طبقات SVG
  createSVGLayers() {
    const overlay = document.createElement('div');
    overlay.id = 'bim-overlay';
    overlay.style.cssText = `
      position: absolute; top: 0; left: 0; 
      width: 100%; height: 100%; pointer-events: none;
      z-index: 100;
    `;

    Object.keys(this.types).forEach(type => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.id = `layer-${type}`;
      svg.style.cssText = `
        position: absolute; top: 0; left: 0; 
        width: 100%; height: 100%; pointer-events: none;
        display: none;
      `;
      overlay.appendChild(svg);
      this.svgLayers[type] = svg;
    });

    document.getElementById('pano').appendChild(overlay);
  }

  // تحميل شبكة المشهد الحالي
  loadScene(sceneId) {
    this.clearLayers();
    const sceneData = this.networks[sceneId];
    if (!sceneData) return;

    this.nodes = sceneData.nodes;
    this.drawNetwork();
  }

  // رسم الشبكة
  drawNetwork() {
    if (!this.viewer || !this.currentScene) return;

    // رسم الخطوط أولاً
    this.nodes.forEach(node => {
      node.connections.forEach(targetId => {
        const target = this.nodes.find(n => n.id === targetId);
        if (target) {
          this.drawLine(node, target);
        }
      });
    });

    // ثم رسم النقاط
    this.nodes.forEach(node => {
      this.drawNode(node);
    });
  }

  // رسم خط بين نقطتين
  drawLine(node1, node2) {
    const type = node1.id.split('-')[0];
    if (!this.activeLayers.has(type)) return;

    const svg = this.svgLayers[type];
    if (!svg) return;

    const view = this.viewer.view();
    const yaw = view.yaw();
    const pitch = view.pitch();
    const fov = view.fov();

    // تحويل الإحداثيات
    const x1 = (0.5 + (node1.yaw - yaw) / fov) * window.innerWidth;
    const y1 = (0.5 - (node1.pitch - pitch) / fov) * window.innerHeight;
    const x2 = (0.5 + (node2.yaw - yaw) / fov) * window.innerWidth;
    const y2 = (0.5 - (node2.pitch - pitch) / fov) * window.innerHeight;

    // إنشاء الخط
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', this.types[type].color);
    line.setAttribute('stroke-width', '3');
    line.setAttribute('stroke-dasharray', this.types[type].dash);
    
    svg.appendChild(line);
    this.lines.push(line);
  }

  // رسم نقطة
  drawNode(node) {
    const type = node.id.split('-')[0];
    if (!this.activeLayers.has(type)) return;

    const svg = this.svgLayers[type];
    if (!svg) return;

    const view = this.viewer.view();
    const yaw = view.yaw();
    const pitch = view.pitch();
    const fov = view.fov();

    const x = (0.5 + (node.yaw - yaw) / fov) * window.innerWidth;
    const y = (0.5 - (node.pitch - pitch) / fov) * window.innerHeight;

    // دائرة النقطة
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', this.getNodeSize(node.type));
    circle.setAttribute('fill', this.types[type].color);
    circle.setAttribute('stroke', 'white');
    circle.setAttribute('stroke-width', '2');
    
    // إضافة خاصية التفاعل
    circle.style.pointerEvents = 'auto';
    circle.style.cursor = 'pointer';
    circle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showNodeInfo(node);
    });

    svg.appendChild(circle);
  }

  getNodeSize(type) {
    return { source: 10, junction: 8, endpoint: 6 }[type] || 6;
  }

  // عرض معلومات النقطة
  showNodeInfo(node) {
    const panel = document.getElementById('bim-info-panel') || this.createInfoPanel();
    const type = this.types[node.id.split('-')[0]];
    
    panel.innerHTML = `
      <div style="border-bottom: 2px solid ${type.color}; padding-bottom: 10px;">
        <strong>${node.name}</strong>
      </div>
      <div style="margin-top: 10px;">
        <div>🆔 ${node.id}</div>
        <div>📍 النوع: ${type.name}</div>
        <div>🔗 متصل بـ: ${node.connections.join(', ')}</div>
      </div>
    `;
    panel.style.display = 'block';
  }

  createInfoPanel() {
    const panel = document.createElement('div');
    panel.id = 'bim-info-panel';
    panel.style.cssText = `
      position: fixed; bottom: 20px; right: 20px;
      background: rgba(0,0,0,0.9); color: white;
      padding: 20px; border-radius: 10px;
      z-index: 1000; max-width: 300px;
      border: 1px solid #333; display: none;
    `;
    document.body.appendChild(panel);
    return panel;
  }

  // إظهار/إخفاء طبقة
  toggleLayer(type) {
    if (this.activeLayers.has(type)) {
      this.activeLayers.delete(type);
      this.svgLayers[type].style.display = 'none';
    } else {
      this.activeLayers.add(type);
      this.svgLayers[type].style.display = 'block';
    }
    this.clearLayers();
    this.drawNetwork();
  }

  clearLayers() {
    Object.values(this.svgLayers).forEach(svg => svg.innerHTML = '');
    this.lines = [];
  }

  // تحديث الرسم عند التحرك
  update() {
    if (!this.currentScene) return;
    this.clearLayers();
    this.drawNetwork();
    requestAnimationFrame(() => this.update());
  }
}

// إنشاء نسخة عامة
window.BIM = new BIMSystem();

// إضافة الأنظمة الفرعية بعد تهيئة BIM
window.BIMSystem.prototype.initSubsystems = function() {
  this.plumbing = new PlumbingSystem(this);
  this.hvac = new HVACSystem(this);
  this.gas = new GasSystem(this);
  
  // تخزين المراجع
  this.subsystems = {
    'PW': this.plumbing,
    'AC': this.hvac,
    'GS': this.gas
  };
  
  console.log('✅ BIM Subsystems initialized');
};

// تعديل دالة init الأصلية
const originalInit = window.BIMSystem.prototype.init;
window.BIMSystem.prototype.init = function(viewer) {
  originalInit.call(this, viewer);
  this.initSubsystems();
};

// تعديل دالة showNodeInfo لعرض معلومات إضافية
const originalShowInfo = window.BIMSystem.prototype.showNodeInfo;
window.BIMSystem.prototype.showNodeInfo = function(node) {
  const type = node.id.split('-')[0];
  const subsystem = this.subsystems[type];
  
  let extraInfo = '';
  if (subsystem) {
    const parsed = subsystem.parseHotspotData(node);
    extraInfo = Object.entries(parsed)
      .map(([key, val]) => `<div class="bim-info-row">
        <span class="bim-info-label">${key}:</span>
        <span class="bim-info-value">${val}</span>
      </div>`)
      .join('');
  }
  
  // عرض المعلومات
  const panel = document.getElementById('bim-info-panel');
  const content = document.getElementById('bim-panel-content');
  
  content.innerHTML = `
    <div class="bim-info-row">
      <span class="bim-info-label">الاسم:</span>
      <span class="bim-info-value">${node.name || node.id}</span>
    </div>
    <div class="bim-info-row">
      <span class="bim-info-label">النوع:</span>
      <span class="bim-info-value">${this.types[type]?.name || 'غير محدد'}</span>
    </div>
    ${extraInfo}
    <div class="bim-info-row">
      <span class="bim-info-label">الإحداثيات:</span>
      <span class="bim-info-value">yaw: ${node.yaw.toFixed(2)}, pitch: ${node.pitch.toFixed(2)}</span>
    </div>
  `;
  
  panel.classList.add('visible');
};