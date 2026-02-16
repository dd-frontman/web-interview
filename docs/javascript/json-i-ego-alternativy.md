## JSON и его альтернативы

`JSON` — основной формат обмена данными в вебе, но не единственный.
Ниже — когда использовать JSON, а когда лучше взять альтернативу.

## Почему JSON стал стандартом

- компактный и читаемый;
- нативно поддерживается в JavaScript (`JSON.parse`, `JSON.stringify`);
- отлично подходит для REST API и большинства frontend/backend сценариев.

## Основные альтернативы JSON

### 1. XML

Подходит для legacy-интеграций, SOAP и документ-ориентированных систем.

```xml
<user>
	<id>1</id>
	<name>Anna</name>
</user>
```

### 2. YAML

Часто используется не для runtime API, а для конфигов (`docker-compose`, CI/CD).

```yaml
user:
  id: 1
  name: Anna
```

### 3. Protobuf

Бинарный формат. Обычно используется с gRPC, когда важны скорость и размер payload.

```proto
message User {
  int32 id = 1;
  string name = 2;
}
```

### 4. MessagePack

Тоже бинарная сериализация. Логика похожа на JSON, но данные передаются компактнее.

### 5. CSV

Подходит для табличных данных (экспорт/импорт), но плохо выражает вложенные структуры.

## Сравнение

| Формат | Плюсы | Минусы | Типичные кейсы |
| --- | --- | --- | --- |
| JSON | Простой, кросс-языковой, стандарт де-факто для web API | Не самый компактный | REST API, frontend-backend |
| XML | Сильные enterprise-интеграции, XSD-схемы | Многословный | SOAP, legacy-системы |
| YAML | Читаемый для человека | Чувствителен к отступам, не лучший для API payload | Конфиги, инфраструктура |
| Protobuf | Очень компактный и быстрый, строгая схема | Нужна codegen-инфраструктура | gRPC, high-load сервисы |
| MessagePack | Компактнее JSON, простой переход | Требует поддержку кодеков | Realtime/сети, где важен размер |
| CSV | Прост для таблиц | Нет вложенности, слабая типизация | Импорт/экспорт отчетов |

## Что выбирать в frontend-проектах

- По умолчанию: **JSON**.
- Если корпоративная/устаревшая интеграция: **XML**.
- Если высоконагруженные сервисы и gRPC: **Protobuf**.
- Если нужен компактный бинарный обмен без gRPC: **MessagePack**.
- Для конфигов: **YAML**.
- Для табличного обмена: **CSV**.

## Практический вывод

Для большинства задач веб-разработки JSON остается лучшим компромиссом: просто, удобно и поддерживается везде.

## Официальные источники

- RFC 8259: JSON Data Interchange Format  
  https://datatracker.ietf.org/doc/html/rfc8259
- MDN: JSON  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
- W3C: XML 1.0  
  https://www.w3.org/TR/xml/
- yaml.org: YAML specification  
  https://yaml.org/spec/
- Protocol Buffers docs  
  https://protobuf.dev/overview/
- MessagePack specification  
  https://github.com/msgpack/msgpack/blob/master/spec.md

---

> [!tip] Связанные темы
>
> - [Сети, HTTP и CORS](/brauzery/seti-http-i-cors)
> - [OpenAPI, Swagger, Protobuf](/npm-tools/openapi-swagger-protobuf)
> - [gRPC и Protobuf](/npm-tools/grpc-i-protobuf)
