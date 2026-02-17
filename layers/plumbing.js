// layers/plumbing.js - نظام شبكة المياه
// الرموز: PW (Plumbing Water)

class PlumbingSystem {
  constructor(bimSystem) {
    this.bim = bimSystem;
    this.type = 'PW';
    this.name = 'شبكة المياه';
    this.color = '#4444ff';
    
    // أنواع محددة لشبكة المياه
    this.categories = {
      'PW-SEN': { name: 'مصدر مياه', icon: '💧', size: 12 },
      'JN-PW': { name: 'نقطة توزيع', icon: '🔀', size: 10 },
      'END-PW': { name: 'نقطة نهاية', icon: '🚰', size: 8 }
    };
  }

  // تحليل معلومات إضافية من الـ Hotspot
  parseHotspotData(hotspot) {
    const info = {
      type: this.getNodeType(hotspot.id),
      category: this.getCategory(hotspot.id),
      diameter: this.extractDiameter(hotspot.text),
      material: this.extractMaterial(hotspot.text),
      pressure: this.extractPressure(hotspot.text)
    };
    return info;
  }

  // استخراج القطر من النص
  extractDiameter(text) {
    if (!text) return 'غير محدد';
    const match = text.match(/(\d+)(?:\s*)(بوصة|سم|mm)/i);
    return match ? match[0] : '2 بوصة';
  }

  // استخراج نوع المادة
  extractMaterial(text) {
    if (!text) return 'غير محدد';
    if (text.includes('PVC')) return 'PVC';
    if (text.includes('نحاس')) return 'نحاس';
    if (text.includes('بلاستيك')) return 'بلاستيك';
    return 'بلاستيك';
  }

  // استخراج الضغط
  extractPressure(text) {
    if (!text) return 'قياسي';
    const match = text.match(/(\d+(?:\.\d+)?)\s*(bar|psi|بار)/i);
    return match ? match[0] : '3 بار';
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
    if (id.includes('PW')) {
      if (id.includes('HOT') || id.includes('ساخن')) return 'مياه ساخنة';
      if (id.includes('COLD') || id.includes('بارد')) return 'مياه باردة';
      return 'مياه عذبة';
    }
    return 'غير محدد';
  }

  // رسم عنصر خاص بالمياه
  drawSpecial(element, svg, x, y) {
    const category = this.getCategory(element.id);
    
    // إضافة رمز خاص حسب النوع
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x + 15);
    text.setAttribute('y', y - 10);
    text.setAttribute('fill', 'white');
    text.setAttribute('font-size', '12');
    text.setAttribute('stroke', 'black');
    text.setAttribute('stroke-width', '0.5');
    
    if (category === 'مياه ساخنة') {
      text.textContent = '🔥 ساخن';
    } else if (category === 'مياه باردة') {
      text.textContent = '❄️ بارد';
    }
    
    svg.appendChild(text);
  }

  // حساب تدفق المياه
  calculateFlow(nodeId) {
    // يمكن إضافة منطق لحساب التدفق
    return '3 لتر/دقيقة';
  }
}

// إضافة للنظام العام
window.PlumbingSystem = PlumbingSystem;