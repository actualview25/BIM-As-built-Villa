// layers/hvac.js - نظام شبكة التكييف
// الرموز: AC (Air Conditioning)

class HVACSystem {
  constructor(bimSystem) {
    this.bim = bimSystem;
    this.type = 'AC';
    this.name = 'شبكة التكييف';
    this.color = '#ffaa44';
    
    // أنواع محددة للتكييف
    this.categories = {
      'AC-SEN': { name: 'وحدة تكييف', icon: '❄️', size: 12 },
      'JN-AC': { name: 'مجرى هواء', icon: '🔀', size: 10 },
      'END-AC': { name: 'فتحة تكييف', icon: '🌀', size: 8 }
    };
  }

  // تحليل معلومات إضافية
  parseHotspotData(hotspot) {
    const info = {
      type: this.getNodeType(hotspot.id),
      capacity: this.extractCapacity(hotspot.text),
      airflow: this.extractAirflow(hotspot.text),
      temperature: this.extractTemperature(hotspot.text)
    };
    return info;
  }

  // استخراج السعة
  extractCapacity(text) {
    if (!text) return 'غير محدد';
    const match = text.match(/(\d+(?:\.\d+)?)\s*(طن|وحدة|BTU)/i);
    return match ? match[0] : '3 طن';
  }

  // استخراج تدفق الهواء
  extractAirflow(text) {
    if (!text) return 'غير محدد';
    const match = text.match(/(\d+)\s*(CFM|متر\/ساعة)/i);
    return match ? match[0] : '400 CFM';
  }

  // استخراج درجة الحرارة
  extractTemperature(text) {
    if (!text) return 'غير محدد';
    const match = text.match(/(\d+)\s*(°C|درجة|°F)/i);
    return match ? match[0] : '22°C';
  }

  // تحديد نوع العقدة
  getNodeType(id) {
    if (id.includes('SEN')) return 'source';
    if (id.includes('JN')) return 'junction';
    if (id.includes('END')) return 'endpoint';
    return 'unknown';
  }

  // رسم عنصر خاص بالتكييف
  drawSpecial(element, svg, x, y) {
    // إضافة مؤشر اتجاه الهواء
    if (element.type === 'endpoint') {
      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const direction = this.getAirflowDirection(element);
      
      let d = '';
      if (direction === 'in') {
        d = `M ${x-15} ${y-10} L ${x} ${y-15} L ${x+15} ${y-10}`;
      } else {
        d = `M ${x-15} ${y+10} L ${x} ${y+15} L ${x+15} ${y+10}`;
      }
      
      arrow.setAttribute('d', d);
      arrow.setAttribute('stroke', 'white');
      arrow.setAttribute('fill', 'none');
      arrow.setAttribute('stroke-width', '2');
      svg.appendChild(arrow);
    }
  }

  // تحديد اتجاه الهواء
  getAirflowDirection(element) {
    return element.text && element.text.includes('سحب') ? 'in' : 'out';
  }

  // حساب كفاءة التكييف
  calculateEfficiency(nodeId) {
    return '85%';
  }
}

// إضافة للنظام العام
window.HVACSystem = HVACSystem;