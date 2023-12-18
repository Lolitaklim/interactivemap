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
    iconUrl: `https://leafletjs.com/examples/custom-icons/leaf-${color}.png` || 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
    shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
    iconSize: [38, 95],
    shadowSize: [50, 64],
    iconAnchor: [22, 94],
    shadowAnchor: [4, 62],
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

    marker.bindPopup(`<b>${name}</b><br>${description}<br>Type: ${type}<br>
        <button onclick="editMarker(${lat}, ${lng})">Edit</button>
        <button onclick="removeMarker(${lat}, ${lng})">Remove</button>`);

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
            <label for="type">Type:</label>
            <input type="text" id="type" required><br>
            <label for="name">Name:</label>
            <input type="text" id="name" required><br>
            <label for="description">Description:</label>
            <textarea id="description"></textarea><br>
            <button type="button" onclick="addMarkerFromForm(${e.latlng.lat}, ${e.latlng.lng})">Add Marker</button>
        </form>`;
    L.popup().setLatLng(e.latlng).setContent(popupContent).openOn(map);
});

// добавление маркера с данными из формы
const addMarkerFromForm = function (lat, lng) {
    const type = document.getElementById('type').value;
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    addMarker(lat, lng, type, name, description, 'green'); 
    map.closePopup();
}

// редактирование маркера
const editMarker = function (lat, lng) {
    const selectedMarker = markers.find(marker => marker.lat === lat && marker.lng === lng);

    if (selectedMarker) {
        const popupContent = `<form id="edit-marker-form">
                <label for="type">Type:</label>
                <input type="text" id="edit-type" value="${selectedMarker.type}" required><br>
                <label for="name">Name:</label>
                <input type="text" id="edit-name" value="${selectedMarker.name}" required><br>
                <label for="description">Description:</label>
                <textarea id="edit-description">${selectedMarker.description}</textarea><br>
                <label for="color">Marker Color:</label>
                <select id="edit-color">
                    <option value="green" ${selectedMarker.color === 'green' ? 'selected' : ''}>Green</option>
                    <option value="red" ${selectedMarker.color === 'red' ? 'selected' : ''}>Red</option>
                    <option value="orange" ${selectedMarker.color === 'orange' ? 'selected' : ''}>Orange</option>
                </select><br>
                <button type="button" onclick="saveEditedMarker(${selectedMarker.lat}, ${selectedMarker.lng})">Save</button>
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
        selectedMarker.marker.setPopupContent(`<b>${selectedMarker.name}</b><br>${selectedMarker.description}<br>Type: ${selectedMarker.type}<br>
            <button onclick="editMarker(${selectedMarker.lat}, ${selectedMarker.lng})">Edit</button>
            <button onclick="removeMarker(${selectedMarker.lat}, ${selectedMarker.lng})">Remove</button>`);

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
