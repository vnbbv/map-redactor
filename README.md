# map-redactor

A web application for planning and editing routes on an interactive map.
You can use it for UAV (drone) flight paths, walking tours, travel planning, and more.
Built with Leaflet.js and Flask.

## Features

* Draw lines and arrows on the map
* Change colors of lines and arrows
* Save the map as a PNG with caption
* Save, load, and delete route history in GeoJSON format
* Dark theme and minimalist interface

## Getting Started

### Prerequisites

* Python 3.8+
* pip

### Installation

```bash
git clone https://github.com/your-username/map-redactor.git
cd map-redactor

pip install flask
```

### Run

```bash
python app.py
```

Then open [http://localhost:5000](http://localhost:5000) in your browser.

## Project Structure

```
.
├── app.py                  # Flask backend
├── templates/index.html    # Main page
├── static/
│   ├── javascripts/        # JS files
│   ├── stylesheets/        # CSS files
│   └── images/
├── flight-history/         # Saved GeoJSON files
```

## License

MIT

---

# map-redactor

Веб-приложение для планирования и редактирования маршрутов на интерактивной карте.
Подходит для маршрутов БПЛА, прогулок, путешествий и любых других траекторий.
Создано на Leaflet.js и Flask.

## Возможности

* Рисование линий и стрелок на карте
* Настройка цветов линий и стрелок
* Сохранение карты в PNG с подписью
* Сохранение, загрузка и удаление истории маршрутов в формате GeoJSON
* Тёмная тема и минималистичный интерфейс

## Установка и запуск

### Требования

* Python 3.8+
* pip

### Установка

```bash
git clone https://github.com/your-username/map-redactor.git
cd map-redactor

pip install flask
```

### Запуск

```bash
python app.py
```

После этого откройте в браузере [http://localhost:5000](http://localhost:5000).

## Структура проекта

```
.
├── app.py                  # Flask бэкенд
├── templates/index.html    # Главная страница
├── static/
│   ├── javascripts/        # JS файлы
│   ├── stylesheets/        # CSS файлы
│   └── images/
├── flight-history/         # Сохранённые GeoJSON
```

## Лицензия

MIT


