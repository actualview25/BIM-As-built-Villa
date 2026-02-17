/*
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

(function() {
  var Marzipano = window.Marzipano;
  var bowser = window.bowser;
  var screenfull = window.screenfull;
  var data = window.APP_DATA;

  // التحقق من وجود البيانات وإضافة القيم الافتراضية
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

  // Grab elements from DOM.
  var panoElement = document.querySelector('#pano');
  var sceneNameElement = document.querySelector('#titleBar .sceneName');
  var sceneListElement = document.querySelector('#sceneList');
  var sceneElements = document.querySelectorAll('#sceneList .scene');
  var sceneListToggleElement = document.querySelector('#sceneListToggle');
  var autorotateToggleElement = document.querySelector('#autorotateToggle');
  var fullscreenToggleElement = document.querySelector('#fullscreenToggle');

  // Detect desktop or mobile mode.
  if (window.matchMedia) {
    var setMode = function() {
      if (mql.matches) {
        document.body.classList.remove('desktop');
        document.body.classList.add('mobile');
      } else {
        document.body.classList.remove('mobile');
        document.body.classList.add('desktop');
      }
    };
    var mql = matchMedia("(max-width: 500px), (max-height: 500px)");
    setMode();
    mql.addListener(setMode);
  } else {
    document.body.classList.add('desktop');
  }

  // Detect whether we are on a touch device.
  document.body.classList.add('no-touch');
  window.addEventListener('touchstart', function() {
    document.body.classList.remove('no-touch');
    document.body.classList.add('touch');
  });

  // Use tooltip fallback mode on IE < 11.
  if (bowser.msie && parseFloat(bowser.version) < 11) {
    document.body.classList.add('tooltip-fallback');
  }

  // Viewer options.
  var viewerOpts = {
    controls: {
      mouseViewMode: data.settings.mouseViewMode
    }
  };

  // Initialize viewer.
  var viewer = new Marzipano.Viewer(panoElement, viewerOpts);

  // Create scenes.
  var scenes = data.scenes.map(function(data) {
    var urlPrefix = "tiles";
    var source = Marzipano.ImageUrlSource.fromString(
      urlPrefix + "/" + data.id + "/{z}/{f}/{y}/{x}.jpg",
      { cubeMapPreviewUrl: urlPrefix + "/" + data.id + "/preview.jpg" });
    var geometry = new Marzipano.CubeGeometry(data.levels);

    var limiter = Marzipano.RectilinearView.limit.traditional(data.faceSize, 100*Math.PI/180, 120*Math.PI/180);
    var view = new Marzipano.RectilinearView(data.initialViewParameters, limiter);

    var scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true
    });

    // Create link hotspots.
    if (data.linkHotspots && data.linkHotspots.length > 0) {
      data.linkHotspots.forEach(function(hotspot) {
        try {
          var element = createLinkHotspotElement(hotspot);
          scene.hotspotContainer().createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
        } catch(e) {
          console.warn('خطأ في إضافة link hotspot:', e);
        }
      });
    }

    // Create info hotspots.
    if (data.infoHotspots && data.infoHotspots.length > 0) {
      data.infoHotspots.forEach(function(hotspot) {
        try {
          var element = createInfoHotspotElement(hotspot);
          scene.hotspotContainer().createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
        } catch(e) {
          console.warn('خطأ في إضافة info hotspot:', e);
        }
      });
    }

    return {
      data: data,
      scene: scene,
      view: view
    };
  });

  // التحقق من وجود مشاهد
  if (!scenes || scenes.length === 0) {
    console.error('❌ لا توجد مشاهد');
    return;
  }

  // Set up autorotate, if enabled.
  var autorotate = Marzipano.autorotate({
    yawSpeed: 0.03,
    targetPitch: 0,
    targetFov: Math.PI/2
  });
  if (data.settings.autorotateEnabled) {
    autorotateToggleElement.classList.add('enabled');
  }

  // Set handler for autorotate toggle.
  autorotateToggleElement.addEventListener('click', toggleAutorotate);

  // Set up fullscreen mode, if supported.
  if (screenfull.enabled && data.settings.fullscreenButton) {
    document.body.classList.add('fullscreen-enabled');
    fullscreenToggleElement.addEventListener('click', function() {
      screenfull.toggle();
    });
    screenfull.on('change', function() {
      if (screenfull.isFullscreen) {
        fullscreenToggleElement.classList.add('enabled');
      } else {
        fullscreenToggleElement.classList.remove('enabled');
      }
    });
  } else {
    document.body.classList.add('fullscreen-disabled');
  }

  // Set handler for scene list toggle.
  sceneListToggleElement.addEventListener('click', toggleSceneList);

  // Start with the scene list open on desktop.
  if (!document.body.classList.contains('mobile')) {
    showSceneList();
  }

  // Set handler for scene switch.
  scenes.forEach(function(scene) {
    var el = document.querySelector('#sceneList .scene[data-id="' + scene.data.id + '"]');
    if (el) {
      el.addEventListener('click', function() {
        switchScene(scene);
        // On mobile, hide scene list after selecting a scene.
        if (document.body.classList.contains('mobile')) {
          hideSceneList();
        }
      });
    }
  });

  // DOM elements for view controls.
  var viewUpElement = document.querySelector('#viewUp');
  var viewDownElement = document.querySelector('#viewDown');
  var viewLeftElement = document.querySelector('#viewLeft');
  var viewRightElement = document.querySelector('#viewRight');
  var viewInElement = document.querySelector('#viewIn');
  var viewOutElement = document.querySelector('#viewOut');

  // Dynamic parameters for controls.
  var velocity = 0.7;
  var friction = 3;

  // Associate view controls with elements.
  var controls = viewer.controls();
  if (viewUpElement) controls.registerMethod('upElement', new Marzipano.ElementPressControlMethod(viewUpElement, 'y', -velocity, friction), true);
  if (viewDownElement) controls.registerMethod('downElement', new Marzipano.ElementPressControlMethod(viewDownElement, 'y', velocity, friction), true);
  if (viewLeftElement) controls.registerMethod('leftElement', new Marzipano.ElementPressControlMethod(viewLeftElement, 'x', -velocity, friction), true);
  if (viewRightElement) controls.registerMethod('rightElement', new Marzipano.ElementPressControlMethod(viewRightElement, 'x', velocity, friction), true);
  if (viewInElement) controls.registerMethod('inElement', new Marzipano.ElementPressControlMethod(viewInElement, 'zoom', -velocity, friction), true);
  if (viewOutElement) controls.registerMethod('outElement', new Marzipano.ElementPressControlMethod(viewOutElement, 'zoom', velocity, friction), true);

  function sanitize(s) {
    if (!s) return '';
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function switchScene(scene) {
    if (!scene) return;
    
    stopAutorotate();
    scene.view.setParameters(scene.data.initialViewParameters);
    scene.scene.switchTo();
    startAutorotate();
    updateSceneName(scene);
    updateSceneList(scene);
    
    // تحديث نظام BIM - ✅ التصحيح الصحيح
    if (window.BIM) {
      window.BIM.currentScene = scene;
      window.BIM.drawCurrentScene();  // ✅ استخدم drawCurrentScene
    }
  }
  function updateSceneName(scene) {
    if (sceneNameElement) {
      sceneNameElement.innerHTML = sanitize(scene.data.name);
    }
  }

  function updateSceneList(scene) {
    for (var i = 0; i < sceneElements.length; i++) {
      var el = sceneElements[i];
      if (el) {
        if (el.getAttribute('data-id') === scene.data.id) {
          el.classList.add('current');
        } else {
          el.classList.remove('current');
        }
      }
    }
  }

  function showSceneList() {
    if (sceneListElement) sceneListElement.classList.add('enabled');
    if (sceneListToggleElement) sceneListToggleElement.classList.add('enabled');
  }

  function hideSceneList() {
    if (sceneListElement) sceneListElement.classList.remove('enabled');
    if (sceneListToggleElement) sceneListToggleElement.classList.remove('enabled');
  }

  function toggleSceneList() {
    if (sceneListElement) sceneListElement.classList.toggle('enabled');
    if (sceneListToggleElement) sceneListToggleElement.classList.toggle('enabled');
  }

  function startAutorotate() {
    if (!autorotateToggleElement || !autorotateToggleElement.classList.contains('enabled')) {
      return;
    }
    viewer.startMovement(autorotate);
    viewer.setIdleMovement(3000, autorotate);
  }

  function stopAutorotate() {
    viewer.stopMovement();
    viewer.setIdleMovement(Infinity);
  }

  function toggleAutorotate() {
    if (!autorotateToggleElement) return;
    
    if (autorotateToggleElement.classList.contains('enabled')) {
      autorotateToggleElement.classList.remove('enabled');
      stopAutorotate();
    } else {
      autorotateToggleElement.classList.add('enabled');
      startAutorotate();
    }
  }

  function createLinkHotspotElement(hotspot) {

    // Create wrapper element to hold icon and tooltip.
    var wrapper = document.createElement('div');
    wrapper.classList.add('hotspot');
    wrapper.classList.add('link-hotspot');

    // Create image element.
    var icon = document.createElement('img');
    icon.src = 'img/link.png';
    icon.classList.add('link-hotspot-icon');
    icon.alt = 'انتقال';

    // Set rotation transform.
    if (hotspot.rotation) {
      var transformProperties = [ '-ms-transform', '-webkit-transform', 'transform' ];
      for (var i = 0; i < transformProperties.length; i++) {
        var property = transformProperties[i];
        icon.style[property] = 'rotate(' + hotspot.rotation + 'rad)';
      }
    }

    // Add click event handler.
    wrapper.addEventListener('click', function() {
      switchScene(findSceneById(hotspot.target));
    });

    // Prevent touch and scroll events from reaching the parent element.
    stopTouchAndScrollEventPropagation(wrapper);

    // Create tooltip element.
    var targetScene = findSceneDataById(hotspot.target);
    if (targetScene) {
      var tooltip = document.createElement('div');
      tooltip.classList.add('hotspot-tooltip');
      tooltip.classList.add('link-hotspot-tooltip');
      tooltip.innerHTML = sanitize(targetScene.name);
      wrapper.appendChild(tooltip);
    }

    wrapper.appendChild(icon);
    return wrapper;
  }

  function createInfoHotspotElement(hotspot) {

    // Create wrapper element to hold icon and tooltip.
    var wrapper = document.createElement('div');
    wrapper.classList.add('hotspot');
    wrapper.classList.add('info-hotspot');

    // Create hotspot/tooltip header.
    var header = document.createElement('div');
    header.classList.add('info-hotspot-header');

    // Create image element.
    var iconWrapper = document.createElement('div');
    iconWrapper.classList.add('info-hotspot-icon-wrapper');
    var icon = document.createElement('img');
    icon.src = 'img/info.png';
    icon.classList.add('info-hotspot-icon');
    icon.alt = 'معلومات';
    iconWrapper.appendChild(icon);

    // Create title element.
    var titleWrapper = document.createElement('div');
    titleWrapper.classList.add('info-hotspot-title-wrapper');
    var title = document.createElement('div');
    title.classList.add('info-hotspot-title');
    title.innerHTML = hotspot.title || 'معلومات';
    titleWrapper.appendChild(title);

    // Create close element.
    var closeWrapper = document.createElement('div');
    closeWrapper.classList.add('info-hotspot-close-wrapper');
    var closeIcon = document.createElement('img');
    closeIcon.src = 'img/close.png';
    closeIcon.classList.add('info-hotspot-close-icon');
    closeIcon.alt = 'إغلاق';
    closeWrapper.appendChild(closeIcon);

    // Construct header element.
    header.appendChild(iconWrapper);
    header.appendChild(titleWrapper);
    header.appendChild(closeWrapper);

    // Create text element.
    var text = document.createElement('div');
    text.classList.add('info-hotspot-text');
    text.innerHTML = hotspot.text || '';

    // Place header and text into wrapper element.
    wrapper.appendChild(header);
    wrapper.appendChild(text);

    // Create a modal for the hotspot content to appear on mobile mode.
    var modal = document.createElement('div');
    modal.innerHTML = wrapper.innerHTML;
    modal.classList.add('info-hotspot-modal');
    document.body.appendChild(modal);

    var toggle = function() {
      wrapper.classList.toggle('visible');
      modal.classList.toggle('visible');
    };

    // Show content when hotspot is clicked.
    var headerEl = wrapper.querySelector('.info-hotspot-header');
    if (headerEl) {
      headerEl.addEventListener('click', toggle);
    }

    // Hide content when close icon is clicked.
    var closeEl = modal.querySelector('.info-hotspot-close-wrapper');
    if (closeEl) {
      closeEl.addEventListener('click', toggle);
    }

    // Prevent touch and scroll events from reaching the parent element.
    stopTouchAndScrollEventPropagation(wrapper);

    return wrapper;
  }

  // Prevent touch and scroll events from reaching the parent element.
  function stopTouchAndScrollEventPropagation(element) {
    var eventList = [ 'touchstart', 'touchmove', 'touchend', 'touchcancel',
                      'wheel', 'mousewheel' ];
    for (var i = 0; i < eventList.length; i++) {
      element.addEventListener(eventList[i], function(event) {
        event.stopPropagation();
      });
    }
  }

  function findSceneById(id) {
    for (var i = 0; i < scenes.length; i++) {
      if (scenes[i].data.id === id) {
        return scenes[i];
      }
    }
    return null;
  }

  function findSceneDataById(id) {
    if (!data || !data.scenes) return null;
    for (var i = 0; i < data.scenes.length; i++) {
      if (data.scenes[i].id === id) {
        return data.scenes[i];
      }
    }
    return null;
  }

  // Display the initial scene.
  if (scenes.length > 0) {
    switchScene(scenes[0]);
  }

  // ==================== نظام BIM ====================
  
  // تهيئة نظام BIM بعد تحميل المشاهد
  setTimeout(function() {
    if (window.BIM && viewer) {
      try {
        window.BIM.init(viewer);
        console.log('✅ BIM System initialized from index.js');
        
        // بدء تحديث الرسم
        window.BIM.update();
        
        // ربط الأزرار الموجودة في HTML
        setupBIMButtons();
        
      } catch(e) {
        console.warn('⚠️ خطأ في تهيئة BIM:', e);
      }
    } else {
      console.warn('⚠️ BIM غير متاح');
    }
  }, 500);

  // ربط أزرار BIM الموجودة في HTML
  function setupBIMButtons() {
    var buttons = document.querySelectorAll('.bim-btn');
    buttons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var layer = this.getAttribute('data-layer');
        if (layer && window.BIM) {
          window.BIM.toggleLayer(layer);
        }
      });
    });
    console.log('✅ BIM buttons connected');
  }
// ========== اختبار نظام BIM ==========
  
  // تهيئة نظام BIM
  setTimeout(function() {
    if (window.BIM && viewer) {
      try {
        console.log('🚀 بدء تهيئة BIM...');
        
        // تهيئة النظام
        window.BIM.init(viewer);
        
        // ربط المشهد الحالي
        if (scenes && scenes.length > 0) {
          window.BIM.currentScene = scenes[0];
          window.BIM.loadScene(scenes[0].data.id);
        }
        
        // بدء التحديث
        window.BIM.update();
        
        // ربط أزرار BIM
        connectBIMButtons();
        
        console.log('✅ BIM System initialized');
      } catch(e) {
        console.error('❌ خطأ في BIM:', e);
      }
    } else {
      console.warn('⚠️ BIM غير متوفر');
    }
  }, 1000);
  
  // ربط الأزرار الموجودة في HTML
  function connectBIMButtons() {
    var buttons = document.querySelectorAll('.bim-btn');
    console.log('🔘 عدد أزرار BIM:', buttons.length);
    
    buttons.forEach(function(btn, index) {
      var layer = btn.getAttribute('data-layer');
      console.log(`  زر ${index + 1}: ${layer}`);
      
      btn.onclick = function() {
        if (window.BIM) {
          var type = this.getAttribute('data-layer');
          console.log('👆 النقر على:', type);
          window.BIM.toggleLayer(type);
        }
      };
    });
  }
  
  // اختبار يدوي للطبقات بعد 3 ثوان
  setTimeout(function() {
    if (window.BIM) {
      console.log('🧪 اختبار إظهار جميع الطبقات...');
      window.BIM.toggleLayer('EL');
      window.BIM.toggleLayer('PW');
      window.BIM.toggleLayer('GS');
      window.BIM.toggleLayer('AC');
    }
  }, 3000);
// بعد إنشاء المشاهد وقبل إغلاق الدالة

  // تهيئة نظام BIM
  setTimeout(function() {
    if (window.BIMSystem && viewer) {
      window.BIMSystem.init(viewer, scenes);
      window.BIMSystem.currentScene = scenes[0];
      window.BIMSystem.drawCurrentScene();
      window.BIMSystem.update();
      
      // ربط أزرار الطبقات
      document.querySelectorAll('.layer-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const layer = this.getAttribute('data-layer');
          window.BIMSystem.toggleLayer(layer);
        });
      });
      
      console.log('✅ BIMSystem ready');
    }
  }, 1000);
// ==================== نظام BIM الموحد ====================
  
  // تهيئة نظام BIM بعد تحميل المشاهد
  setTimeout(function() {
    if (window.BIM && viewer && scenes) {
      try {
        // تهيئة النظام
        window.BIM.init(viewer, scenes);
        
        // تعيين المشهد الحالي
        if (scenes.length > 0) {
          window.BIM.currentScene = scenes[0];
          window.BIM.drawCurrentScene();  // ✅ استخدم drawCurrentScene
        }
        
        // بدء التحديث المستمر
        window.BIM.update();
        
        // ربط أزرار BIM
        const buttons = document.querySelectorAll('.bim-btn');
        console.log(`🔘 Found ${buttons.length} BIM buttons`);
        
        buttons.forEach(btn => {
          btn.addEventListener('click', function(e) {
            e.preventDefault();
            const layer = this.getAttribute('data-layer');
            if (layer && window.BIM) {
              window.BIM.toggleLayer(layer);
            }
          });
        });
        
        console.log('✅ BIM System is ready and running');
      } catch(e) {
        console.error('❌ BIM Error:', e);
      }
    } else {
      console.warn('⚠️ BIM not available');
    }
  }, 1500);

})();
