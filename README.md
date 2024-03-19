# Gulp
> Використовується Gulp 4

## Початок роботи

### Попередні вимоги

- Встановіть [Node.js](https://nodejs.org/)
- Встановіть [Gulp](https://gulpjs.com/) глобально, якщо ще не встановлено: `npm install --global gulp-cli`

Для роботи з цією збіркою в новому проекті, завантажте та розархівуйте весь вміст репозиторію.

Потім, перебуваючи в корені проекту, запустіть команду `npm i`, яка встановить всі залежні, що знаходяться в package.json.
Після цього ви можете використовувати будь-яку із запропонованих команд збірки (підсумкові файли потрапляють до папки __app__ кореневої директорії): <br>
`gulp` - базова команда, яка запускає складання для розробки, використовуючи browser-sync

`gulp build` - команда для продакшн-складання проекту. Усі ассети стиснуті та оптимізовані для викладення на хостинг.

## Робота з html

Завдяки плагіну __gulp-file-include__ можна розділяти html-файл на різні шаблони, які повинні зберігатися в папці __pages__. Зручно поділяти html-сторінку на секції.

> Для вставки html-частин у головний файл використовуйте `@include('partials/filename.html')`

Якщо ви хочете створити багатосторінковий сайт – копіюйте __index.html__, перейменовуйте як вам потрібно, та використовуйте.

При використанні команди `gulp build` ви отримаєте мініфікований html-код в один рядок для всіх html-файлів.

