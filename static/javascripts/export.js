document.getElementById('savePngBtn').addEventListener('click', () => {
  showModal();
});

document.getElementById('saveHistoryBtn').addEventListener('click', () => {
  const geojson = {
    type: "FeatureCollection",
    features: []
  };

  drawnItems.eachLayer(layer => {
    if (layer instanceof L.FeatureGroup) {

      layer.eachLayer(subLayer => {
        if (subLayer.toGeoJSON) {
          const json = subLayer.toGeoJSON();
          json.properties = json.properties || {};
          json.properties.color = subLayer.options.color || '#000';
          json.properties.weight = subLayer.options.weight || 3;
          json.properties.opacity = subLayer.options.opacity || 1.0;
          geojson.features.push(json);
        }
      });
    } else if (layer instanceof L.Polyline) {
        
      const json = layer.toGeoJSON();
      json.properties = json.properties || {};
      json.properties.color = layer.options.color || '#000';
      json.properties.weight = layer.options.weight || 3;
      json.properties.opacity = layer.options.opacity || 1.0;
      geojson.features.push(json);
    }
  });

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const filename = prompt("Введите имя файла для сохранения истории", `flight-${dateStr}.geojson`);
  if (!filename) return;

  fetch(`/history/${filename}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(geojson)
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "saved") {
      alert("История сохранена");
    } else {
      alert("Ошибка при сохранении");
    }
  })
  .catch(err => {
    console.error(err);
    alert("Ошибка сети при сохранении");
  });
});

document.getElementById('modal-save-btn').addEventListener('click', () => {
  const filename = document.getElementById('modal-filename').value || 'Карта';
  const caption = document.getElementById('modal-caption').value;

  hideModal();

  const watermark = document.createElement("div");
  watermark.className = "watermark";
  watermark.innerText = caption || filename;

  const mapContainer = document.getElementById('map');
  mapContainer.appendChild(watermark);

  domtoimage.toBlob(mapContainer)
  .then(function (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename + ".png";
      a.click();
      URL.revokeObjectURL(url);
      mapContainer.removeChild(watermark);
  });
});

document.getElementById('modal-cancel-btn').addEventListener('click', hideModal);

function showModal() {
  document.getElementById('modal').classList.remove('hidden');
}

function hideModal() {
  document.getElementById('modal').classList.add('hidden');
}
