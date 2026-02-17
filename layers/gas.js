// layers/gas.js - نظام شبكة الغاز
// الرموز: GS (Gas System)

class GasSystem {
  constructor(bimSystem) {
    this.bim = bimSystem;
    this.type = 'GS';
    this.name = 'شبكة الغاز';
    this.color = '#ff4444';
    
    // أنواع محددة للغاز - أكثر حساسية
    this.categories = {
      'GS-SEN': { name: 'مصدر غاز', icon: '🔥', size: 14 }, // أكبر حجماً للتحذير
      'JN-GS': { name: 'نقطة توزيع', icon: '🔀', size: 12 },
      'END-GS': { name: 'نقطة استخدام', icon: '🔥', size: 10 }
    };
    
    // تحذيرات الأمان
    this.safetyAlerts = [];
  }

  // تحليل معلومات إضافية مع تركيز على الأمان
  parseHotspotData(hotspot) {
    const info = {
      type: this.getNodeType(hotspot.id),
      pressure: this.extractPressure(hotspot.text),
      pipeType: this.extractPipeType(hotspot.text),
      safetyValve: this.hasSafetyValve(hotspot.text),
      lastInspection: this.extractInspectionDate(hotspot.text)
    };
    
    // فحص الأمان
    this.checkSafety(hotspot, info);
    
    return info;
  }

  // استخراج الضغط (مهم للغاز)
  extractPressure(text) {
    if (!text) return 'منخفض';
    const match = text.match(/(\d+(?:\.\d+)?)\s*(bar|mbar|psi)/i);
    return match ? match[0] : 'منخفض';
  }

  // استخراج نوع الأنبوب
  extractPipeType(text) {
    if (!text) return 'غير محدد';
    if (text.includes('نحاس')) return 'نحاس';
    if (text.includes('بولي')) return 'بولي إيثيلين';
    if (text.includes('حديد')) return 'حديد';
    return 'قياسي';
  }

  // هل يوجد صمام أمان؟
  hasSafetyValve(text) {
    if (!text) return false;
    return text.includes('صمام') || text.includes('valve');
  }

  // استخراج تاريخ الفحص الأخير
  extractInspectionDate(text) {
    if (!text) return 'غير معروف';
    const match = text.match(/\d{2}\/\d{2}\/\d{4}/);
    return match ? match[0] : 'غير معروف';
  }

  // فحص الأمان
  checkSafety(hotspot, info) {
    const alerts = [];
    
    // تحذيرات حسب الموقع
    if (hotspot.text && hotspot.text.includes('تسريب')) {
      alerts.push('⚠️ تحذير: تسريب غاز محتمل!');
    }
    
    if (info.lastInspection === 'غير معروف') {
      alerts.push('⚠️ لم يتم فحص هذا الخط');
    }
    
    if (info.pressure === 'مرتفع' && hotspot.type === 'endpoint') {
      alerts.push('⚠️ ضغط مرتفع عند نقطة الاستخدام');
    }
    
    this.safetyAlerts = alerts;
  }

  // تحديد نوع العقدة
  getNodeType(id) {
    if (id.includes('SEN')) return 'source';
    if (id.includes('JN')) return 'junction';
    if (id.includes('END')) return 'endpoint';
    return 'unknown';
  }

  // رسم عنصر خاص بالغاز (مع تحذيرات)
  drawSpecial(element, svg, x, y) {
    // إشارة تحذير للغاز
    if (element.type === 'junction' || element.type === 'endpoint') {
      const warning = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      warning.setAttribute('x', x + 20);
      warning.setAttribute('y', y - 15);
      warning.setAttribute('fill', '#ff4444');
      warning.setAttribute('font-size', '16');
      warning.setAttribute('font-weight', 'bold');
      warning.textContent = '⚠️';
      svg.appendChild(warning);
    }
    
    // إضافة علامة الضغط
    const info = this.parseHotspotData(element);
    if (info.pressure === 'مرتفع') {
      const pressureMark = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pressureMark.setAttribute('cx', x);
      pressureMark.setAttribute('cy', y);
      pressureMark.setAttribute('r', '14');
      pressureMark.setAttribute('stroke', '#ff4444');
      pressureMark.setAttribute('stroke-width', '3');
      pressureMark.setAttribute('fill', 'none');
      pressureMark.setAttribute('stroke-dasharray', '4,4');
      svg.appendChild(pressureMark);
    }
  }

  // الحصول على تحذيرات الأمان
  getSafetyAlerts() {
    return this.safetyAlerts;
  }

  // فحص شامل للشبكة
  performSafetyCheck() {
    // يمكن إضافة فحص آلي للشبكة
    return {
      status: 'آمن',
      alerts: this.safetyAlerts,
      recommendations: [
        'فحص دوري كل 6 أشهر',
        'تركيب كاشف غاز',
        'صيانة الصمامات'
      ]
    };
  }
}

// إضافة للنظام العام
window.GasSystem = GasSystem;