// ==================== bim-core.js ====================
window.BIM = (function(){

  const BIM = {};

  BIM.layers = {};           // تخزين كل طبقة
  BIM.currentScene = null;   // المشهد الحالي
  BIM.viewer = null;         // Marzipano viewer
  BIM.scenes = null;         // قائمة المشاهد

  // تهيئة النظام
  BIM.init = function(viewer, scenes) {
    BIM.viewer = viewer;
    BIM.scenes = scenes;

    // ربط الطبقات بالـ DOM
    BIM.layers = {
      EL: document.getElementById('layer-EL'),
      PW: document.getElementById('layer-PW'),
      GS: document.getElementById('layer-GS'),
      AC: document.getElementById('layer-AC')
    };

    // تأكد أن كل طبقة موجودة
    Object.entries(BIM.layers).forEach(([name, layer]) => {
      if (!layer) console.warn(`⚠️ BIM layer ${name} not found`);
      else layer.style.position = 'absolute';
    });

    // ربط أزرار التبديل لكل طبقة
    const buttons = document.querySelectorAll('.bim-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', function(e){
        e.preventDefault();
        const layerName = this.getAttribute('data-layer');
        if(layerName) BIM.toggleLayer(layerName);
        BIM.drawCurrentScene();
      });
    });

    console.log('✅ BIM initialized');
  };

  // تبديل الطبقة
  BIM.toggleLayer = function(name) {
    const layer = BIM.layers[name];
    if(!layer) return;
    layer.style.display = (layer.style.display === 'none' || !layer.style.display) ? 'block' : 'none';
  };

  // رسم الطبقات في المشهد الحالي
  BIM.drawCurrentScene = function() {
    const scene = BIM.currentScene;
    if(!scene) return;

    // كل طبقة، يمكن لاحقًا إضافة فلترة حسب scene.data
    Object.values(BIM.layers).forEach(layer=>{
      if(layer) layer.style.display = 'block';
    });

    // مزامنة الطبقات مع الكاميرا (yaw/pitch)
    if(BIM.viewer && scene.view) {
      const view = scene.view;
      Object.values(BIM.layers).forEach(layer=>{
        if(!layer) return;
        const yaw = view.yaw();
        const pitch = view.pitch();
        layer.style.transform = `translate(-50%, -50%) rotateY(${yaw}rad) rotateX(${pitch}rad)`;
      });
    }
  };

  // تحديث مستمر للطبقات عند تحريك الكاميرا
  BIM.update = function() {
    if(!BIM.currentScene || !BIM.viewer) return;
    BIM.drawCurrentScene();
    requestAnimationFrame(BIM.update);
  };

  return BIM;

})();
