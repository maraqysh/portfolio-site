# PKCODE — портфолио

Статический сайт-портфолио и три демонстрационных проекта:

Production: https://pkvisitcard.netlify.app/

- `/` — главная страница портфолио;
- `/aurora/` — студия дизайна интерьеров;
- `/clinic/` — частная клиника;
- `/coffee/` — городская кофейня.

## Локальный запуск

Из папки проекта:

```bash
python3 -m http.server 8000
```

После запуска сайт доступен по адресу `http://localhost:8000/`.

## Netlify

- Build command: оставить пустым.
- Publish directory: `.`

Все проекты используют обычные HTML, CSS и JavaScript, поэтому сборка не требуется.

Production-конфигурация хранится в `netlify.toml`, правила безопасности и кеширования — в `_headers`. Файлы `robots.txt` и `sitemap.xml` используют production-адрес Netlify.
