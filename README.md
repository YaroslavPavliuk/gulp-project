# Gulp
> Використовується Gulp 4

## Початок роботи

### Попередні вимоги

- Встановіть [Node.js](https://nodejs.org/)
- Встановіть [Gulp](https://gulpjs.com/docs/en/getting-started/quick-start) глобально, якщо ще не встановлено: `npm install --global gulp-cli`

Для роботи з цією збіркою в новому проекті, завантажте та розархівуйте весь вміст репозиторію.

Потім, перебуваючи в корені проекту, запустіть команду `npm i`, яка встановить всі залежні, що знаходяться в package.json.
Після цього ви можете використовувати будь-яку із запропонованих команд збірки (підсумкові файли потрапляють до папки __app__ кореневої директорії): <br>

`gulp` - базова команда, яка запускає складання для розробки, використовуючи browser-sync

`gulp build` - команда для продакшн-складання проекту. Усі ассети стиснуті та оптимізовані для викладення на хостинг.

`gulp zip` - команда збирає ваш готовий код у zip-архів в папці __build__.


# Структура папок та файлів

```
├── app/                          # Папка де йде розробка (створюється після запуску команди `gulp`) 
├── build/                        # Готовий проект (створюється після запуску команди `gulp build`) 
│   ├── name.zip                  # Проект у zip (створюється після запуску команди `gulp zip`)
├── src/                          # Ресурси
│   ├── fonts                     # Папка для зберігання шрифтів
│   ├── img                       # Папка для зберігання картинок
│   ├── js                        # Папка для зберігання скриптів
│   ├── pages                     # Папка для зберігання блоків html
│   ├── scss                      # Папка для зберігання стилів
│   └── index.html                # Головний html-файл
└── .gitignore                    # файл з налаштуваннями git
└── gulpfile.js                   # файл з налаштуваннями Gulp
└── package.json                  # головний файл пакетів
└── README.md                     # документація
```

# Робота з html

Завдяки плагіну __gulp-file-include__ можна розділяти html-файл на різні шаблони, які повинні зберігатися в папці __pages__. Зручно поділяти html-сторінку на секції.

> Для вставки html-частин у головний файл використовуйте `@include('pages/filename.html')`

Якщо ви хочете створити багатосторінковий сайт – копіюйте __index.html__, перейменовуйте як вам потрібно, та використовуйте.

При використанні команди `gulp build` ви отримаєте мініфікований html-код в один рядок для всіх html-файлів.

# Робота з CSS

У складання використовується препроцесор __sass__ у синтаксисі __scss__.

Стилі, написані в __block__, вони автоматично підключатимуться до __main.scss__.

Щоб підключити сторонні css-файли (бібліотеки) - покладіть їх у папку __libs__, вони автоматично підключатимуться.

> __Важливо__ не пишіть код у main.scss, а пишіть створюючи блоки в папці __scss/block__

Якщо ви хочете створити свій міксин - робіть це в папці __mixins__, вони автоматично підключатимуться.

> Для підключення файлів css використовуйте директиву `@import`

У підсумковій папці __app/css__ створюються два файли: <br> __main.min.css__ - для стилів сторінки, <br> __main.min.css.map__ - для знаходження потрібного елемента при розробці dev__tools в брузері.

При використанні команди `gulp build` ви отримаєте мініфікований css-код в один рядок для всіх css-файлів.

# Робота з JS

Для складання JS-коду використовується webpack.

Так само використовується Babel (Підтримка нового JS у старих браузерах).

## Робота з різними сторінками

Також у головній папці __js/block__ зберігайте файли кожної сторінки. Наприклад, index.js. Також не забувайте прописувати шлях у файл __webpack.config.js__(У задачі entry. З початку пишемо назву файлу потім пишемо шлях до нього. Є закоментована підказка).

При запуску команди `gulp` усі файли сторінок будуть подавати до головної папки __app/js__.

> __Увага__ не забувайте перезапускати завдання `gulp` після того як ви прописали нові сторінки у файлі __webpack.config.js__.

## Робота з JS модулями

Можна підключати свої модулі в папці __modules__ підксказка як підключати є у файлі __/modules/hello.js__ та __/js/main.js__.

## Робота з NPM модулями

Завдяки пакетам style-loader та css-loader можна без проблем підключати інші модулі, наприклад, як swiper. Дотримуйтеся вказівок на сторінці, як можна правильно підключити. Стилі для модулів підключаються автоматично.

При використанні команди `gulp build` ви отримаєте мініфікований js-код в один рядок для всіх js-файлів.

# Робота з шрифтами

У збірці реалізовано підтримку лише формату __woff2__ (це означає, що в міксині підключення шрифтів використовується тільки даний формат).

У збірці підтримується автоматична конвертація шрифтів будь-яких форматів (eot, ttf, woff)

Перш ніж використовувати команду `gulp`, завантажте шрифти будь-яких форматів у папку __src/fonts/__. Після використання шрифти автоматично конвертуються в woff2 і прописуються. Вам лише потрібно прописати потрібний `font-family`.

У папці __src/scss/mixins/_font-face.sccs__ знаходиться файл, він автоматично прописує всі конвертовані шрифти у файл __src/scss/mixins/_font-face.sccs__.

# Робота з зображеннями

Будь-які зображення кладіть у папку __img__.

При використанні команди `gulp build` ви отримаєте мініфіковані зображення в підсумковій папці __img__.

У збірці доступна підтримка формату __webp__. Він автоматично прописуватиметься при використанні команди збірки проекту (як звичайні зображення так і фонові).