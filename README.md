# Название проекта

[![Angular Version](https://img.shields.io/badge/Angular-v19.2.0-red.svg)](https://angular.io/)
[![.NET Version](https://img.shields.io/badge/.NET-v8.0-blue.svg)](https://dotnet.microsoft.com/)
[![PostgreSQL Version](https://img.shields.io/badge/PostgreSQL-v15.0-blue.svg)](https://www.postgresql.org/)

Краткое описание вашего проекта (1-2 абзаца). Опишите основное назначение приложения и ключевые функции.

## 📌 Оглавление

-   [Технологии](#-технологии)
-   [Предварительные требования](#-предварительные-требования)
-   [Установка и настройка](#-установка-и-настройка)
-   [Запуск проекта](#-запуск-проекта)
-   [Структура проекта](#-структура-проекта)
-   [API Endpoints](#-api-endpoints)
-   [Развертывание](#-развертывание)
-   [Лицензия](#-лицензия)

## 🚀 Технологии

**Основной стек:**

-   **Frontend**: Angular 19+
-   **Backend**: ASP.NET Core Web API (.NET 8)
-   **Database**: PostgreSQL 15+
-   **ORM**: Entity Framework Core 8

**Дополнительные технологии:**

-   Docker (опционально)
-   Swagger/OpenAPI для документации API
-   [Другие технологии, если есть]

## 🛠 Предварительные требования

Перед началом работы убедитесь, что у вас установлены:

| Компонент   | Версия   | Ссылка                        |
| ----------- | -------- | ----------------------------- |
| Node.js     | 22.x+    | https://nodejs.org/           |
| Angular CLI | 19.x+    | https://angular.io/cli        |
| .NET SDK    | 8.0      | https://dotnet.microsoft.com/ |
| PostgreSQL  | 15.x+    | https://www.postgresql.org/   |
| (Другие)    | (Версия) | (Ссылка)                      |

## 🛠 Установка и настройка

### 1. Клонирование репозитория

```bash
git clone https://github.com/yourusername/yourproject.git
cd yourproject
```

### 2. Настройка фронтенда (Angular)

```bash
cd client
npm install
```

### 3. Настройка бэкенда (C#)

```bash
cd ../server
dotnet restore
```

Настройте подключение к БД в appsettings.json:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=yourdb;Username=postgres;Password=yourpassword;"
  }
}
```

### 4. Настройка базы данных

- Создайте БД в PostgreSQL

- Примените миграции:

```bash
dotnet ef database update
```

## 🏃 Запуск проекта

Development режим:

- Запустите бэкенд:

```bash
cd server
dotnet run
```

- Запустите фронтенд:

```bash
cd ../client
ng serve
```

## Доступ:

- Frontend: http://localhost:4200

- Backend API: http://localhost:5000

- Swagger UI: http://localhost:5000/swagger

## 📂 Структура проекта

project-root/
├── client/                  # Angular приложение
│   ├── src/                 # Исходники фронтенда
│   └── ...
├── server/                  # .NET решение
│   ├── Controllers/         # API контроллеры
│   ├── Models/              # Модели данных
│   ├── Migrations/          # Миграции БД
│   └── ...
├── docker/                  # Docker конфигурации (опционально)
├── docs/                    # Документация
└── README.md                # Этот файл
