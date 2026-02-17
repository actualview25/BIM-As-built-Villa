// js/bim-system.js - نظام BIM الموحد والمبسط

const BIM = {
  viewer: null,
  currentScene: null,
  scenes: [],
  layers: {
    EL: { visible: true, color: '#44ff44', dash: '8,8', name: 'كهرباء', icon: '⚡', points: [] },
    PW: { visible: true, color: '#4444ff', dash: 'none', name: 'مياه', icon: '💧', points: [] },
    GS: { visible: true, color: '#ff4444', dash: '4,4', name: 'غاز', icon: '🔥', points: [] },
    AC: { visible: true, color: '#ffaa44', dash: '12,6', name: 'تكييف', icon: '❄️', points: [] }
  },

  // تهيئة النظام
  init: function(viewer, scenesList) {
    this.viewer = viewer;
    this.scenes = scenesList;
    this.createSVGLayers();
    this.loadHotspotsFromData();
    console.log('✅ BIM System initialized');
    return this;
  },

  // إنشاء طبقات SVG
  createSVGLayers: function() {
    const overlay = document.getElementById('bim-overlay');
    if (!overlay) return;
    
    Object.keys(this.layers).forEach(key => {
      const svg = document.getElementById(`layer-${key}`);
      if (svg) {
        this.layers[key].svg = svg;
        svg.innerHTML = ''; // مسح المحتوى القديم
      }
    });
  },

  // تحميل البيانات من Hotspots في data.js
  loadHotspotsFromData: function() {
    if (!this.scenes) return;

    this.scenes.forEach(scene => {
      const hotspots = scene.data.infoHotspots || [];
      
      hotspots.forEach(hotspot => {
        // استخراج الـ ID من title (إزالة وسوم HTML)
        const id = this.cleanText(hotspot.title);
        const text = hotspot.text || '';
        
        // تحديد النوع من الـ ID
        let type = null;
        if (id.includes('EL')) type = 'EL';
        else if (id.includes('PW')) type = 'PW';
        else if (id.includes('GS')) type = 'GS';
        else if (id.includes('AC')) type = 'AC';
        
        if (!type) return;

        // تخزين النقطة
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

  // تنظيف النص من وسوم HTML
  cleanText: function(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
  },

  // تحليل الاتصالات من النص
  parseConnections: function(text) {
    if (!text) return [];
    
    const connections = [];
    // البحث عن أكواد مثل EL-SEN-01, JN-EL-7, END-EL-3
    const matches = text.match(/[A-Z]+(?:-SEN|-JN|-END)?-\d+/g);
    if (matches) {
      matches.forEach(m => connections.push(m));
    }
    
    // البحث عن IN TO, TO, FROM
    const toMatches = text.match(/(?:IN TO|TO|FROM)\s+([A-Z0-9-]+)/gi);
    if (toMatches) {
      toMatches.forEach(m => {
        const code = m.replace(/(?:IN TO|TO|FROM)\s+/i, '');
        connections.push(code);
      });
    }
    
    return [...new Set(connections)]; // إزالة التكرار
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
      
      // الحصول على نقاط هذا المشهد فقط
      const points = layer.points.filter(p => p.sceneId === sceneId);
      
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
      
      // إظهار/إخفاء حسب الحالة
      layer.svg.style.display = layer.visible ? 'block' : 'none';
    });
  },

  // رسم خط بين نقطتين
  drawLine: function(type, point1, point2) {
    const layer = this.layers[type];
    if (!layer || !layer.svg || !this.viewer) return;

    try {
      const view = this.viewer.view();
      const yaw = view.yaw();
      const pitch = view.pitch();
      const fov = view.fov();

      // تحويل الإحداثيات الزاوية إلى إحداثيات شاشة
      const x1 = (0.5 + (point1.yaw - yaw) / fov) * window.innerWidth;
      const y1 = (0.5 - (point1.pitch - pitch) / fov) * window.innerHeight;
      const x2 = (0.5 + (point2.yaw - yaw) / fov) * window.innerWidth;
      const y2 = (0.5 - (point2.pitch - pitch) / fov) * window.innerHeight;

      // التحقق من أن النقاط ضمن الشاشة
      if (this.isPointVisible(x1, y1) || this.isPointVisible(x2, y2)) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', layer.color);
        line.setAttribute('stroke-width', '3');
        line.setAttribute('stroke-dasharray', layer.dash);
        line.setAttribute('class', `${type.toLowerCase()}-path`);

        layer.svg.appendChild(line);
      }
    } catch(e) {
      // تجاهل أخطاء الرسم
    }
  },

  // رسم نقطة
  drawPoint: function(type, point) {
    const layer = this.layers[type];
    if (!layer || !layer.svg || !this.viewer) return;

    try {
      const view = this.viewer.view();
      const yaw = view.yaw();
      const pitch = view.pitch();
      const fov = view.fov();

      const x = (0.5 + (point.yaw - yaw) / fov) * window.innerWidth;
      const y = (0.5 - (point.pitch - pitch) / fov) * window.innerHeight;

      // ارسم فقط إذا كانت النقطة ضمن الشاشة
      if (this.isPointVisible(x, y)) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '8');
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
      }
    } catch(e) {
      // تجاهل أخطاء الرسم
    }
  },

  // التحقق من أن النقطة ضمن الشاشة
  isPointVisible: function(x, y) {
    return x > -50 && x < window.innerWidth + 50 && 
           y > -50 && y < window.innerHeight + 50;
  },

  // عرض معلومات النقطة
  showPointInfo: function(point) {
    const panel = document.getElementById('bim-info-panel');
    if (!panel) return;
    
    const title = document.getElementById('bim-panel-title');
    const content = document.getElementById('bim-panel-content');
    
    title.textContent = point.id;
    
    let html = '<div style="padding: 10px;">';
    html += `<p><strong>النوع:</strong> ${this.getTypeName(point.id)}</p>`;
    html += `<p><strong>الاتصالات:</strong> ${point.connections.join(' ← ')}</p>`;
    html += `<p><strong>الوصف:</strong> ${point.text || 'لا يوجد'}</p>`;
    html += '</div>';
    
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
    document.querySelectorAll(`.bim-btn[data-layer="${type}"]`).forEach(btn => {
      if (layer.visible) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    console.log(`${type} is now ${layer.visible ? 'visible' : 'hidden'}`);
  },

  // إحصائيات
  getStats: function() {
    const stats = {};
    Object.keys(this.layers).forEach(type => {
      stats[type] = this.layers[type].points.length;
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

// تعريف للعالمية
window.BIM = BIM;
