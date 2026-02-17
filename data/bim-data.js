// data/bim-data.js - بيانات شبكات BIM المتكاملة
// نظام الترميز:
// EL: كهرباء | PW: مياه عذبة | GS: غاز | AC: تكييف
// SEN: مصدر | JN: نقطة توزيع | END: نقطة نهاية

const BIM_DATA = {
  // تعريف الأنظمة والألوان
  types: {
    'EL': { 
      name: 'كهرباء', 
      color: '#44ff44', 
      dash: '8,8',
      icon: '⚡'
    },
    'PW': { 
      name: 'مياه عذبة', 
      color: '#4444ff', 
      dash: 'none',
      icon: '💧'
    },
    'GS': { 
      name: 'غاز', 
      color: '#ff4444', 
      dash: '4,4',
      icon: '🔥'
    },
    'AC': { 
      name: 'تكييف', 
      color: '#ffaa44', 
      dash: '12,6',
      icon: '❄️'
    }
  },

  // الشبكات حسب المشهد
  networks: {
    // ========== المشهد 0: StartPoint ==========
    '0-startpoint': {
      name: 'نقطة البداية',
      nodes: [
        // ------------------ الكهرباء ------------------
        { 
          id: 'EL-SEN-01', 
          type: 'source', 
          name: '⚡ لوحة الكهرباء الرئيسية',
          yaw: 0.25, 
          pitch: 0.10,
          text: 'مصدر رئيسي 220V - قاطع 100A - ثلاثي الفاز',
          connections: ['JN-EL-01', 'JN-EL-02', 'JN-EL-03']
        },
        { 
          id: 'JN-EL-01', 
          type: 'junction', 
          name: '🔌 نقطة توزيع المدخل',
          yaw: 0.45, 
          pitch: 0.05,
          text: 'قاطع 40A - سلك 6 مم - يغذي إضاءة المدخل',
          connections: ['EL-SEN-01', 'END-EL-01', 'END-EL-02']
        },
        { 
          id: 'JN-EL-02', 
          type: 'junction', 
          name: '🔌 نقطة توزيع الممر',
          yaw: 0.65, 
          pitch: 0.08,
          text: 'قاطع 32A - سلك 4 مم - يغذي مخارج الممر',
          connections: ['EL-SEN-01', 'END-EL-03']
        },
        { 
          id: 'JN-EL-03', 
          type: 'junction', 
          name: '🔌 نقطة توزيع الغرفة',
          yaw: 0.85, 
          pitch: 0.12,
          text: 'قاطع 20A - سلك 2.5 مم - يغذي الغرفة',
          connections: ['EL-SEN-01', 'END-EL-04']
        },
        { 
          id: 'END-EL-01', 
          type: 'endpoint', 
          name: '💡 إضاءة المدخل',
          yaw: 0.35, 
          pitch: 0.20,
          text: 'لمبة LED - 20 واط - جهد 220V',
          connections: ['JN-EL-01']
        },
        { 
          id: 'END-EL-02', 
          type: 'endpoint', 
          name: '🔌 مخرج كهرباء المدخل',
          yaw: 0.55, 
          pitch: 0.15,
          text: 'مخرج 16A - أرضي - للكنسة',
          connections: ['JN-EL-01']
        },
        { 
          id: 'END-EL-03', 
          type: 'endpoint', 
          name: '🔌 مخرج الممر',
          yaw: 0.75, 
          pitch: 0.10,
          text: 'مخرج 16A - للشاحن',
          connections: ['JN-EL-02']
        },
        { 
          id: 'END-EL-04', 
          type: 'endpoint', 
          name: '🔌 مخرج الغرفة',
          yaw: 0.95, 
          pitch: 0.18,
          text: 'مخرج 16A - للمكيف',
          connections: ['JN-EL-03']
        },

        // ------------------ المياه ------------------
        { 
          id: 'PW-SEN-01', 
          type: 'source', 
          name: '💧 خزان المياه الرئيسي',
          yaw: -0.15, 
          pitch: 0.05,
          text: 'خزان أرضي - سعة 5000 لتر - مضخة 1.5 حصان',
          connections: ['JN-PW-01', 'JN-PW-02']
        },
        { 
          id: 'JN-PW-01', 
          type: 'junction', 
          name: '🔀 نقطة توزيع المياه الباردة',
          yaw: -0.35, 
          pitch: 0.08,
          text: 'أنبوب PVC قطر 2 بوصة - ضغط 3 بار',
          connections: ['PW-SEN-01', 'END-PW-01', 'END-PW-02']
        },
        { 
          id: 'JN-PW-02', 
          type: 'junction', 
          name: '🔀 نقطة توزيع المياه الساخنة',
          yaw: -0.55, 
          pitch: 0.12,
          text: 'أنبوب نحاس قطر 1 بوصة - معزول - يغذي سخان',
          connections: ['PW-SEN-01', 'END-PW-03']
        },
        { 
          id: 'END-PW-01', 
          type: 'endpoint', 
          name: '🚰 حنفية المطبخ',
          yaw: -0.25, 
          pitch: 0.25,
          text: 'حنفية خلاط - مياه باردة وساخنة',
          connections: ['JN-PW-01', 'JN-PW-02']
        },
        { 
          id: 'END-PW-02', 
          type: 'endpoint', 
          name: '🚽 سيفون الحمام',
          yaw: -0.45, 
          pitch: 0.20,
          text: 'مياه باردة فقط - 1/2 بوصة',
          connections: ['JN-PW-01']
        },
        { 
          id: 'END-PW-03', 
          type: 'endpoint', 
          name: '🔥 سخان المياه',
          yaw: -0.65, 
          pitch: 0.22,
          text: 'سخان 80 لتر - كهرباء + مياه',
          connections: ['JN-PW-02', 'EL-SEN-01']
        },

        // ------------------ الغاز ------------------
        { 
          id: 'GS-SEN-01', 
          type: 'source', 
          name: '🔥 مصدر الغاز الرئيسي',
          yaw: 1.25, 
          pitch: 0.15,
          text: 'أسطوانات غاز - منظم 40mbar - صمام أمان',
          connections: ['JN-GS-01']
        },
        { 
          id: 'JN-GS-01', 
          type: 'junction', 
          name: '🔀 نقطة توزيع الغاز',
          yaw: 1.45, 
          pitch: 0.10,
          text: 'أنبوب نحاس قطر 1/2 بوصة - فحص 12/2024',
          connections: ['GS-SEN-01', 'END-GS-01']
        },
        { 
          id: 'END-GS-01', 
          type: 'endpoint', 
          name: '🔥 موقد الغاز',
          yaw: 1.65, 
          pitch: 0.20,
          text: 'موقد 4 عيون - صمام أمان - فحص سنوي',
          connections: ['JN-GS-01']
        },

        // ------------------ التكييف ------------------
        { 
          id: 'AC-SEN-01', 
          type: 'source', 
          name: '❄️ وحدة التكييف الخارجية',
          yaw: -1.25, 
          pitch: -0.10,
          text: 'مكيف مركزي 5 طن - تبريد فقط',
          connections: ['JN-AC-01', 'JN-AC-02']
        },
        { 
          id: 'JN-AC-01', 
          type: 'junction', 
          name: '🔀 مجرى هواء رئيسي',
          yaw: -1.05, 
          pitch: 0.05,
          text: 'مجرى 60x60 سم - معزول - تدفق 1200 CFM',
          connections: ['AC-SEN-01', 'END-AC-01']
        },
        { 
          id: 'JN-AC-02', 
          type: 'junction', 
          name: '🔀 مجرى هواء فرعي',
          yaw: -1.45, 
          pitch: 0.08,
          text: 'مجرى 40x40 سم - للغرف',
          connections: ['AC-SEN-01', 'END-AC-02']
        },
        { 
          id: 'END-AC-01', 
          type: 'endpoint', 
          name: '🌀 فتحة تكييف المدخل',
          yaw: -0.95, 
          pitch: 0.15,
          text: 'فتحة 60x60 - تدفق هواء بارد',
          connections: ['JN-AC-01']
        },
        { 
          id: 'END-AC-02', 
          type: 'endpoint', 
          name: '🌀 فتحة تكييف الغرفة',
          yaw: -1.55, 
          pitch: 0.20,
          text: 'فتحة 40x40 - تحكم منفصل',
          connections: ['JN-AC-02']
        }
      ]
    },

    // ========== المشهد 1: CouartYard ==========
    '1-couartyard': {
      name: 'الفناء الخارجي',
      nodes: [
        // الكهرباء
        { 
          id: 'EL-SEN-02', 
          type: 'source', 
          name: '⚡ لوحة الكهرباء الخارجية',
          yaw: 2.85, 
          pitch: 0.20,
          text: 'قاطع 60A - مقاوم للماء',
          connections: ['JN-EL-04', 'JN-EL-05']
        },
        { 
          id: 'JN-EL-04', 
          type: 'junction', 
          name: '🔌 توزيع إضاءة الفناء',
          yaw: 2.65, 
          pitch: 0.15,
          text: 'قاطع 20A - كابل 2.5 مم',
          connections: ['EL-SEN-02', 'END-EL-05', 'END-EL-06']
        },
        { 
          id: 'JN-EL-05', 
          type: 'junction', 
          name: '🔌 توزيع مضخة المسبح',
          yaw: 3.05, 
          pitch: 0.10,
          text: 'قاطع 32A - كابل 6 مم',
          connections: ['EL-SEN-02', 'END-EL-07']
        },
        { 
          id: 'END-EL-05', 
          type: 'endpoint', 
          name: '💡 إنارة الفناء',
          yaw: 2.55, 
          pitch: 0.25,
          text: 'لمبة LED خارجية 30 واط',
          connections: ['JN-EL-04']
        },
        { 
          id: 'END-EL-06', 
          type: 'endpoint', 
          name: '🔌 مخرج خارجي',
          yaw: 2.75, 
          pitch: 0.30,
          text: 'مخرج 16A - مع غطاء حماية',
          connections: ['JN-EL-04']
        },
        { 
          id: 'END-EL-07', 
          type: 'endpoint', 
          name: '⚙️ مضخة المسبح',
          yaw: 3.15, 
          pitch: 0.05,
          text: 'مضخة 2 حصان - 380V',
          connections: ['JN-EL-05']
        },

        // المياه
        { 
          id: 'PW-SEN-02', 
          type: 'source', 
          name: '💧 مصدر مياه المسبح',
          yaw: -2.85, 
          pitch: 0.10,
          text: 'خزان المسبح - مضخة 2 حصان',
          connections: ['JN-PW-03']
        },
        { 
          id: 'JN-PW-03', 
          type: 'junction', 
          name: '🔀 توزيع المسبح',
          yaw: -2.65, 
          pitch: 0.15,
          text: 'أنبوب 3 بوصة - PVC',
          connections: ['PW-SEN-02', 'END-PW-04']
        },
        { 
          id: 'END-PW-04', 
          type: 'endpoint', 
          name: '🚰 حنفية خارجية',
          yaw: -2.45, 
          pitch: 0.20,
          text: 'حنفية حديقة - خارجية',
          connections: ['JN-PW-03']
        }
      ]
    },

    // ========== المشهد 2: GroundHall ==========
    '2-groundhall': {
      name: 'الصالة الأرضية',
      nodes: [
        // الكهرباء
        { 
          id: 'EL-SEN-03', 
          type: 'source', 
          name: '⚡ لوحة الصالة',
          yaw: 1.55, 
          pitch: 0.10,
          text: 'قاطع 80A - رئيسي',
          connections: ['JN-EL-06', 'JN-EL-07']
        },
        { 
          id: 'JN-EL-06', 
          type: 'junction', 
          name: '🔌 توزيع إضاءة الصالة',
          yaw: 1.75, 
          pitch: 0.05,
          text: 'قاطع 32A - إضاءة',
          connections: ['EL-SEN-03', 'END-EL-08', 'END-EL-09']
        },
        { 
          id: 'JN-EL-07', 
          type: 'junction', 
          name: '🔌 توزيع مخارج الصالة',
          yaw: 1.35, 
          pitch: 0.08,
          text: 'قاطع 40A - مخارج',
          connections: ['EL-SEN-03', 'END-EL-10']
        },
        { 
          id: 'END-EL-08', 
          type: 'endpoint', 
          name: '💡 ثريا الصالة',
          yaw: 1.85, 
          pitch: 0.25,
          text: 'ثريا كريستال - 100 واط',
          connections: ['JN-EL-06']
        },
        { 
          id: 'END-EL-09', 
          type: 'endpoint', 
          name: '💡 إضاءة جانبية',
          yaw: 1.65, 
          pitch: 0.30,
          text: 'أباجورة 40 واط',
          connections: ['JN-EL-06']
        },
        { 
          id: 'END-EL-10', 
          type: 'endpoint', 
          name: '🔌 مخارج الصالة',
          yaw: 1.25, 
          pitch: 0.20,
          text: 'مخرجين 16A',
          connections: ['JN-EL-07']
        }
      ]
    },

    // ========== المشهد 3: GroundKichin ==========
    '3-groundkichin': {
      name: 'المطبخ',
      nodes: [
        // الكهرباء
        { 
          id: 'EL-SEN-04', 
          type: 'source', 
          name: '⚡ لوحة المطبخ',
          yaw: -2.15, 
          pitch: 0.15,
          text: 'قاطع 100A - خاص بالمطبخ',
          connections: ['JN-EL-08', 'JN-EL-09']
        },
        { 
          id: 'JN-EL-08', 
          type: 'junction', 
          name: '🔌 توزيع الأجهزة',
          yaw: -2.35, 
          pitch: 0.10,
          text: 'قاطع 50A - للأجهزة الكبيرة',
          connections: ['EL-SEN-04', 'END-EL-11', 'END-EL-12']
        },
        { 
          id: 'JN-EL-09', 
          type: 'junction', 
          name: '🔌 توزيع الإضاءة',
          yaw: -1.95, 
          pitch: 0.12,
          text: 'قاطع 20A - إضاءة المطبخ',
          connections: ['EL-SEN-04', 'END-EL-13']
        },
        { 
          id: 'END-EL-11', 
          type: 'endpoint', 
          name: '⚙️ ثلاجة',
          yaw: -2.45, 
          pitch: 0.20,
          text: 'مخرج 16A - خاص بالثلاجة',
          connections: ['JN-EL-08']
        },
        { 
          id: 'END-EL-12', 
          type: 'endpoint', 
          name: '🔥 فرن كهربائي',
          yaw: -2.25, 
          pitch: 0.25,
          text: 'مخرج 32A - 380V',
          connections: ['JN-EL-08']
        },
        { 
          id: 'END-EL-13', 
          type: 'endpoint', 
          name: '💡 إضاءة المطبخ',
          yaw: -1.85, 
          pitch: 0.30,
          text: 'سبوت لايت 10 واط × 6',
          connections: ['JN-EL-09']
        },

        // المياه والغاز
        { 
          id: 'PW-SEN-03', 
          type: 'source', 
          name: '💧 مدخل المطبخ',
          yaw: 2.45, 
          pitch: 0.05,
          text: 'ماسورة رئيسية 1 بوصة',
          connections: ['JN-PW-04']
        },
        { 
          id: 'JN-PW-04', 
          type: 'junction', 
          name: '🔀 توزيع المطبخ',
          yaw: 2.25, 
          pitch: 0.10,
          text: 'توزيع بارد وساخن',
          connections: ['PW-SEN-03', 'END-PW-05', 'END-PW-06']
        },
        { 
          id: 'END-PW-05', 
          type: 'endpoint', 
          name: '🚰 حنفية المطبخ',
          yaw: 2.05, 
          pitch: 0.20,
          text: 'حنفية خلاط',
          connections: ['JN-PW-04']
        },
        { 
          id: 'END-PW-06', 
          type: 'endpoint', 
          name: '🧼 غسالة صحون',
          yaw: 2.35, 
          pitch: 0.25,
          text: 'مدخل مياه بارد',
          connections: ['JN-PW-04']
        },
        { 
          id: 'GS-END-02', 
          type: 'endpoint', 
          name: '🔥 موقد غاز',
          yaw: -2.55, 
          pitch: 0.15,
          text: 'موقد 5 عيون - صمام أمان',
          connections: ['GS-SEN-01']
        }
      ]
    },

    // ========== المشهد 4: CorridorGround ==========
    '4-corridorground': {
      name: 'الممر الأرضي',
      nodes: [
        { 
          id: 'JN-EL-10', 
          type: 'junction', 
          name: '🔌 توزيع الممر',
          yaw: 0.15, 
          pitch: 0.10,
          text: 'قاطع 20A - إنارة الممر',
          connections: ['EL-SEN-01', 'END-EL-14', 'END-EL-15']
        },
        { 
          id: 'END-EL-14', 
          type: 'endpoint', 
          name: '💡 إضاءة الممر 1',
          yaw: 0.05, 
          pitch: 0.20,
          text: 'لمبة LED 15 واط',
          connections: ['JN-EL-10']
        },
        { 
          id: 'END-EL-15', 
          type: 'endpoint', 
          name: '💡 إضاءة الممر 2',
          yaw: 0.25, 
          pitch: 0.22,
          text: 'لمبة LED 15 واط',
          connections: ['JN-EL-10']
        },
        { 
          id: 'END-PW-07', 
          type: 'endpoint', 
          name: '🚰 نافورة مياه',
          yaw: -0.25, 
          pitch: 0.15,
          text: 'نافورة شرب',
          connections: ['JN-PW-01']
        }
      ]
    },

    // ========== المشهد 5: LivingRoom ==========
    '5-livingroom': {
      name: 'غرفة المعيشة',
      nodes: [
        { 
          id: 'EL-SEN-05', 
          type: 'source', 
          name: '⚡ لوحة المعيشة',
          yaw: -1.55, 
          pitch: 0.10,
          text: 'قاطع 60A - فرعي',
          connections: ['JN-EL-11', 'JN-EL-12']
        },
        { 
          id: 'JN-EL-11', 
          type: 'junction', 
          name: '🔌 توزيع الإضاءة',
          yaw: -1.75, 
          pitch: 0.05,
          text: 'قاطع 20A - إضاءة',
          connections: ['EL-SEN-05', 'END-EL-16']
        },
        { 
          id: 'JN-EL-12', 
          type: 'junction', 
          name: '🔌 توزيع المخارج',
          yaw: -1.35, 
          pitch: 0.08,
          text: 'قاطع 40A - مخارج',
          connections: ['EL-SEN-05', 'END-EL-17', 'END-EL-18']
        },
        { 
          id: 'END-EL-16', 
          type: 'endpoint', 
          name: '💡 إضاءة المعيشة',
          yaw: -1.85, 
          pitch: 0.25,
          text: 'ثريا 60 واط',
          connections: ['JN-EL-11']
        },
        { 
          id: 'END-EL-17', 
          type: 'endpoint', 
          name: '🔌 مخرج تلفاز',
          yaw: -1.25, 
          pitch: 0.20,
          text: 'مخرج 16A - للتلفاز',
          connections: ['JN-EL-12']
        },
        { 
          id: 'END-EL-18', 
          type: 'endpoint', 
          name: '🔌 مخرج عام',
          yaw: -1.45, 
          pitch: 0.22,
          text: 'مخرج 16A',
          connections: ['JN-EL-12']
        },
        { 
          id: 'END-AC-03', 
          type: 'endpoint', 
          name: '🌀 مكيف المعيشة',
          yaw: 1.45, 
          pitch: 0.15,
          text: 'مكيف سبليت 18000 وحدة',
          connections: ['JN-AC-02']
        }
      ]
    }
  },

  // علاقات بين المشاهد (لربط الشبكات)
  crossScene: {
    // كهرباء
    'JN-EL-03': { connectsTo: '2-groundhall/EL-SEN-03' },
    'JN-EL-07': { connectsTo: '3-groundkichin/EL-SEN-04' },
    
    // مياه
    'JN-PW-02': { connectsTo: '3-groundkichin/JN-PW-04' },
    
    // غاز 
    'JN-GS-01': { connectsTo: '3-groundkichin/GS-END-02' },
    
    // تكييف
    'JN-AC-01': { connectsTo: '5-livingroom/END-AC-03' }
  },

  // معلومات إضافية عامة
  metadata: {
    version: '1.0.0',
    date: '2024-01-15',
    project: 'مشروع سكني متكامل',
    systems: ['EL', 'PW', 'GS', 'AC'],
    totalNodes: 78,
    totalSources: 12,
    totalJunctions: 24,
    totalEndpoints: 42
  },

  // دالة مساعدة للبحث عن عقدة
  findNode: function(nodeId) {
    for (const sceneId in this.networks) {
      const scene = this.networks[sceneId];
      const node = scene.nodes.find(n => n.id === nodeId);
      if (node) {
        return {
          scene: sceneId,
          sceneName: scene.name,
          node: node
        };
      }
    }
    return null;
  },

  // دالة للحصول على كل العقد من نوع معين
  getNodesByType: function(type) {
    const nodes = [];
    for (const sceneId in this.networks) {
      const scene = this.networks[sceneId];
      scene.nodes.forEach(node => {
        if (node.id.includes(type)) {
          nodes.push({
            scene: sceneId,
            sceneName: scene.name,
            ...node
          });
        }
      });
    }
    return nodes;
  }
};

// إضافة للعالمية
window.BIM_DATA = BIM_DATA;

console.log('✅ BIM_DATA loaded with', 
  Object.keys(BIM_DATA.networks).length, 'scenes and',
  BIM_DATA.metadata.totalNodes, 'total nodes');