// layers/electrical.js - نظام شبكة الكهرباء
// الرموز: EL (Electrical)

class ElectricalSystem {
  constructor(bimSystem) {
    this.bim = bimSystem;
    this.type = 'EL';
    this.name = 'شبكة الكهرباء';
    this.color = '#44ff44';
    
    // أنواع محددة لشبكة الكهرباء
    this.categories = {
      'EL-SEN': { name: 'مصدر كهرباء', icon: '⚡', size: 12 },
      'JN-EL': { name: 'نقطة توزيع', icon: '🔌', size: 10 },
      'END-EL': { name: 'مخرج كهرباء', icon: '💡', size: 8 }
    };
    
    // بيانات إضافية
    this.voltages = {
      '220': 'جهد منخفض',
      '380': 'جهد متوسط',
      '11000': 'جهد عالي'
    };
    
    // سجل الأحمال
    this.loads = new Map();
  }

  // تحليل معلومات إضافية من الـ Hotspot
  parseHotspotData(hotspot) {
    const info = {
      type: this.getNodeType(hotspot.id),
      category: this.getCategory(hotspot.id),
      voltage: this.extractVoltage(hotspot.text),
      amperage: this.extractAmperage(hotspot.text),
      phase: this.extractPhase(hotspot.text),
      circuitBreaker: this.extractCircuitBreaker(hotspot.text),
      wireGauge: this.extractWireGauge(hotspot.text),
      load: this.calculateNodeLoad(hotspot)
    };
    return info;
  }

  // استخراج الجهد الكهربائي
  extractVoltage(text) {
    if (!text) return '220V';
    const match = text.match(/(\d+)\s*(V|فولت|kv)/i);
    if (match) {
      const voltage = match[1];
      return `${voltage}V (${this.voltages[voltage] || 'قياسي'})`;
    }
    return '220V';
  }

  // استخراج الأمبير
  extractAmperage(text) {
    if (!text) return '16A';
    const match = text.match(/(\d+)\s*(A|أمبير)/i);
    return match ? match[0] : '16A';
  }

  // استخراج نوع الفاز
  extractPhase(text) {
    if (!text) return 'أحادي';
    if (text.includes('3') || text.includes('ثلاثي')) return 'ثلاثي';
    if (text.includes('1') || text.includes('أحادي')) return 'أحادي';
    return 'أحادي';
  }

  // استخراج قاطع الكهرباء
  extractCircuitBreaker(text) {
    if (!text) return 'غير محدد';
    const match = text.match(/قاطع\s*(\d+)/i);
    return match ? `قاطع ${match[1]}` : 'قاطع عام';
  }

  // استخراج قياس السلك
  extractWireGauge(text) {
    if (!text) return '2.5 مم';
    const match = text.match(/(\d+(?:\.\d+)?)\s*(مم|mm)/i);
    return match ? match[0] : '2.5 مم';
  }

  // حساب الحمل للعقدة
  calculateNodeLoad(node) {
    if (node.type === 'source') {
      return '40A - رئيسي';
    } else if (node.type === 'junction') {
      return '20A - فرعي';
    } else if (node.type === 'endpoint') {
      // تقدير الحمل حسب النوع
      if (node.name.includes('مكيف')) return '15A';
      if (node.name.includes('مطبخ')) return '20A';
      if (node.name.includes('إضاءة')) return '6A';
      return '10A';
    }
    return 'غير محدد';
  }

  // تحديد نوع العقدة
  getNodeType(id) {
    if (id.includes('SEN')) return 'source';
    if (id.includes('JN')) return 'junction';
    if (id.includes('END')) return 'endpoint';
    return 'unknown';
  }

  // تحديد الفئة
  getCategory(id) {
    if (id.includes('EL')) {
      if (id.includes('LIGHT') || id.includes('إضاءة')) return 'إضاءة';
      if (id.includes('POWER') || id.includes('قوة')) return 'قوى محركة';
      if (id.includes('AC') || id.includes('تكييف')) return 'تكييف';
      return 'عام';
    }
    return 'غير محدد';
  }

  // رسم عنصر خاص بالكهرباء
  drawSpecial(element, svg, x, y) {
    const category = this.getCategory(element.id);
    const type = this.getNodeType(element.id);
    
    // إضافة رمز حسب النوع
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x + 15);
    text.setAttribute('y', y - 15);
    text.setAttribute('fill', 'white');
    text.setAttribute('font-size', '10');
    text.setAttribute('stroke', 'black');
    text.setAttribute('stroke-width', '0.5');
    
    if (type === 'source') {
      text.textContent = '⚡ مصدر';
    } else if (type === 'junction') {
      text.textContent = '🔌 توزيع';
    } else if (type === 'endpoint') {
      if (category === 'إضاءة') {
        text.textContent = '💡 إضاءة';
      } else if (category === 'قوى محركة') {
        text.textContent = '⚙️ قوى';
      } else {
        text.textContent = '🔌 مخرج';
      }
    }
    
    svg.appendChild(text);
    
    // إضافة مؤشر الجهد
    if (element.type === 'source' || element.type === 'junction') {
      const voltage = this.extractVoltage(element.text);
      const voltText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      voltText.setAttribute('x', x + 15);
      voltText.setAttribute('y', y + 20);
      voltText.setAttribute('fill', this.color);
      voltText.setAttribute('font-size', '8');
      voltText.textContent = voltage.split(' ')[0];
      svg.appendChild(voltText);
    }
  }

  // حساب الأحمال الكهربائية
  calculateLoad() {
    let totalLoad = 0;
    let loads = [];
    
    // تجميع كل نقاط النهاية في المشهد الحالي
    if (this.bim && this.bim.nodes) {
      this.bim.nodes.forEach(node => {
        if (node.id.includes('END-EL')) {
          const load = this.calculateNodeLoad(node);
          const value = parseInt(load) || 0;
          totalLoad += value;
          loads.push({
            node: node.id,
            load: value,
            name: node.name
          });
        }
      });
    }
    
    return {
      total: totalLoad,
      details: loads,
      recommendation: totalLoad > 40 ? 'تحتاج زيادة السعة' : 'مناسب'
    };
  }

  // البحث عن القاطع المناسب
  findCircuitBreaker(nodeId) {
    if (!this.bim || !this.bim.nodes) return null;
    
    // البحث عن العقدة
    const node = this.bim.nodes.find(n => n.id === nodeId);
    if (!node) return null;
    
    // تتبع المسار إلى المصدر
    let path = [nodeId];
    let currentNode = node;
    let maxIterations = 10;
    
    while (maxIterations-- > 0) {
      // افتراض أن أول اتصال هو الطريق للمصدر
      if (currentNode.connections && currentNode.connections.length > 0) {
        const nextId = currentNode.connections[0];
        path.push(nextId);
        currentNode = this.bim.nodes.find(n => n.id === nextId);
        if (!currentNode) break;
        
        // إذا وصلنا للمصدر
        if (currentNode.id.includes('SEN')) {
          return {
            path: path,
            source: currentNode.id,
            breaker: this.extractCircuitBreaker(currentNode.text)
          };
        }
      } else {
        break;
      }
    }
    
    return null;
  }

  // رسم دائرة كاملة
  drawCircuit(startNode) {
    // يمكن إضافة رسم خاص للدوائر الكهربائية
    console.log('رسم دائرة كهربائية من:', startNode);
  }

  // فحص الدائرة
  inspectCircuit(nodeId) {
    const breaker = this.findCircuitBreaker(nodeId);
    const node = this.bim.nodes.find(n => n.id === nodeId);
    
    return {
      node: nodeId,
      name: node ? node.name : 'غير معروف',
      breaker: breaker,
      load: this.calculateNodeLoad(node),
      voltage: this.extractVoltage(node ? node.text : ''),
      safe: true // يمكن إضافة منطق للفحص
    };
  }

  // الحصول على إحصائيات الشبكة
  getStatistics() {
    let stats = {
      sources: 0,
      junctions: 0,
      endpoints: 0,
      totalLoad: 0,
      circuits: []
    };
    
    if (this.bim && this.bim.nodes) {
      this.bim.nodes.forEach(node => {
        if (node.id.includes('EL')) {
          if (node.id.includes('SEN')) stats.sources++;
          else if (node.id.includes('JN')) stats.junctions++;
          else if (node.id.includes('END')) {
            stats.endpoints++;
            stats.totalLoad += parseInt(this.calculateNodeLoad(node)) || 0;
          }
        }
      });
    }
    
    return stats;
  }
}

// إضافة للـ BIM System
window.ElectricalSystem = ElectricalSystem;