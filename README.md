# Руководство по запуску проекта

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

### Настройка appsettings.json (/server)
1. Зайдите в файл appsettings.json
3. Обновите строку, добавив сюда свои данные из Google Cloud Console:
   ```json
   "Google": {
      "ClientId": "ЗАТЫЧКА",
      "ClientSecret": "ЗАТЫЧКА"
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

# Полное руководство по разработке проекта

## Серверная часть (ASP.NET Core)

### Структура проекта

```
server/
├── Controllers/          # Контроллеры API
├── Data/                 # Классы работы с базой данных
├── Migrations/           # Миграции базы данных
├── Models/               # Модели данных
├── Properties/           # Конфигурации запуска
├── appsettings.json      # Основные настройки приложения
├── Program.cs            # Точка входа и конфигурация приложения
└── backend.csproj        # Файл проекта
```

### Подробное описание компонентов

#### 1. Контроллеры (`Controllers/`)

**AuthController.cs** - обработка аутентификации и авторизации:
- `GoogleLogin()`: Обработка OAuth2 аутентификации через Google
- `Register()`: Регистрация новых пользователей
- Вспомогательные методы:
  - `ExchangeCodeForTokenAsync()`: Обмен кода авторизации на токен доступа
  - `GetGoogleUserInfoAsync()`: Получение информации о пользователе от Google
  - `GenerateJwtToken()`: Генерация JWT токена для аутентификации
  - `HashPassword()`: Хеширование паролей

**UserController.cs** - управление пользователями:
- `GetUsers()`: Получение списка всех пользователей
- `GetUser(id)`: Получение информации о конкретном пользователе
- `AddUser(user)`: Добавление нового пользователя
- `TestConnection()`: Проверка работоспособности API

#### 2. Модели данных (`Models/`)

**User.cs** - основная модель пользователя:
- Содержит все поля для хранения информации о пользователе
- Включает связь с другими сущностями через навигационные свойства

**AuthModels.cs** - модели для аутентификации:
- `GoogleAuthRequest`: Модель запроса авторизации через Google
- `AuthResponse`: Модель ответа с токеном и данными пользователя
- `JwtSettings`: Настройки JWT токена

**Group.cs**, **GroupStudent.cs**, **GroupTeacher.cs** - модели для работы с группами:
- Описывают структуру учебных групп и связи между участниками

#### 3. Работа с базой данных (`Data/`)

**AppDbContext.cs** - контекст базы данных:
- Определяет DbSet для всех моделей
- Настраивает связи между таблицами в `OnModelCreating()`
- Конфигурирует индексы и ограничения

#### 4. Конфигурация (`Program.cs` и `appsettings.json`)

**Program.cs**:
- Настройка CORS политики
- Конфигурация аутентификации (JWT Bearer)
- Регистрация сервисов (DbContext, HttpClient)
- Настройка маршрутизации и middleware

**appsettings.json**:
- Строка подключения к PostgreSQL
- Настройки JWT
- Креденшелы Google OAuth
- Настройки логирования

### Детальное описание методов

#### AuthController

**GoogleLogin()**:
1. Получает код авторизации от клиента
2. Обменивает его на токен доступа
3. Получает информацию о пользователе от Google
4. Создает/обновляет пользователя в базе данных
5. Генерирует JWT токен
6. Возвращает токен и данные пользователя клиенту

**Register()**:
1. Проверяет уникальность email
2. Хеширует пароль
3. Создает нового пользователя
4. Сохраняет в базу данных
5. Генерирует JWT токен
6. Возвращает токен и данные пользователя

#### UserController

**GetUser(id)**:
1. Ищет пользователя по ID
2. Если не найден - возвращает 404
3. Если найден - возвращает данные пользователя

### Памятка по разработке

#### Добавление нового контроллера

1. Создайте новый класс в папке `Controllers/`
2. Унаследуйте от `ControllerBase`
3. Добавьте атрибут `[ApiController]` и `[Route("api/[controller]")]`
4. Реализуйте методы с соответствующими HTTP атрибутами
5. Добавьте зависимость от `AppDbContext` через конструктор
6. Зарегистрируйте зависимости в `Program.cs` при необходимости

Пример:
```csharp
[ApiController]
[Route("api/[controller]")]
public class NewController : ControllerBase
{
    private readonly AppDbContext _context;

    public NewController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(_context.Users.ToList());
    }
}
```

#### Добавление новой модели

1. Создайте новый класс в папке `Models/`
2. Определите свойства модели
3. При необходимости добавьте навигационные свойства для связей
4. Добавьте миграцию:
   ```
   dotnet ef migrations add AddNewModel
   dotnet ef database update
   ```

Пример:
```csharp
public class NewModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
}
```

#### Добавление новой миграции

1. Внесите изменения в модели
2. Выполните команды:
   ```
   dotnet ef migrations add DescriptionOfChanges
   dotnet ef database update
   ```

#### Настройка CORS

1. Измените политику в `Program.cs`:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("NewPolicy", policy =>
    {
        policy.WithOrigins("http://new-origin.com")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

2. Примените политику:
```csharp
app.UseCors("NewPolicy");
```

## Клиентская часть (Angular)

### Структура проекта

```
client/
├── src/
│   ├── app/
│   │   ├── components/     # Общие компоненты
│   │   ├── pages/          # Страницы приложения
│   │   ├── services/       # Сервисы
│   │   ├── models/         # Модели данных
│   │   ├── app.module.ts   # Главный модуль
│   │   └── app.routes.ts   # Маршрутизация
│   ├── assets/             # Статические ресурсы
│   ├── styles/             # Глобальные стили
│   └── main.ts             # Точка входа
├── angular.json            # Конфигурация Angular CLI
└── package.json            # Зависимости
```

### Подробное описание компонентов

#### 1. Модули и маршрутизация

**app.module.ts**:
- Импортирует все необходимые модули (HttpClientModule, FormsModule и т.д.)
- Объявляет все компоненты
- Предоставляет сервисы

**app.routes.ts**:
- Определяет маршруты приложения
- Настраивает lazy loading для оптимизации

#### 2. Сервисы (`services/`)

**auth.service.ts**:
- `login()`: Авторизация по email/password
- `googleLogin()`: Авторизация через Google
- `logout()`: Выход из системы
- `getToken()`: Получение токена из localStorage
- `isLoggedIn()`: Проверка статуса авторизации

**user.service.ts**:
- `getUser()`: Получение информации о пользователе
- Другие методы для работы с пользователями

#### 3. Страницы (`pages/`)

**login/**:
- Форма входа с email/password
- Кнопка входа через Google
- Валидация формы

**register/**:
- Многоэтапная форма регистрации
- Валидация всех полей
- Отображение ошибок

**register-step2/**:
- Второй этап регистрации с дополнительными данными
- Кастомные валидаторы

#### 4. Компоненты (`components/`)

**auth-callback/**:
- Обработка OAuth callback от Google
- Обмен кода на токен
- Перенаправление на главную страницу

### Памятка по разработке

#### Создание нового компонента

1. Генерируйте компонент через Angular CLI:
   ```
   ng generate component components/NewComponent
   ```
2. Добавьте компонент в соответствующий модуль
3. При необходимости добавьте маршрут

#### Создание новой страницы

1. Генерируйте компонент в папке `pages/`:
   ```
   ng generate component pages/NewPage
   ```
2. Добавьте маршрут в `app.routes.ts`:
   ```typescript
   { path: 'new-path', component: NewPageComponent }
   ```

#### Создание нового сервиса

1. Генерируйте сервис:
   ```
   ng generate service services/NewService
   ```
2. Добавьте методы для работы с API:
   ```typescript
   getData(): Observable<DataType> {
     return this.http.get<DataType>(`${this.apiUrl}/endpoint`);
   }
   ```
3. Предоставьте сервис в корневом модуле или feature модуле

#### Добавление HTTP интерцептора

1. Создайте новый класс:
   ```typescript
   @Injectable()
   export class NewInterceptor implements HttpInterceptor {
     intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       // Логика интерцептора
       return next.handle(modifiedReq);
     }
   }
   ```
2. Зарегистрируйте в `app.module.ts`:
   ```typescript
   providers: [
     { provide: HTTP_INTERCEPTORS, useClass: NewInterceptor, multi: true }
   ]
   ```

#### Работа с реактивными формами

1. Импортируйте `ReactiveFormsModule`
2. Создайте форму в компоненте:
   ```typescript
   form = this.fb.group({
     name: ['', [Validators.required]],
     email: ['', [Validators.required, Validators.email]]
   });
   ```
3. Свяжите с шаблоном:
   ```html
   <form [formGroup]="form" (ngSubmit)="onSubmit()">
     <input formControlName="name">
   </form>
   ```

#### Настройка стилей

1. Глобальные стили - в папке `styles/`
2. Компонентные стили - в файлах `.scss` компонента
3. Используйте переменные из `variables.scss`
4. Для темы Material добавьте стили в `styles.scss`

## Совместная работа клиента и сервера

### Аутентификация

1. Клиент перенаправляет пользователя на Google OAuth
2. После авторизации Google перенаправляет обратно с кодом
3. Клиент отправляет код на сервер (`/api/auth/google`)
4. Сервер обменивает код на токен доступа
5. Сервер получает данные пользователя от Google
6. Сервер создает/обновляет пользователя в БД
7. Сервер возвращает JWT токен клиенту
8. Клиент сохраняет токен и использует для последующих запросов

### Защищенные маршруты

1. Сервер проверяет JWT токен в заголовке Authorization
2. Для защищенных маршрутов используйте атрибут `[Authorize]`
3. Клиент добавляет токен в заголовки через интерцептор

### Обработка ошибок

1. Сервер возвращает соответствующие HTTP коды:
   - 400 для неверных запросов
   - 401 для неавторизованных запросов
   - 404 для отсутствующих ресурсов
   - 500 для серверных ошибок
2. Клиент обрабатывает ошибки в сервисах:
   ```typescript
   this.service.getData().subscribe({
     next: data => {},
     error: err => {
       if (err.status === 401) {
         // Перенаправление на страницу входа
       }
     }
   });
   ```

## Рекомендации по дальнейшей разработке

1. **Добавление модулей**:
   - Создавайте feature модули для логических частей приложения
   - Используйте lazy loading для оптимизации

2. **Состояние приложения**:
   - Реализуйте state management (NgRx или аналоги)
   - Централизуйте обработку состояния пользователя

3. **Тестирование**:
   - Пишите unit-тесты для сервисов
   - Добавляйте интеграционные тесты для API
   - Используйте Cypress для e2e тестов

4. **Оптимизация**:
   - Реализуйте кэширование запросов
   - Добавьте pagination для списков
   - Оптимизируйте bundle size (lazy loading, tree shaking)

5. **Документация API**:
   - Добавьте Swagger для серверного API
   - Генерируйте документацию с помощью Compodoc

6. **CI/CD**:
   - Настройте автоматические тесты
   - Добавьте автоматическое развертывание
   - Настройте линтеры и форматирование

## Часто используемые команды

### Серверная часть

```bash
# Восстановление зависимостей
dotnet restore

# Запуск приложения
dotnet run

# Создание миграции
dotnet ef migrations add MigrationName

# Применение миграций
dotnet ef database update
```

### Клиентская часть

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm start

# Генерация компонента
ng generate component components/ComponentName

# Генерация сервиса
ng generate service services/ServiceName

# Сборка для production
npm run build
```

## Заключение

Это руководство охватывает все основные аспекты разработки и расширения проекта. Для более сложных сценариев всегда можно обратиться к официальной документации Angular и ASP.NET Core. Регулярно обновляйте зависимости и следите за best practices в экосистемах обоих фреймворков.