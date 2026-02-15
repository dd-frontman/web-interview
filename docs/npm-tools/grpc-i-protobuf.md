> [!tip] Связанные темы
>
> - OpenAPI, Swagger, Protobuf
> - Сети, HTTP и CORS
> - Nuxt / Nitro

## gRPC и Protobuf простыми словами

- **Protobuf** — формат и язык описания структур данных (`.proto`).
- **gRPC** — RPC-фреймворк, который использует Protobuf для контрактов и сообщений.

Идея похожа на "вызываю функцию на удаленном сервере", а не "сам руками собираю REST-запрос".

## Что обычно хранится в `.proto`

1. `message` — структуры данных
2. `service` — методы сервиса
3. типы полей и их номера

```proto
syntax = "proto3";

package users.v1;

message GetUserRequest {
  int64 id = 1;
}

message User {
  int64 id = 1;
  string name = 2;
}

service UserService {
  rpc GetUser(GetUserRequest) returns (User);
}
```

Из этого файла генератор кода создаст типы/клиент/серверные интерфейсы на нужном языке.

## Типы RPC в gRPC

1. **Unary**  
   один запрос -> один ответ
2. **Server streaming**  
   один запрос -> поток ответов
3. **Client streaming**  
   поток запросов -> один ответ
4. **Bidirectional streaming**  
   поток запросов <-> поток ответов

## Пример unary-вызова (псевдо)

```ts
const client = new UserServiceClient("https://api.example.com");
const user = await client.getUser({ id: 42 });
console.log(user.name);
```

## Почему это любят в бэкенде

- строгие контракты и типы
- компактная бинарная передача
- генерация кода вместо ручного DTO-кода
- удобно для микросервисов

## Что на фронтенде

В браузере обычно используют **gRPC-Web**, потому что нативный gRPC-протокол не работает в browser напрямую так же, как в backend-средах.

Частый прод-паттерн:

- внутри backend: gRPC между сервисами
- наружу для браузера: REST/GraphQL или gRPC-Web через proxy

## Protobuf best practices

1. Не переиспользуйте номера полей.
2. Для удаленных полей используйте `reserved`.
3. Новые поля добавляйте без ломки старых клиентов.
4. Держите версионирование пакетов/сервисов явным (`v1`, `v2`).

## Когда выбрать gRPC, а когда REST

- **gRPC**: внутренние сервисы, строгая типизация, high-throughput, стриминг
- **REST/OpenAPI**: публичные API, простая интеграция, дебаг "из браузера"

## Официальная документация

- gRPC: Introduction  
  https://grpc.io/docs/what-is-grpc/introduction/
- gRPC: Core concepts  
  https://grpc.io/docs/what-is-grpc/core-concepts/
- Protocol Buffers: Overview  
  https://protobuf.dev/overview/
- Protocol Buffers: Proto3 language guide  
  https://protobuf.dev/programming-guides/proto3/
