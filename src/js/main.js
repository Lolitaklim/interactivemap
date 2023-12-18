// карта с центром спб и уровнем масштабирования 12
const map = L.map('map').setView([59.9343, 30.3351], 12);
// массив для хранения информации о маркерах
const markers = [];
// берем из localStorage ранее сохраненные маркеры.
const savedMarkers = JSON.parse(localStorage.getItem('markers')) || [];

// добавление слоя карты
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// создание иконки маркера
const createMarkerIcon = (color) => L.icon({
    iconUrl: `./assets/img/${color}.svg` || './assets/img/violet.svg',
    shadowUrl: './assets/img/shadow.png',
    iconSize: [38, 95],
    shadowSize: [60, 20],
    iconAnchor: [22, 94],
    shadowAnchor: [33, 22],
    popupAnchor: [-3, -76]
});

// обновление localStorage
const updateLocalStorage = () => {
    const serializableMarkers = markers.map(({ lat, lng, type, name, description, color }) => ({ lat, lng, type, name, description, color }));
    localStorage.setItem('markers', JSON.stringify(serializableMarkers));
};

// добавление маркера на карту
const addMarker = (lat, lng, type, name, description, color) => {
    const marker = L.marker([lat, lng], { draggable: true, icon: createMarkerIcon(color) }).addTo(map);

    marker.bindPopup(`<b>${name}</b><br>${description}<br>Тип: ${type}<br>
        <button class="btn" onclick="editMarker(${lat}, ${lng})">Изменить</button>
        <button class="btn" onclick="removeMarker(${lat}, ${lng})">Удалить</button>`);

    // добавляем обработчик события для обновления координат после перемещения
    marker.on('dragend', (event) => {
        const { lat, lng } = event.target.getLatLng();
        updateMarkerPosition(lat, lng, marker);
    });

    markers.push({ lat, lng, type, name, description, color, marker });
    updateLocalStorage();
}

// добавление маркеров при загрузки страницы
savedMarkers.forEach(marker => {
    addMarker(marker.lat, marker.lng, marker.type, marker.name, marker.description, marker.color);
});

// окно с формой при клике на карту
map.on('click', function (e) {
    const popupContent = `<form id="marker-form">
            <div class="form-input">
                <label class="label" for="type">Тип:</label>
                <input class="input-map" type="text" id="type" required><br>
            </div>
            <div class="form-input">
                <label class="label" for="name">Название:</label>
                <input class="input-map" type="text" id="name" required><br>
            </div>
            <div class="form-input">
                <label class="label" for="description">Описание:</label>
                <textarea class="input-map" id="description"></textarea><br>
            </div>
            <button class="btn" type="button" onclick="addMarkerFromForm(${e.latlng.lat}, ${e.latlng.lng})">Добавить маркер</button>
        </form>`;
    L.popup().setLatLng(e.latlng).setContent(popupContent).openOn(map);
});

// добавление маркера с данными из формы
const addMarkerFromForm = function (lat, lng) {
    const type = document.getElementById('type').value;
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    addMarker(lat, lng, type, name, description, 'violet'); 
    map.closePopup();
}

// редактирование маркера
const editMarker = function (lat, lng) {
    const selectedMarker = markers.find(marker => marker.lat === lat && marker.lng === lng);

    if (selectedMarker) {
        const popupContent = `<form id="edit-marker-form">
                <div class="form-input">
                    <label class="label" for="type">Тип:</label>
                    <input class="input-map" type="text" id="edit-type" value="${selectedMarker.type}" required><br>
                </div>
                <div class="form-input">
                    <label class="label" for="name">Название:</label>
                    <input class="input-map" type="text" id="edit-name" value="${selectedMarker.name}" required><br>
                </div>
                <div class="form-input">
                    <label class="label" for="description">Описание:</label>
                    <textarea class="input-map" id="edit-description">${selectedMarker.description}</textarea><br>
                </div>
                <div class="form-input">
                    <label class="label" for="color">Цвет маркера:</label>
                    <select class="input-map" id="edit-color">
                        <option value="violet" ${selectedMarker.color === 'violet' ? 'selected' : ''}>Розовый</option>
                        <option value="green" ${selectedMarker.color === 'green' ? 'selected' : ''}>Зеленый</option>
                        <option value="red" ${selectedMarker.color === 'red' ? 'selected' : ''}>Красный</option>
                        <option value="orange" ${selectedMarker.color === 'orange' ? 'selected' : ''}>Желтый</option>
                    </select><br>
                </div>
                <button class="btn" type="button" onclick="saveEditedMarker(${selectedMarker.lat}, ${selectedMarker.lng})">Изменить</button>
            </form>`;

        selectedMarker.marker.closePopup();
        L.popup().setLatLng([lat, lng]).setContent(popupContent).openOn(map);
    }
}

// сохранение отредактированного маркера
const saveEditedMarker = function (lat, lng) {
    const selectedMarker = markers.find(marker => marker.lat === lat && marker.lng === lng);

    if (selectedMarker) {
        selectedMarker.type = document.getElementById('edit-type').value;
        selectedMarker.name = document.getElementById('edit-name').value;
        selectedMarker.description =  document.getElementById('edit-description').value;
        selectedMarker.color = document.getElementById('edit-color').value;

        selectedMarker.marker.setIcon(createMarkerIcon(document.getElementById('edit-color').value));
        selectedMarker.marker.setPopupContent(`<b>${selectedMarker.name}</b><br>${selectedMarker.description}<br>Тип: ${selectedMarker.type}<br>
            <button class="btn" onclick="editMarker(${selectedMarker.lat}, ${selectedMarker.lng})">Изменить</button>
            <button class="btn" onclick="removeMarker(${selectedMarker.lat}, ${selectedMarker.lng})">Удалить</button>`);

        updateLocalStorage();
        map.closePopup();
    }
}

// удаление маркера по координатам
const removeMarker = (lat, lng) => {
    const markerIndex = markers.findIndex(marker => marker.lat === lat && marker.lng === lng);

    if (markerIndex !== -1) {
        map.removeLayer(markers[markerIndex].marker);
        markers.splice(markerIndex, 1);
        updateLocalStorage();
    }
}

// фильтрация по описанию
const filterMarkers = () => {
    const filterText = document.getElementById('filter').value.toLowerCase();

    markers.forEach(marker => {
        const markerDescription = marker.description.toLowerCase();

        if (markerDescription.includes(filterText)) {
            marker.marker.addTo(map);
        } else {
            map.removeLayer(marker.marker);
        }
    });
}
    
// обновление координат после перемещения маркера
const updateMarkerPosition = (lat, lng, marker) => {
    const updatedMarker = markers.find(m => m.marker === marker);

    if (updatedMarker) {
        updatedMarker.lat = lat;
        updatedMarker.lng = lng;
        updateLocalStorage();
    }
}
