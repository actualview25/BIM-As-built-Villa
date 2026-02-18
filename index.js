'use strict';

(function() {
  var Marzipano = window.Marzipano;
  var bowser = window.bowser;
  var screenfull = window.screenfull;
  var data = window.APP_DATA;

  if (!data) {
    console.error('❌ APP_DATA غير موجود');
    return;
  }

  if (!data.settings) {
    data.settings = {
      mouseViewMode: 'drag',
      autorotateEnabled: false,
      fullscreenButton: true
    };
  }

  // عناصر DOM
  var panoElement = document.querySelector('#pano');
  var sceneNameElement = document.querySelector('#titleBar .sceneName');
  var sceneListElement = document.querySelector('#sceneList');
  var sceneElements = document.querySelectorAll('#sceneList .scene');
  var sceneListToggleElement = document.querySelector('#sceneListToggle');
  var autorotateToggleElement = document.querySelector('#autorotateToggle');
  var fullscreenToggleElement = document.querySelector('#fullscreenToggle');

  // الكشف عن وضع الجهاز
  if (window.matchMedia) {
    var mql = matchMedia("(max-width: 500px), (max-height: 500px)");
    var setMode = function() {
      if (mql.matches) {
        document.body.classList.remove('desktop');
        document.body.classList.add('mobile');
      } else {
        document.body.classList.remove('mobile');
        document.body.classList.add('desktop');
      }
    };
    setMode();
    mql.addListener(setMode);
  } else {
    document.body.classList.add('desktop');
  }

  // الكشف عن الأجهزة التي تعمل باللمس
  document.body.classList.add('no-touch');
  window.addEventListener('touchstart', function() {
    document.body.classList.remove('no-touch');
    document.body.classList.add('touch');
  });

  // دعم IE < 11
  if (bowser.msie && parseFloat(bowser.version) < 11) {
    document.body.classList.add('tooltip-fallback');
  }

  // إعداد Viewer
  var viewerOpts = {
    controls: { mouseViewMode: data.settings.mouseViewMode }
  };
  var viewer = new Marzipano.Viewer(panoElement, viewerOpts);

  // إنشاء المشاهد
  var scenes = data.scenes.map(function(sceneData) {
    var urlPrefix = "tiles";
    var source = Marzipano.ImageUrlSource.fromString(
      urlPrefix + "/" + sceneData.id + "/{z}/{f}/{y}/{x}.jpg",
      { cubeMapPreviewUrl: urlPrefix + "/" + sceneData.id + "/preview.jpg" }
    );
    var geometry = new Marzipano.CubeGeometry(sceneData.levels);
    var limiter = Marzipano.RectilinearView.limit.traditional(sceneData.faceSize, 100*Math.PI/180, 120*Math.PI/180);
    var view = new Marzipano.RectilinearView(sceneData.initialViewParameters, limiter);

    var scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true
    });

    // إنشاء info hotspots
    if (sceneData.infoHotspots) {
      sceneData.infoHotspots.forEach(function(h) {
        var el = createInfoHotspotElement(h);
        scene.hotspotContainer().createHotspot(el, { yaw: h.yaw, pitch: h.pitch });
      });
    }

    // إنشاء link hotspots
    if (sceneData.linkHotspots) {
      sceneData.linkHotspots.forEach(function(h) {
        var el = createLinkHotspotElement(h);
        scene.hotspotContainer().createHotspot(el, { yaw: h.yaw, pitch: h.pitch });
      });
    }

    return { data: sceneData, scene: scene, view: view };
  });

  if (!scenes.length) {
    console.error('❌ لا توجد مشاهد');
    return;
  }

  // تحكم autorotate
  var autorotate = Marzipano.autorotate({ yawSpeed: 0.03, targetPitch: 0, targetFov: Math.PI/2 });
  if (data.settings.autorotateEnabled) autorotateToggleElement.classList.add('enabled');
  autorotateToggleElement.addEventListener('click', toggleAutorotate);

  // تحكم fullscreen
  if (screenfull.enabled && data.settings.fullscreenButton) {
    document.body.classList.add('fullscreen-enabled');
    fullscreenToggleElement.addEventListener('click', function() { screenfull.toggle(); });
    screenfull.on('change', function() {
      fullscreenToggleElement.classList.toggle('enabled', screenfull.isFullscreen);
    });
  } else document.body.classList.add('fullscreen-disabled');

  // تحكم قائمة المشاهد
  sceneListToggleElement.addEventListener('click', toggleSceneList);
  if (!document.body.classList.contains('mobile')) showSceneList();

  scenes.forEach(function(s) {
    var el = document.querySelector('#sceneList .scene[data-id="' + s.data.id + '"]');
    if (el) el.addEventListener('click', function() { switchScene(s); if(document.body.classList.contains('mobile')) hideSceneList(); });
  });

  // تحكم الكاميرا
  var velocity = 0.7, friction = 3;
  var controls = viewer.controls();
  [['viewUp','y',-velocity], ['viewDown','y',velocity],
   ['viewLeft','x',-velocity], ['viewRight','x',velocity],
   ['viewIn','zoom',-velocity], ['viewOut','zoom',velocity]].forEach(function(item) {
    var el = document.querySelector('#'+item[0]);
    if(el) controls.registerMethod(item[0], new Marzipano.ElementPressControlMethod(el, item[1], item[2], friction), true);
  });

  // ======== دوال مساعدة ========
  function sanitize(s){ return s ? s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') : ''; }
  function findSceneById(id){ return scenes.find(s=>s.data.id===id)||null; }
  function findSceneDataById(id){ return data.scenes.find(s=>s.id===id)||null; }

  function showSceneList(){ sceneListElement?.classList.add('enabled'); sceneListToggleElement?.classList.add('enabled'); }
  function hideSceneList(){ sceneListElement?.classList.remove('enabled'); sceneListToggleElement?.classList.remove('enabled'); }
  function toggleSceneList(){ sceneListElement?.classList.toggle('enabled'); sceneListToggleElement?.classList.toggle('enabled'); }

  function startAutorotate(){ if(!autorotateToggleElement?.classList.contains('enabled')) return; viewer.startMovement(autorotate); viewer.setIdleMovement(3000, autorotate); }
  function stopAutorotate(){ viewer.stopMovement(); viewer.setIdleMovement(Infinity); }
  function toggleAutorotate(){ autorotateToggleElement.classList.toggle('enabled'); autorotateToggleElement.classList.contains('enabled')?startAutorotate():stopAutorotate(); }

  // ======== دوال Hotspots ========
  function createLinkHotspotElement(h){
    var wrapper = document.createElement('div');
    wrapper.className = 'hotspot link-hotspot';
    var icon = document.createElement('img'); icon.src='img/link.png'; icon.className='link-hotspot-icon'; wrapper.appendChild(icon);
    wrapper.addEventListener('click',()=>switchScene(findSceneById(h.target)));
    return wrapper;
  }

  function createInfoHotspotElement(h){
    var wrapper = document.createElement('div'); wrapper.className='hotspot info-hotspot';
    var iconWrapper=document.createElement('div'); iconWrapper.className='info-hotspot-icon-wrapper';
    var icon=document.createElement('img'); icon.src='img/info.png'; icon.className='info-hotspot-icon';
    iconWrapper.appendChild(icon); wrapper.appendChild(iconWrapper);
    return wrapper;
  }

  function stopTouchAndScrollEventPropagation(el){
    ['touchstart','touchmove','touchend','touchcancel','wheel','mousewheel'].forEach(e=>el.addEventListener(e, ev=>ev.stopPropagation()));
  }

  // ======== تغيير المشهد ========
  function switchScene(scene){
    if(!scene) return;
    stopAutorotate();
    scene.view.setParameters(scene.data.initialViewParameters);
    scene.scene.switchTo();
    startAutorotate();
    updateSceneName(scene);
    updateSceneList(scene);

    if(window.BIM?.currentScene!==undefined){
      window.BIM.currentScene = scene;
      window.BIM.drawCurrentScene?.();
    }
  }

  function updateSceneName(scene){ sceneNameElement && (sceneNameElement.innerHTML = sanitize(scene.data.name)); }
  function updateSceneList(scene){
    sceneElements.forEach(el=>el.classList.toggle('current', el.getAttribute('data-id')===scene.data.id));
  }

  // ======== عرض المشهد الأول ========
  switchScene(scenes[0]);

  // ======== تهيئة نظام BIM ========
  setTimeout(()=>{
    if(window.attachBIM) attachBIM(viewer);
    if(window.BIM && scenes.length){
      window.BIM.currentScene = scenes[0];
      window.BIM.drawCurrentScene?.();

      // ربط أزرار الطبقات
      document.querySelectorAll('.bim-btn').forEach(btn=>{
        btn.addEventListener('click', e=>{
          e.preventDefault();
          const layer = btn.getAttribute('data-layer');
          window.BIM.toggleLayer?.(layer);
          setTimeout(()=>window.BIM.drawCurrentScene?.(),50);
        });
      });
    }
  },1000);

})();
