// js/bim-system.js - نظام BIM الموحد

const BIMSystem = {
  viewer: null,
  currentScene: null,
  scenes: [],
  layers: {
    electrical: { visible: true, elements: [], color: '#44ff44', dash: '5,5' },
    plumbing: { visible: true, elements: [], color: '#4444ff', dash: 'none' },
    gas: { visible: true, elements: [], color: '#ff4444', dash: '4,4' },
    hvac: { visible: true, elements: [], color: '#ffaa44', dash: '10,5' }
  },

  // تهيئة النظام
  init: function(viewer, scenesList) {
    this.viewer = viewer;
    this.scenes = scenesList;
    this.createSVGLayers();
    this.loadHotspotsFromScenes();
    console.log('✅ BIM System initialized');
  },

  // إنشاء طبقات SVG
  createSVGLayers: function() {
    // إزالة القديم
    const oldOverlay = document.getElementById('bim-overlay');
    if (oldOverlay) oldOverlay.remove();

    const overlay = document.createElement('div');
    overlay.id = 'bim-overlay';
    overlay.style.cssText = `
      position: absolute; top: 0; left: 0;
      width: 100%; height: 100%; pointer-events: none;
      z-index: 100;
    `;

    Object.keys(this.layers).forEach(key => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.id = `layer-${key}`;
      svg.style.cssText = `
        position: absolute; top: 0; left: 0;
        width: 100%; height: 100%; pointer-events: none;
        display: block;
      `;
      overlay.appendChild(svg);
      this.layers[key].svg = svg;
    });

    document.getElementById('pano').appendChild(overlay);
  },

  // تحميل البيانات من Hotspots
  loadHotspotsFromScenes: function() {
    if (!this.scenes) return;

    this.scenes.forEach(scene => {
      const hotspots = scene.data.infoHotspots || [];
      
      hotspots.forEach(hotspot => {
        // تحليل العنوان والنص
        const id = hotspot.title.replace(/<[^>]*>/g, '').trim();
        const text = hotspot.text || '';
        
        // تحديد النوع من الـ ID
        let type = null;
        if (id.includes('EL')) type = 'electrical';
        else if (id.includes('PW')) type = 'plumbing';
        else if (id.includes('GS')) type = 'gas';
        else if (id.includes('AC')) type = 'hvac';
        
        if (!type) return;

        // تخزين النقطة
        if (!this.layers[type].points) {
          this.layers[type].points = [];
        }

        this.layers[type].points.push({
          id: id,
          sceneId: scene.data.id,
          yaw: hotspot.yaw,
          pitch: hotspot.pitch,
          text: text,
          connections: this.parseConnections(text)
        });
      });
    });

    console.log('✅ Hotspots loaded:', this.getStats());
  },

  // تحليل الاتصالات من النص
  parseConnections: function(text) {
    const connections = [];
    const patterns = [
      /(?:IN TO|TO|FROM)\s+([A-Z0-9-]+)/gi,
      /([A-Z]+(?:-SEN|-JN|-END)-\d+)/g
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        connections.push(match[1]);
      }
    });
    
    return connections;
  },

  // رسم شبكة المشهد الحالي
  drawCurrentScene: function() {
    if (!this.currentScene || !this.viewer) return;

    const sceneId = this.currentScene.data.id;
    
    Object.keys(this.layers).forEach(type => {
      const layer = this.layers[type];
      if (!layer.svg) return;
      
      // مسح القديم
      layer.svg.innerHTML = '';
      
      // رسم نقاط هذا المشهد فقط
      const points = layer.points?.filter(p => p.sceneId === sceneId) || [];
      
      // رسم الخطوط أولاً
      points.forEach(point => {
        point.connections.forEach(connId => {
          const target = points.find(p => p.id === connId);
          if (target) {
            this.drawLine(type, point, target);
          }
        });
      });

      // ثم رسم النقاط
      points.forEach(point => {
        this.drawPoint(type, point);
      });
    });
  },

  // رسم خط
  drawLine: function(type, point1, point2) {
    const layer = this.layers[type];
    if (!layer || !layer.svg || !this.viewer) return;

    const view = this.viewer.view();
    const yaw = view.yaw();
    const pitch = view.pitch();
    const fov = view.fov();

    // تحويل الإحداثيات الزاوية إلى إحداثيات شاشة
    const x1 = (0.5 + (point1.yaw - yaw) / fov) * window.innerWidth;
    const y1 = (0.5 - (point1.pitch - pitch) / fov) * window.innerHeight;
    const x2 = (0.5 + (point2.yaw - yaw) / fov) * window.innerWidth;
    const y2 = (0.5 - (point2.pitch - pitch) / fov) * window.innerHeight;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', layer.color);
    line.setAttribute('stroke-width', '3');
    line.setAttribute('stroke-dasharray', layer.dash);
    line.setAttribute('class', `${type}-path`);

    layer.svg.appendChild(line);
  },

  // رسم نقطة
  drawPoint: function(type, point) {
    const layer = this.layers[type];
    if (!layer || !layer.svg || !this.viewer) return;

    const view = this.viewer.view();
    const yaw = view.yaw();
    const pitch = view.pitch();
    const fov = view.fov();

    const x = (0.5 + (point.yaw - yaw) / fov) * window.innerWidth;
    const y = (0.5 - (point.pitch - pitch) / fov) * window.innerHeight;

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', '6');
    circle.setAttribute('fill', layer.color);
    circle.setAttribute('stroke', 'white');
    circle.setAttribute('stroke-width', '2');
    circle.setAttribute('data-id', point.id);
    circle.style.cursor = 'pointer';
    circle.style.pointerEvents = 'auto';
    
    circle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showPointInfo(point);
    });

    layer.svg.appendChild(circle);
  },

  // عرض معلومات النقطة
  showPointInfo: function(point) {
    const panel = document.getElementById('data-panel');
    const title = document.getElementById('panel-title');
    const content = document.getElementById('panel-content');
    
    title.textContent = point.id;
    
    let html = '<table style="width:100%; color:white;">';
    html += `<tr><td><strong>النوع:</strong></td><td>${this.getTypeName(point.id)}</td></tr>`;
    html += `<tr><td><strong>الاتصالات:</strong></td><td>${point.connections.join(', ') || 'لا توجد'}</td></tr>`;
    html += `<tr><td><strong>النص:</strong></td><td>${point.text || 'لا يوجد'}</td></tr>`;
    html += '</table>';
    
    content.innerHTML = html;
    panel.classList.add('visible');
  },

  // تحديد اسم النوع
  getTypeName: function(id) {
    if (id.includes('EL')) return '⚡ كهرباء';
    if (id.includes('PW')) return '💧 مياه';
    if (id.includes('GS')) return '🔥 غاز';
    if (id.includes('AC')) return '❄️ تكييف';
    return 'غير معروف';
  },

  // إظهار/إخفاء طبقة
  toggleLayer: function(type) {
    const layer = this.layers[type];
    if (!layer) return;
    
    layer.visible = !layer.visible;
    
    if (layer.svg) {
      layer.svg.style.display = layer.visible ? 'block' : 'none';
    }
    
    // تحديث شكل الزر
    document.querySelectorAll(`.layer-btn[data-layer="${type}"]`).forEach(btn => {
      if (layer.visible) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  },

  // إحصائيات
  getStats: function() {
    const stats = {};
    Object.keys(this.layers).forEach(type => {
      stats[type] = this.layers[type].points?.length || 0;
    });
    return stats;
  },

  // تحديث الرسم عند التحرك
  update: function() {
    if (!this.currentScene) return;
    this.drawCurrentScene();
    requestAnimationFrame(() => this.update());
  }
};

window.BIMSystem = BIMSystem;
