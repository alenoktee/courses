# courses# Руководство по запуску проекта

## Необходимые компоненты

### Для клиентской части (Angular)
- Node.js (версия 16.x или выше)
- npm (включен в установку Node.js)
- Angular CLI (версия 19.x)

### Для серверной части (ASP.NET Core)
- .NET SDK (версия 8.0)
- PostgreSQL (версия 14.x или выше)

## Настройка и запуск проекта

### Настройка базы данных
1. Установите PostgreSQL
2. Создайте базу данных PostgreSQL
3. Обновите строку подключения в `server/appsettings.json` при необходимости:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Host=localhost;Port=5432;Database=postgres;Username=postgres;Password=postgres"
   }
   ```

### Запуск серверной части (ASP.NET Core)
1. Откройте терминал и перейдите в директорию `server`:
   ```
   cd server
   ```
2. Восстановите пакеты NuGet:
   ```
   dotnet restore
   ```
3. Примените миграции базы данных:
   ```
   dotnet ef database update
   ```
4. Запустите сервер:
   ```
   dotnet run
   ```
5. Сервер будет доступен по адресу: `https://localhost:7135` или `http://localhost:5231`

### Запуск клиентской части (Angular)
1. Откройте новый терминал и перейдите в директорию `client`:
   ```
   cd client
   ```
2. Установите зависимости:
   ```
   npm install
   ```
3. Запустите клиентское приложение:
   ```
   npm start
   ```
   или
   ```
   ng serve
   ```
4. Клиентское приложение будет доступно по адресу: `http://localhost:4200`

## Аутентификация Google
Для работы аутентификации через Google необходимо использовать существующие ключи в `appsettings.json` или создать свои собственные в [Google Cloud Console](https://console.cloud.google.com/).

## Проверка работоспособности
После запуска обеих частей проекта откройте браузер и перейдите по адресу: `http://localhost:4200`. Вы должны увидеть главную страницу приложения с возможностью входа через Google.
