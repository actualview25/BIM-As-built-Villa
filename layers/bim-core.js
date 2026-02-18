/* ================================
   BIM CORE – SINGLE SOURCE OF TRUTH
   ================================ */

(function () {

  const overlay = document.getElementById("bim-overlay");

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");

  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.style.position = "absolute";
  svg.style.top = 0;
  svg.style.left = 0;

  overlay.appendChild(svg);

  /* ================================
     DATA STRUCTURE
     ================================ */

  const BIM_DATA = {
    points: [
      {
        id: "P1",
        yaw: 0.2,
        pitch: -0.05,
        label: "Main Panel"
      },
      {
        id: "P2",
        yaw: 0.6,
        pitch: -0.1,
        label: "Water Riser"
      }
    ],

    lines: [
      {
        from: "P1",
        to: "P2",
        type: "electric"
      }
    ]
  };

  /* ================================
     VIEW PROJECTION (THE HEART)
     ================================ */

  function project(point, view) {
    const yaw = view.yaw();
    const pitch = view.pitch();
    const fov = view.fov();

    const x =
      (0.5 + (point.yaw - yaw) / fov) * window.innerWidth;

    const y =
      (0.5 - (point.pitch - pitch) / fov) * window.innerHeight;

    return { x, y };
  }

  /* ================================
     DRAWING
     ================================ */

  function clear() {
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
  }

  function drawPoint(point, view) {
    const p = project(point, view);

    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", p.x);
    circle.setAttribute("cy", p.y);
    circle.setAttribute("r", 6);
    circle.setAttribute("fill", "#00ffcc");

    svg.appendChild(circle);
  }

  function drawLine(p1, p2, view) {
    const a = project(p1, view);
    const b = project(p2, view);

    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", a.x);
    line.setAttribute("y1", a.y);
    line.setAttribute("x2", b.x);
    line.setAttribute("y2", b.y);
    line.setAttribute("stroke", "#ffaa00");
    line.setAttribute("stroke-width", 2);

    svg.appendChild(line);
  }

  /* ================================
     RENDER LOOP
     ================================ */

  function render(view) {
    clear();

    // draw lines
    BIM_DATA.lines.forEach(l => {
      const p1 = BIM_DATA.points.find(p => p.id === l.from);
      const p2 = BIM_DATA.points.find(p => p.id === l.to);
      if (p1 && p2) drawLine(p1, p2, view);
    });

    // draw points
    BIM_DATA.points.forEach(p => drawPoint(p, view));
  }

  /* ================================
     CONNECT TO MARZIPANO
     ================================ */

  window.attachBIM = function (viewer) {
    const view = viewer.view();

    viewer.addEventListener("viewChange", function () {
      render(view);
    });

    render(view);
  };
window.BIM = {
  init: function(viewer) {
    if (window.attachBIM) {
      attachBIM(viewer);
    }
  }
};
})();
