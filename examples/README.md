# Example

Демо-приложение показывает SVG и метаданные из опубликованного пакета `@russian-flags/samara-oblast`.

## Запуск

```bash
cd examples
npm install
npm run dev
```

После запуска Vite откроет страницу в браузере. Если браузер не открылся автоматически, открой адрес:

```text
http://127.0.0.1:5173/
```

Не открывай `index.html` двойным кликом: npm-импорты и Vite-модули работают через dev-сервер.

## Что проверяет пример

- импорт списка городов из `@russian-flags/samara-oblast`;
- импорт SVG из `@russian-flags/samara-oblast/flags/<slug>.svg`;
- отображение списка городов;
- открытие флага в модальном окне.

## Сборка

```bash
npm run build
```

Собранные файлы появятся в `examples/dist`.

## Preview сборки

```bash
npm run preview
```

## Запуск из корня репозитория

Из корня проекта можно запустить те же команды через `--prefix`:

```bash
npm --prefix examples install
npm run example:dev
```

Для проверки production-сборки:

```bash
npm run example:build
```
