// js/bim-system.js - نظام BIM الموحد مع خطوط ثابتة

const BIM = {
  viewer: null,
  currentScene: null,
  scenes: [],
  layers: {
    EL: { visible: true, color: '#44ff44', dash: '8,8', name: 'كهرباء', icon: '⚡', points: [], lines: [] },
    PW: { visible: true, color: '#4444ff', dash: 'none', name: 'مياه', icon: '💧', points: [], lines: [] },
    GS: { visible: true, color: '#ff4444', dash: '4,4', name: 'غاز', icon: '🔥', points: [], lines: [] },
    AC: { visible: true, color: '#ffaa44', dash: '12,6', name: 'تكييف', icon: '❄️', points: [], lines: [] }
  },

  // تهيئة النظام
  init: function(viewer, scenesList) {
    console.log('🚀 BIM initializing...');
    this.viewer = viewer;
    this.scenes = scenesList;
    this.createSVGLayers();
    
    // تأخير تحميل البيانات للتأكد من وجود المشاهد
    setTimeout(() => {
      this.loadHotspotsFromData();
      console.log('✅ BIM System initialized');
    }, 500);
    
    return this;
  },

  // إنشاء طبقات SVG
  createSVGLayers: function() {
    const overlay = document.getElementById('bim-overlay');
    if (!overlay) {
      console.warn('⚠️ bim-overlay not found');
      return;
    }
    
    Object.keys(this.layers).forEach(key => {
      const svg = document.getElementById(`layer-${key}`);
      if (svg) {
        this.layers[key].svg = svg;
        svg.innerHTML = ''; // مسح المحتوى القديم
        console.log(`✅ Layer ${key} ready`);
      } else {
        console.warn(`⚠️ Layer ${key} SVG not found`);
      }
    });
  },

  // تحميل البيانات من Hotspots في data.js
  loadHotspotsFromData: function() {
    if (!this.scenes || !this.scenes.length) {
      console.warn('⚠️ No scenes available');
      return;
    }

    let totalHotspots = 0;
    console.log('📊 Loading hotspots from scenes...');

    this.scenes.forEach(scene => {
      const hotspots = scene.data.infoHotspots || [];
      console.log(`Scene ${scene.data.id}: ${hotspots.length} hotspots`);
      
      const scenePoints = [];
      
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
        const point = {
          id: id,
          sceneId: scene.data.id,
          yaw: hotspot.yaw,
          pitch: hotspot.pitch,
          text: text,
          connections: this.parseConnections(text)
        };
        
        this.layers[type].points.push(point);
        scenePoints.push(point);
        totalHotspots++;
      });
      
      // بعد جمع كل النقاط للمشهد، نقوم ببناء الخطوط الثابتة
      this.buildFixedLines(scene.data.id, scenePoints);
    });

    console.log(`✅ Loaded ${totalHotspots} hotspots:`, this.getStats());
    
    // إذا كان هناك مشهد حالي، نرسمه
    if (this.currentScene) {
      this.drawCurrentScene();
    }
  },

  // بناء خطوط ثابتة للمشهد
  buildFixedLines: function(sceneId, points) {
    Object.keys(this.layers).forEach(type => {
      const layer = this.layers[type];
      const typePoints = points.filter(p => p.id.includes(type));
      
      typePoints.forEach(point => {
        point.connections.forEach(connId => {
          const target = typePoints.find(p => p.id === connId);
          if (target) {
            // تخزين الخط الثابت
            layer.lines.push({
              sceneId: sceneId,
              from: { yaw: point.yaw, pitch: point.pitch },
              to: { yaw: target.yaw, pitch: target.pitch },
              id: `${point.id}-to-${connId}`
            });
          }
        });
      });
    });
  },

  // تنظيف النص من وسوم HTML
  cleanText: function(html) {
    if (!html) return '';
    // إزالة وسوم HTML والمسافات الزائدة
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  },

  // تحليل الاتصالات من النص
  parseConnections: function(text) {
    if (!text) return [];
    
    const connections = [];
    
    // البحث عن أكواد مثل EL-SEN-01, JN-EL-7, END-EL-3
    const codeMatches = text.match(/[A-Z]+(?:-[A-Z]+)?-\d+/g);
    if (codeMatches) {
      codeMatches.forEach(m => connections.push(m));
    }
    
    // البحث عن IN TO, TO, FROM
    const toMatches = text.match(/(?:IN TO|TO|FROM)\s+([A-Z0-9-]+)/gi);
    if (toMatches) {
      toMatches.forEach(m => {
        const code = m.replace(/(?:IN TO|TO|FROM)\s+/i, '').trim();
        if (code && !connections.includes(code)) {
          connections.push(code);
        }
      });
    }
    
    return [...new Set(connections)];
  },

  // رسم شبكة المشهد الحالي
  drawCurrentScene: function() {
    if (!this.currentScene || !this.viewer) {
      console.warn('⚠️ Cannot draw: no current scene or viewer');
      return;
    }

    const sceneId = this.currentScene.data.id;
    console.log(`🎨 Drawing scene: ${sceneId}`);
    
    let totalPoints = 0;
    let totalLines = 0;
    
    Object.keys(this.layers).forEach(type => {
      const layer = this.layers[type];
      if (!layer.svg) return;
      
      // مسح القديم
      layer.svg.innerHTML = '';
      
      // رسم الخطوط الثابتة أولاً
      const sceneLines = layer.lines.filter(line => line.sceneId === sceneId);
      sceneLines.forEach(line => {
        this.drawFixedLine(type, line);
      });
      totalLines += sceneLines.length;

      // ثم رسم النقاط
      const points = layer.points.filter(p => p.sceneId === sceneId);
      points.forEach(point => {
        this.drawFixedPoint(type, point);
      });
      totalPoints += points.length;
      
      // إظهار/إخفاء حسب الحالة
      layer.svg.style.display = layer.visible ? 'block' : 'none';
    });
    
    console.log(`📊 Drew ${totalPoints} points and ${totalLines} lines`);
  },

  // رسم خط ثابت
  drawFixedLine: function(type, line) {
    const layer = this.layers[type];
    if (!layer || !layer.svg) return;

    try {
      const scale = 1000;
      const offsetX = 500;
      const offsetY = 300;
      
      const x1 = offsetX + (line.from.yaw * scale);
      const y1 = offsetY + (line.from.pitch * scale);
      const x2 = offsetX + (line.to.yaw * scale);
      const y2 = offsetY + (line.to.pitch * scale);

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const d = `M ${x1} ${y1} L ${x2} ${y2}`;
      
      path.setAttribute('d', d);
      path.setAttribute('stroke', layer.color);
      path.setAttribute('stroke-width', '4');
      path.setAttribute('stroke-dasharray', layer.dash);
      path.setAttribute('fill', 'none');
      path.setAttribute('class', `fixed-line ${type}-line`);
      path.setAttribute('data-line', line.id);

      layer.svg.appendChild(path);
    } catch(e) {
      console.warn('Error drawing fixed line:', e);
    }
  },

  // رسم نقطة ثابتة
  drawFixedPoint: function(type, point) {
    const layer = this.layers[type];
    if (!layer || !layer.svg) return;

    try {
      const scale = 1000;
      const offsetX = 500;
      const offsetY = 300;
      
      const x = offsetX + (point.yaw * scale);
      const y = offsetY + (point.pitch * scale);

      // دائرة النقطة
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', '12');
      circle.setAttribute('fill', layer.color);
      circle.setAttribute('stroke', 'white');
      circle.setAttribute('stroke-width', '3');
      circle.setAttribute('data-id', point.id);
      circle.setAttribute('class', 'fixed-point');
      circle.setAttribute('data-type', this.getNodeType(point.id));
      circle.style.cursor = 'pointer';
      circle.style.pointerEvents = 'auto';
      
      circle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showPointInfo(point);
      });

      layer.svg.appendChild(circle);

      // إضافة نص التسمية
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x + 15);
      text.setAttribute('y', y - 10);
      text.setAttribute('fill', 'white');
      text.setAttribute('font-size', '12');
      text.setAttribute('stroke', 'black');
      text.setAttribute('stroke-width', '0.5');
      text.textContent = point.id;
      
      layer.svg.appendChild(text);

    } catch(e) {
      console.warn('Error drawing fixed point:', e);
    }
  },

  // تحديد نوع العقدة
  getNodeType: function(id) {
    if (id.includes('SEN')) return 'source';
    if (id.includes('JN')) return 'junction';
    if (id.includes('END')) return 'endpoint';
    return 'unknown';
  },

  // عرض معلومات النقطة
  showPointInfo: function(point) {
    const panel = document.getElementById('bim-info-panel');
    if (!panel) return;
    
    const title = document.getElementById('bim-panel-title');
    const content = document.getElementById('bim-panel-content');
    
    title.textContent = point.id;
    
    let html = '<div style="padding: 10px; direction: rtl;">';
    html += `<p><strong>🔹 النوع:</strong> ${this.getTypeName(point.id)}</p>`;
    html += `<p><strong>🔹 المشهد:</strong> ${point.sceneId}</p>`;
    html += `<p><strong>🔹 الإحداثيات:</strong> yaw: ${point.yaw.toFixed(2)}, pitch: ${point.pitch.toFixed(2)}</p>`;
    html += `<p><strong>🔹 الاتصالات:</strong> ${point.connections.join(' ← ') || 'لا توجد'}</p>`;
    html += `<p><strong>🔹 الوصف:</strong> ${point.text || 'لا يوجد'}</p>`;
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

  // دالة اختبار
  testDraw: function() {
    console.log('🧪 Testing draw with sample points');
    
    if (!this.currentScene) {
      console.warn('⚠️ No current scene, cannot test draw');
      return;
    }
    
    const testPoints = [
      { id: 'EL-SEN-TEST', yaw: 0, pitch: 0, sceneId: this.currentScene.data.id, connections: [], text: 'نقطة اختبار' },
      { id: 'END-EL-TEST', yaw: 0.5, pitch: 0.2, sceneId: this.currentScene.data.id, connections: ['EL-SEN-TEST'], text: 'نقطة نهاية اختبار' }
    ];
    
    Object.keys(this.layers).forEach(type => {
      this.layers[type].points = testPoints.map(p => ({
        ...p,
        id: p.id.replace('EL', type)
      }));
      
      this.layers[type].lines = [{
        sceneId: this.currentScene.data.id,
        from: { yaw: 0, pitch: 0 },
        to: { yaw: 0.5, pitch: 0.2 },
        id: 'test-line'
      }];
    });
    
    this.drawCurrentScene();
    console.log('✅ Test draw completed');
  },

  // دالة احتياطية
  loadScene: function(sceneId) {
    console.log('⚠️ loadScene called - using drawCurrentScene instead');
    if (this.currentScene) {
      this.drawCurrentScene();
    }
  },

  // إظهار/إخفاء طبقة
  toggleLayer: function(type) {
    const layer = this.layers[type];
    if (!layer) return;
    
    layer.visible = !layer.visible;
    if (layer.svg) layer.svg.style.display = layer.visible ? 'block' : 'none';
    
    document.querySelectorAll(`.bim-btn[data-layer="${type}"]`).forEach(btn => {
      btn.classList.toggle('active', layer.visible);
    });
    
    console.log(`${type} is now ${layer.visible ? 'visible' : 'hidden'}`);
  },

  // إحصائيات
  getStats: function() {
    const stats = {};
    Object.keys(this.layers).forEach(type => {
      stats[type] = {
        points: this.layers[type].points.length,
        lines: this.layers[type].lines.length
      };
    });
    return stats;
  },

  // تحديث الرسم
  update: function() {},

  showAllLayers: function() {
    Object.keys(this.layers).forEach(type => {
      this.layers[type].visible = true;
      if (this.layers[type].svg) this.layers[type].svg.style.display = 'block';
      document.querySelectorAll(`.bim-btn[data-layer="${type}"]`).forEach(btn => btn.classList.add('active'));
    });
    this.drawCurrentScene();
  },

  hideAllLayers: function() {
    Object.keys(this.layers).forEach(type => {
      this.layers[type].visible = false;
      if (this.layers[type].svg) this.layers[type].svg.style.display = 'none';
      document.querySelectorAll(`.bim-btn[data-layer="${type}"]`).forEach(btn => btn.classList.remove('active'));
    });
  },

  reloadData: function() {
    console.log('🔄 Reloading hotspot data...');
    Object.keys(this.layers).forEach(type => {
      this.layers[type].points = [];
      this.layers[type].lines = [];
    });
    this.loadHotspotsFromData();
    this.drawCurrentScene();
  }
};

window.BIM = BIM;
console.log('📦 BIM System loaded and ready');
