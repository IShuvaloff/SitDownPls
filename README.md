# Интернет-магазин мебели SitDownPls (вёрстка)

Вёрстка основных страниц интернет-магазина мебели. Не является полноценным веб-приложением, основная цель проекта - вёрстка разных по уровню сложности компонентов страниц, потому линки не настроены, однако сборка осуществляется с помощью сборщика gulp. Свёрстанные страницы:

* Главная страница сайта */index.html*;
* Каталог товаров */catalog.html*;
* Карточка товара */product.html*;

## Запуск проекта

1. Установить все требуемые модули командой `npm i`;
2. Запустить сервер Gulp командой `npm run start`.

## Особенности

### Подключаемые библиотеки

1. <https://github.com/Choices-js/Choices> (Choices-js) - пользовательские выпадающие меню в карточке клиента, подключено через файлы .css/.js;
2. <https://www.npmjs.com/package/swiper> (Swiper) - слайдер для фотографий, подключен через файлы .css/.js;
3. <https://atomiks.github.io/tippyjs> (Tippy.js) - всплывающие подсказки, подключен через файлы .js;
4. <https://github.com/RobinHerbots/Inputmask> (Inputmask) - маски для ввода данных в поля input, подключен через файлы .js;
5. <https://just-validate.dev/> (JustValidate) - система валидации введенных в форму данных, подключен через файлы .js;
6. <https://refreshless.com/nouislider/> (noUISlider) - интервальный слайдер для фильтров в каталоге товаров, подключен через файлы .css/.js;

### Особенности интерфейса

1. Адаптивный дизайн и верстка Pixel-perfect;
2. Шторка меню в мобильном варианте;
3. Интервальный слайдер в каталоге;
4. Большинство кастомизированных элементов;
5. Модальные окна в карточке товара.

## План выполнения

1. Подключить Gulp:
    * настроить конфигурационный файл **gulpfild.js**;
    * сформировать схему src-директории проекта:
        * папка css (пустая);
        * папки img + img/svg (пустые);
        * папка js (+ файл **main.js**);
        * папка resources (внутри подпапка fonts для шрифтов + **favicon.svg**);
        * папка sass (+ файлы **main.sass**, **_normilize.sass**, **_reset.sass**, **_fonts.sass**, **_variables.sass**);
        * файл **index.html** с подготовленным !! (из шаблона): подключение стилей, шрифтов и иконки сайта;
    * добавить доп. файлы в основной директории:
        * **.gitignore**;
        * **gulpfile.js** (скопировать из проекта "Аттестация по Веб-вёрстке PRO");
        * **package.json**;
    * запустить `npm i` (установить все нужные node-модули);

2. Подключить шрифты:
    * можно подключить их через sass путем создания файла **srs/sass/_fonts.sass** и импортом в **src/sass/main.sass**:
        * соблюдать порядок подключения, чтобы шрифты были первыми, причем до переменных, где можно указать главный шрифт страницы;
    * а можно добавить файл **src/css/fonts.css**:
        * галп будет собирать все файлы css в один, и (возможно!) шрифты будут подключаться первыми;
    * добавить в **index.html** после `<head><title>` линки на все шрифты:
        * сначала на шрифты woff2:
        `<link rel="prefetch" href="fonts/TTFirsNeue-Regular.woff2" as="font" type="font/woff2" crossorigin>`
        * потом на шрифты woff (аналогично);
        * причем подумать, `prefetch` или все-таки `preload`, т.к. будем подключать шрифты также через `@font-face`, и будем искать там локальный шрифт, установленный ранее;

3. Разбить весь HTML-файл на мелкие независимые блоки:
    * блок с логотипом;
    * блок с инпутом + маской;
    * блок с кнопкой;
    * блок со стандартным текстом;
    * блок со стандартным заголовком;
    * блок с фотографией/изображением;
    * блок с абсолютно спозиционированным элементом (например, тегом или крестиком закрытия);
    * блок со ссылкой и SVG-картинкой внутри;
    * блок с поисковой строкой (абсолютное позиционирование);
    * блок с псевдоэлементами-иконкой;
    * более сложные блоки, состоящие из выстроенных ранее мелких блоков;
    * блоки с иконками социальных сетей для футеров и т.д.

4. способ ведения SASS:
    * в отдельный файл **_variables.sass** собрать все повторяющиеся цвета + размеры + шрифты и т.д.;
    * для мелких повторяющихся независимых блоков создать общий файл **_common.sass**;
    * для средних блоков, состоящих из мелких элементов, завести отдельные файлы **_module.sass;**
    * в каждом тематическом файле к нужному изменяющемуся блоку добавлять в конце медиазапрос `@media (max-width:...)`;
    * общий файл **main.sass** выстроить сбором общего блока и блоков модулей воедино;

5. добавить в конце все визуальные эффекты по:
    * кнопкам;
    * ссылкам;
    * иконкам;
    * инпутам;

6. план создания собственного селекта с выпадающими чекбоксами:
    * интерфейс (всем элементам обязательно давать кастомное имя и его наследников по технологии БЭМ! Это важно!):
        * создать контейнерный элемент с кастомным классом и одноименным id;
        * добавить этому контейнеру data-атрибуты:
            * data-placeholder="содержимое плейсхолдера при отсутствии выбранных значений";
            * data-value="";
              `<div class="select-check custom-select" id="custom-select" data-placeholder="Выберите..." data-value="">`
        * внутрь контейнера добавить 2 элемента: шапка (строка с выбранными значениями) с таб-индексом для возможности фокусирования и выпадающее меню:

          ```html
          <div class="select-check custom-select" id="custom-select" data-placeholder="Выберите..." data-value="">
            <div class="select-check__header custom-select__header" tabindex="0">
            <div class="select-check__body custom-select__body">
          ```

        * внутрь шапки вставить 2 элемента: строка с выбранным значением и блок с иконкой открытия/закрытия:

          ```html
          <div class="select-check__header custom-select__header" tabindex="0">
            <span class="select-check__current custom-select__current">Элемент 1</span>
            <div class="select-check__icon custom-select__icon">...</div> - внутрь добавить любой блок с изображением;>
          ```

        * внутрь выпадающего меню добавить элементы по принципу:
            * контейнер с элементом (выставить таб-индекс для фокусировки):

              ```html
              <div class="select-check__body custom-select__body">
                <div class="select-check__item custom-select__item" tabindex="0">
              ```

            * внутрь контейнера с элементом добавить блок .checkbox с чекбоксом (input с уникальным id) и подписью (label с атрибутом name, используемым в дальнейшем для вывода выбранных значений):

              ```html
              <div class="select-check__item custom-select__item" tabindex="0">
                <div class="checkbox select-check__checkbox filters-categories__checkbox">
                  <input type="checkbox" class="select-check__input custom-select__input" id="custom-select-1">
                  <label for="custom-select-1" class="select-check__label custom-select__label" name="sofa">Подпись</label>
              ```

            * разместить требуемое количество элементов;

        * *TODO*: добавить настройку при фокусировке именно инпутов - когда инпут фокусируется, через js-скрипт навешивать всему элементу меню класс выделения, а у самого контейнера с элементом `select-check__item` убрать `tabindex`, т.к. сейчас происходит двойная фокусировка - сперва элемент, затем инпут внутри него;
        * *TODO*: сделать так, чтобы при клике в document проверялась не только `target`, а еще и возможная svg картинка. Т.к. иначе при таком таргете не закрывается менюшка. Возможно, лучше переделать на бэкграунд имэдж, тогда внутри селекта не будет никаких неуправляемых свг-объектов;
        * *TODO*: добавлять единый общий класс для всех селектов - и инпутов, и чеков, чтобы не перебирать дважды цикл всех элементов в `document.onclick`;

    * *TODO*: тело (организация обработчиков, см. **catalogElements.js**):
        * создать функцию, которая будет добавлять содержимое в блок по передаваемому списку элементов;
        * будет назначать им имена в соответствии с кодом класса селекта, например `#custom-select__...`;
        * при загрузке добавить выбранные элементы в шапку инпута вместо `placeholder`, либо, если ничего не выбрано, оставить `placeholder` (нужна инициализация объекта при создании с уже выбранными по умолчанию элементами);
        * добавить обработку кликов на шапке Enter/Space (нужно, чтобы меню разворачивалось);
