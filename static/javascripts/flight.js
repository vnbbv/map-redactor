document.getElementById('flightHistoryBtn').addEventListener('click', () => {
  console.log("Кнопка История нажата");
  fetch('/history')
    .then(res => {
      console.log("Ответ сервера:", res);
      return res.json();
    })
    .then(filesInfo => {
      console.log("Список файлов истории:", filesInfo);
      showHistoryModal(filesInfo);
    })
    .catch(err => {
      console.error(err);
      alert('Ошибка загрузки списка истории');
    });
});

function showHistoryModal(filesInfo) {
  const modal = document.createElement('div');
  modal.className = 'modal history-modal';

  modal.innerHTML = `
    <div class="modal-content">
      <h3>История полётов</h3>
      <ul id="history-list"></ul>
      <button class="button button-outline" id="closeHistoryModal">Закрыть</button>
    </div>
  `;
  document.body.appendChild(modal);

  const list = modal.querySelector('#history-list');

  filesInfo.forEach(fileInfo => {
    const file = fileInfo.name;
    const li = document.createElement('li');
    li.textContent = file;

    const loadBtn = document.createElement('button');
    loadBtn.className = 'button';
    loadBtn.textContent = 'Загрузить';
    loadBtn.addEventListener('click', () => {
      loadHistory(file);
      document.body.removeChild(modal);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'button button-clear';
    deleteBtn.textContent = 'Удалить';
    deleteBtn.addEventListener('click', () => {
      if (!confirm(`Удалить файл ${file}?`)) return;
      fetch(`/history/${file}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
          if (data.status) {
            alert('Удалено');
            li.remove();
          } else {
            alert('Ошибка удаления');
          }
        })
        .catch(err => {
          console.error(err);
          alert('Ошибка сети при удалении');
        });
    });

    li.appendChild(loadBtn);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });

  modal.querySelector('#closeHistoryModal').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
}

function loadHistory(filename) {
  fetch(`/history/${filename}`)
    .then(res => res.json())
    .then(geojson => {
      const layer = L.geoJSON(geojson, {
        style: feature => ({
          color: feature.properties.color || '#f00',
          weight: feature.properties.weight || 3,
          opacity: feature.properties.opacity || 1
        })
      });
      drawnItems.clearLayers();
      drawnItems.addLayer(layer);
      map.fitBounds(layer.getBounds());
    })
    .catch(err => {
      console.error(err);
      alert('Ошибка загрузки истории');
    });
}
