const map = L.map('map').setView([55.75, 37.62], 10);

const baseLayers = {
  osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
  satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
  hybrid: L.layerGroup([
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
    L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', { opacity: 0.7 })
  ])
};

baseLayers.osm.addTo(map);

document.getElementById('basemap').addEventListener('change', (e) => {
  Object.values(baseLayers).forEach(l => map.removeLayer(l));
  baseLayers[e.target.value].addTo(map);
});

const drawnItems = new L.FeatureGroup().addTo(map);

const drawControl = new L.Control.Draw({
  edit: { featureGroup: drawnItems },
  draw: {
    polygon: false,
    rectangle: false,
    circle: false,
    marker: false,
    circlemarker: false,
    polyline: {
      shapeOptions: { color: document.getElementById('lineColor').value, weight: 4 }
    }
  }
});
map.addControl(drawControl);

const geocoder = L.Control.geocoder({
  defaultMarkGeocode: false,
  placeholder: 'Поиск места...',
  position: 'topright'
})
.on('markgeocode', function(e) {
  const bbox = e.geocode.bbox;
  const poly = L.polygon([
    bbox.getSouthEast(),
    bbox.getNorthEast(),
    bbox.getNorthWest(),
    bbox.getSouthWest()
  ]);
  map.fitBounds(poly.getBounds());
})
.addTo(map);

let currentMode = 'line';

document.getElementById('drawArrowBtn').addEventListener('click', () => {
  currentMode = 'arrow';
  drawControl._toolbars.draw._modes.polyline.handler.enable();
});

map.on(L.Draw.Event.CREATED, (e) => {
  const layer = e.layer;
  const arrowColor = document.getElementById('arrowColor').value;

  if (currentMode === 'arrow') {
    const latlngs = layer.getLatLngs();
    if (latlngs.length === 2) {
      const arrow = new UavArrow(latlngs[0], latlngs[1], arrowColor);
      arrow.addTo(drawnItems);
    }
    map.removeLayer(layer);
  } else {
    drawnItems.addLayer(layer);
  }

  currentMode = 'line';
});

// === Класс UAV Arrow ===
class UavArrow {
  constructor(start, end, color) {
    this.start = start;
    this.end = end;
    this.color = color;
    this.group = L.featureGroup();
    this.createArrow();
  }

  createArrow() {
    const dx = this.end.lng - this.start.lng;
    const dy = this.end.lat - this.start.lat;
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length === 0) return;

    const ux = dx / length;
    const uy = dy / length;
    const px = -uy;
    const py = ux;

    const headLength = length * 0.3;
    const headWidth = headLength * 0.5;

    const pointA = L.latLng(
      this.end.lat - headLength * uy + headWidth * py,
      this.end.lng - headLength * ux + headWidth * px
    );

    const pointB = L.latLng(
      this.end.lat - headLength * uy - headWidth * py,
      this.end.lng - headLength * ux - headWidth * px
    );

    this.base = L.polyline([this.start, this.end], { color: this.color, weight: 4 });
    this.head1 = L.polyline([this.end, pointA], { color: this.color, weight: 4 });
    this.head2 = L.polyline([this.end, pointB], { color: this.color, weight: 4 });

    this.group.addLayer(this.base);
    this.group.addLayer(this.head1);
    this.group.addLayer(this.head2);

    this.group.on('click', () => this.showContextMenu());
  }

  showContextMenu() {
    const confirmed = confirm("Удалить эту стрелку? (ОК — удалить, Отмена — редактировать)");
    if (confirmed) {
      drawnItems.removeLayer(this.group);
    } else {
      this.enableEditing();
    }
  }

  enableEditing() {
    const editable = L.polyline([this.start, this.end], {
      color: this.color, weight: 0, opacity: 0
    }).addTo(this.group);

    editable.editing = new L.Edit.Poly(editable, {});
    editable.editing.enable();

    editable.on('edit', () => {
      const latlngs = editable.getLatLngs();
      this.start = latlngs[0];
      this.end = latlngs[1];
      this.group.clearLayers();
      this.createArrow();
    });

    editable.on('remove', () => {
      this.group.clearLayers();
    });
  }

  addTo(layerGroup) {
    layerGroup.addLayer(this.group);
  }
}
