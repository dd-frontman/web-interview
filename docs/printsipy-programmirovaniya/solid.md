# 🏗️ Принципы SOLID

> [!tip] Связанные темы
>
> - JavaScript
> - React на примере Vue
> - Vue.md
> - Принципы ООП
> - Эффективное обучение

## 🎯 Что такое SOLID

**SOLID** — это аббревиатура пяти принципов объектно-ориентированного программирования, которые помогают создавать качественный, поддерживаемый и расширяемый код.

## 🔴 S - Single Responsibility Principle (Принцип единственной ответственности)

### **Определение**

Класс должен иметь только одну причину для изменения.

### **Плохой пример**

```javascript
class User {
	constructor(name, email) {
		this.name = name;
		this.email = email;
	}

	// Отвечает за данные пользователя
	save() {
		// Логика сохранения в базу данных
	}

	// Отвечает за валидацию
	validateEmail() {
		return this.email.includes("@");
	}

	// Отвечает за отправку уведомлений
	sendEmail(subject, body) {
		// Логика отправки email
	}
}
```

### **Хороший пример**

```javascript
class User {
	constructor(name, email) {
		this.name = name;
		this.email = email;
	}

	getName() {
		return this.name;
	}

	getEmail() {
		return this.email;
	}
}

class UserRepository {
	save(user) {
		// Логика сохранения в базу данных
	}

	findById(id) {
		// Логика поиска пользователя
	}
}

class EmailValidator {
	static isValid(email) {
		return email.includes("@") && email.includes(".");
	}
}

class EmailService {
	sendEmail(to, subject, body) {
		// Логика отправки email
	}
}
```

### **Практическое применение**

- **Разделяй классы** по функциональности
- **Один класс = одна задача**
- **Изменения в одной области** не должны затрагивать другие

## 🟢 O - Open/Closed Principle (Принцип открытости/закрытости)

### **Определение**

Программные сущности должны быть открыты для расширения, но закрыты для модификации.

### **Плохой пример**

```javascript
class PaymentProcessor {
	processPayment(paymentType, amount) {
		if (paymentType === "credit") {
			// Логика для кредитной карты
			return this.processCreditCard(amount);
		} else if (paymentType === "debit") {
			// Логика для дебетовой карты
			return this.processDebitCard(amount);
		} else if (paymentType === "crypto") {
			// Логика для криптовалюты
			return this.processCrypto(amount);
		}
	}

	processCreditCard(amount) {
		// Логика обработки кредитной карты
	}

	processDebitCard(amount) {
		// Логика обработки дебетовой карты
	}

	processCrypto(amount) {
		// Логика обработки криптовалюты
	}
}
```

### **Хороший пример**

```javascript
class PaymentProcessor {
	processPayment(paymentMethod, amount) {
		return paymentMethod.process(amount);
	}
}

class PaymentMethod {
	process(amount) {
		throw new Error("process method must be implemented");
	}
}

class CreditCardPayment extends PaymentMethod {
	process(amount) {
		// Логика обработки кредитной карты
		return `Credit card payment processed: $${amount}`;
	}
}

class DebitCardPayment extends PaymentMethod {
	process(amount) {
		// Логика обработки дебетовой карты
		return `Debit card payment processed: $${amount}`;
	}
}

class CryptoPayment extends PaymentMethod {
	process(amount) {
		// Логика обработки криптовалюты
		return `Crypto payment processed: $${amount}`;
	}
}

// Использование
const processor = new PaymentProcessor();
const creditPayment = new CreditCardPayment();
const result = processor.processPayment(creditPayment, 100);
```

### **Практическое применение**

- **Используй интерфейсы** для определения контрактов
- **Расширяй функциональность** через наследование или композицию
- **Не изменяй существующий код** при добавлении новых возможностей

## 🟡 L - Liskov Substitution Principle (Принцип подстановки Лисков)

### **Определение**

Объекты базового класса могут быть заменены объектами его подклассов без изменения корректности программы.

### **Плохой пример**

```javascript
class Rectangle {
	constructor(width, height) {
		this.width = width;
		this.height = height;
	}

	getArea() {
		return this.width * this.height;
	}

	setWidth(width) {
		this.width = width;
	}

	setHeight(height) {
		this.height = height;
	}
}

class Square extends Rectangle {
	constructor(side) {
		super(side, side);
	}

	setWidth(width) {
		this.width = width;
		this.height = width; // Нарушает принцип!
	}

	setHeight(height) {
		this.width = height; // Нарушает принцип!
		this.height = height;
	}
}

// Проблема: Square не может заменить Rectangle
function testArea(rectangle) {
	rectangle.setWidth(5);
	rectangle.setHeight(4);
	console.log(`Expected: 20, Got: ${rectangle.getArea()}`);
}

testArea(new Rectangle(5, 4)); // Expected: 20, Got: 20
testArea(new Square(5)); // Expected: 20, Got: 25 (нарушение!)
```

### **Хороший пример**

```javascript
class Shape {
	getArea() {
		throw new Error("getArea method must be implemented");
	}
}

class Rectangle extends Shape {
	constructor(width, height) {
		super();
		this.width = width;
		this.height = height;
	}

	getArea() {
		return this.width * this.height;
	}

	setWidth(width) {
		this.width = width;
	}

	setHeight(height) {
		this.height = height;
	}
}

class Square extends Shape {
	constructor(side) {
		super();
		this.side = side;
	}

	getArea() {
		return this.side * this.side;
	}

	setSide(side) {
		this.side = side;
	}
}

// Теперь Square и Rectangle могут использоваться взаимозаменяемо
function testArea(shape) {
	console.log(`Area: ${shape.getArea()}`);
}

testArea(new Rectangle(5, 4)); // Area: 20
testArea(new Square(5)); // Area: 25
```

### **Практическое применение**

- **Подклассы должны расширять** поведение базового класса
- **Не нарушай контракт** базового класса
- **Тестируй подстановку** подклассов

## 🔵 I - Interface Segregation Principle (Принцип разделения интерфейса)

### **Определение**

Клиенты не должны зависеть от интерфейсов, которые они не используют.

### **Плохой пример**

```javascript
class Worker {
	work() {
		// Работа
	}

	eat() {
		// Еда
	}

	sleep() {
		// Сон
	}
}

class Robot extends Worker {
	work() {
		// Робот может работать
	}

	eat() {
		// Робот не ест!
		throw new Error("Robots don't eat");
	}

	sleep() {
		// Робот не спит!
		throw new Error("Robots don't sleep");
	}
}
```

### **Хороший пример**

```javascript
class Workable {
  work() {
    throw new Error("work method must be implemented");
  }
}

class Eatable {
  eat() {
    throw new Error("eat method must be implemented");
  }
}

class Sleepable {
  sleep() {
    throw new Error("sleep method must be implemented");
  }
}

class Human extends Workable, Eatable, Sleepable {
  work() {
    return "Human is working";
  }

  eat() {
    return "Human is eating";
  }

  sleep() {
    return "Human is sleeping";
  }
}

class Robot extends Workable {
  work() {
    return "Robot is working";
  }
}

// Использование
function makeWork(workable) {
  return workable.work();
}

function makeEat(eatable) {
  return eatable.eat();
}

makeWork(new Human()); // "Human is working"
makeWork(new Robot()); // "Robot is working"
makeEat(new Human()); // "Human is eating"
// makeEat(new Robot()); // Ошибка! Robot не реализует Eatable
```

### **Практическое применение**

- **Разделяй большие интерфейсы** на маленькие
- **Клиенты должны зависеть** только от нужных им методов
- **Избегай "толстых" интерфейсов**

## 🟣 D - Dependency Inversion Principle (Принцип инверсии зависимостей)

### **Определение**

Зависимости должны строиться на абстракциях, а не на конкретных классах.

### **Плохой пример**

```javascript
class EmailNotifier {
	sendEmail(message) {
		console.log(`Sending email: ${message}`);
	}
}

class UserService {
	constructor() {
		this.notifier = new EmailNotifier(); // Жесткая зависимость
	}

	createUser(userData) {
		// Логика создания пользователя
		this.notifier.sendEmail("User created successfully");
	}
}
```

### **Хороший пример**

```javascript
class Notifier {
	notify(message) {
		throw new Error("notify method must be implemented");
	}
}

class EmailNotifier extends Notifier {
	notify(message) {
		console.log(`Sending email: ${message}`);
	}
}

class SMSNotifier extends Notifier {
	notify(message) {
		console.log(`Sending SMS: ${message}`);
	}
}

class UserService {
	constructor(notifier) {
		this.notifier = notifier; // Зависимость через абстракцию
	}

	createUser(userData) {
		// Логика создания пользователя
		this.notifier.notify("User created successfully");
	}
}

// Использование
const emailNotifier = new EmailNotifier();
const smsNotifier = new SMSNotifier();

const userServiceWithEmail = new UserService(emailNotifier);
const userServiceWithSMS = new UserService(smsNotifier);

userServiceWithEmail.createUser({ name: "John" });
userServiceWithSMS.createUser({ name: "Jane" });
```

### **Практическое применение**

- **Зависимости должны быть абстрактными**
- **Используй dependency injection**
- **Избегай создания объектов** внутри классов

## 💡 Применение в JavaScript/TypeScript

### **Использование интерфейсов**

```typescript
interface PaymentMethod {
	process(amount: number): string;
}

interface UserRepository {
	save(user: User): Promise<void>;
	findById(id: string): Promise<User | null>;
}

class UserService {
	constructor(private userRepo: UserRepository) {}

	async createUser(userData: UserData): Promise<User> {
		const user = new User(userData);
		await this.userRepo.save(user);
		return user;
	}
}
```

### **Dependency Injection**

```typescript
class Container {
	private services = new Map();

	register(key: string, implementation: any) {
		this.services.set(key, implementation);
	}

	resolve(key: string) {
		return this.services.get(key);
	}
}

const container = new Container();
container.register("UserRepository", new DatabaseUserRepository());
container.register("UserService", new UserService(container.resolve("UserRepository")));
```

## 🎯 Преимущества SOLID

- **Поддерживаемость**: легче вносить изменения
- **Расширяемость**: проще добавлять новую функциональность
- **Тестируемость**: легче писать unit тесты
- **Читаемость**: код понятнее и структурированнее
- **Переиспользование**: компоненты можно использовать в разных местах

## 🚨 Когда применять

### **Применяй когда:**

- Проект растет и усложняется
- Нужна долгосрочная поддержка
- Работаешь в команде
- Требуется гибкость и расширяемость

### **Не переусердствуй:**

- Простые скрипты не нуждаются в SOLID
- Over-engineering может усложнить код
- Балансируй между принципами и практичностью

## 🔄 Рефакторинг к SOLID

1. **Выяви нарушения** принципов
2. **Раздели ответственности** (SRP)
3. **Выдели абстракции** (OCP, DIP)
4. **Раздели интерфейсы** (ISP)
5. **Проверь подстановку** (LSP)
6. **Протестируй** изменения

> [!note] См. также
>
> - Принципы ООП
> - Маленькие принципы
> - Архитектура приложений

#solid #ооп #принципы #архитектура #код #качество
