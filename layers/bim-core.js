// layers/bim-core.js - نظام BIM الأساسي

class BIMSystem {
  constructor() {
    this.viewer = null;
    this.currentScene = null;
    this.networks = BIM_DATA ? BIM_DATA.networks : {};
    this.types = BIM_DATA ? BIM_DATA.types : {};
    this.activeLayers = new Set(['EL', 'PW', 'GS', 'AC']);
    this.svgLayers = {};
    this.nodes = [];
    this.lines = [];
    this.subsystems = {};
  }

  // تهيئة النظام
  init(viewer) {
    this.viewer = viewer;
    this.createSVGLayers();
    this.setupEventListeners();
    
    // تهيئة الأنظمة الفرعية بعد تعريف this
    this.initSubsystems();
    
    console.log('✅ BIM System initialized');
  }

  // تهيئة الأنظمة الفرعية (داخل الكلاس)
  initSubsystems() {
    // التحقق من وجود الكلاسات قبل استخدامها
    if (typeof PlumbingSystem !== 'undefined') {
      this.plumbing = new PlumbingSystem(this);
      this.subsystems['PW'] = this.plumbing;
    }
    
    if (typeof HVACSystem !== 'undefined') {
      this.hvac = new HVACSystem(this);
      this.subsystems['AC'] = this.hvac;
    }
    
    if (typeof GasSystem !== 'undefined') {
      this.gas = new GasSystem(this);
      this.subsystems['GS'] = this.gas;
    }
    
    if (typeof ElectricalSystem !== 'undefined') {
      this.electrical = new ElectricalSystem(this);
      this.subsystems['EL'] = this.electrical;
    }
    
    console.log('✅ BIM Subsystems initialized');
  }

  // إنشاء طبقات SVG
  createSVGLayers() {
    // إزالة الـ overlay القديم إذا وجد
    const oldOverlay = document.getElementById('bim-overlay');
    if (oldOverlay) oldOverlay.remove();

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
      svg.setAttribute('class', 'bim-layer');
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

  // إعداد مستمعي الأحداث
  setupEventListeners() {
    // مستمع لتغيير المشهد
    document.addEventListener('sceneChanged', (e) => {
      if (e.detail && e.detail.scene) {
        this.currentScene = e.detail.scene;
        this.loadScene(e.detail.scene.data.id);
      }
    });
  }

  // تحميل شبكة المشهد الحالي
  loadScene(sceneId) {
    this.clearLayers();
    if (!this.networks) return;
    
    const sceneData = this.networks[sceneId];
    if (!sceneData) {
      console.log('No BIM data for scene:', sceneId);
      return;
    }

    this.nodes = sceneData.nodes || [];
    this.drawNetwork();
  }

  // رسم الشبكة
  drawNetwork() {
    if (!this.viewer || !this.currentScene) return;

    // رسم الخطوط أولاً
    this.nodes.forEach(node => {
      if (node.connections && Array.isArray(node.connections)) {
        node.connections.forEach(targetId => {
          const target = this.nodes.find(n => n.id === targetId);
          if (target) {
            this.drawLine(node, target);
          }
        });
      }
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

    try {
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
      line.setAttribute('stroke', this.types[type]?.color || '#ffffff');
      line.setAttribute('stroke-width', '3');
      line.setAttribute('stroke-dasharray', this.types[type]?.dash || 'none');
      line.setAttribute('class', 'bim-line');
      
      svg.appendChild(line);
      this.lines.push(line);
    } catch (e) {
      console.warn('Error drawing line:', e);
    }
  }

  // رسم نقطة
  drawNode(node) {
    const type = node.id.split('-')[0];
    if (!this.activeLayers.has(type)) return;

    const svg = this.svgLayers[type];
    if (!svg) return;

    try {
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
      circle.setAttribute('fill', this.types[type]?.color || '#ffffff');
      circle.setAttribute('stroke', 'white');
      circle.setAttribute('stroke-width', '2');
      circle.setAttribute('class', 'bim-node ' + (node.type || ''));
      
      // إضافة خاصية التفاعل
      circle.style.pointerEvents = 'auto';
      circle.style.cursor = 'pointer';
      circle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showNodeInfo(node);
      });

      svg.appendChild(circle);

      // استدعاء الرسم الخاص بالنظام الفرعي
      const subsystem = this.subsystems[type];
      if (subsystem && subsystem.drawSpecial) {
        subsystem.drawSpecial(node, svg, x, y);
      }
    } catch (e) {
      console.warn('Error drawing node:', e);
    }
  }

  getNodeSize(type) {
    const sizes = { source: 10, junction: 8, endpoint: 6 };
    return sizes[type] || 6;
  }

  // عرض معلومات النقطة
  showNodeInfo(node) {
    const panel = document.getElementById('bim-info-panel');
    if (!panel) return;
    
    const type = node.id.split('-')[0];
    const subsystem = this.subsystems[type];
    const typeInfo = this.types[type] || { name: 'غير محدد', color: '#ffffff' };
    
    let extraInfo = '';
    if (subsystem && subsystem.parseHotspotData) {
      const parsed = subsystem.parseHotspotData(node);
      extraInfo = Object.entries(parsed)
        .map(([key, val]) => `<div class="bim-info-row">
          <span class="bim-info-label">${key}:</span>
          <span class="bim-info-value">${val}</span>
        </div>`)
        .join('');
    }
    
    const content = document.getElementById('bim-panel-content');
    if (content) {
      content.innerHTML = `
        <div class="bim-info-row">
          <span class="bim-info-label">الاسم:</span>
          <span class="bim-info-value">${node.name || node.id}</span>
        </div>
        <div class="bim-info-row">
          <span class="bim-info-label">النوع:</span>
          <span class="bim-info-value">${typeInfo.name}</span>
        </div>
        ${extraInfo}
        <div class="bim-info-row">
          <span class="bim-info-label">الإحداثيات:</span>
          <span class="bim-info-value">yaw: ${node.yaw?.toFixed(2) || 0}, pitch: ${node.pitch?.toFixed(2) || 0}</span>
        </div>
      `;
    }
    
    panel.classList.add('visible');
  }

  // إظهار/إخفاء طبقة
  toggleLayer(type) {
    if (this.activeLayers.has(type)) {
      this.activeLayers.delete(type);
      if (this.svgLayers[type]) {
        this.svgLayers[type].style.display = 'none';
      }
    } else {
      this.activeLayers.add(type);
      if (this.svgLayers[type]) {
        this.svgLayers[type].style.display = 'block';
      }
    }
    this.clearLayers();
    this.drawNetwork();
    
    // تحديث حالة الأزرار
    this.updateButtonStates(type);
  }

  updateButtonStates(type) {
    const buttons = document.querySelectorAll(`.bim-btn[data-layer="${type}"]`);
    buttons.forEach(btn => {
      if (this.activeLayers.has(type)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  clearLayers() {
    Object.values(this.svgLayers).forEach(svg => {
      if (svg) svg.innerHTML = '';
    });
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

// إنشاء نسخة عامة بعد تعريف الكلاس
window.BIM = new BIMSystem();

// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ BIM Core loaded and ready');
});
