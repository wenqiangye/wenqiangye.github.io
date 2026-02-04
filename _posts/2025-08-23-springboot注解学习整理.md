---
title: springboot注解学习整理
date: 2025-08-23
permalink: /posts/2025/08/springboot注解学习整理/
tags:
  - springboot
---
## 核心注解

### @SpringBootApplication

- 此注解表明这是一个Spring Boot应用程序的入口，是一个复合注解，包含了@Configuration、@EnableAutoConfiguration、@ComponentScan；

![image-20250823214014161](https://cdn.jsdelivr.net/gh/wenqiangye/yesky_image/img/image-20250823214014161.png)

## 自动配置注解

### @EnableAutoConfiguration

- 启动Spring Boot的自动配置机制，根据项目中的依赖和应用上下文自动配置Spring应用程序
- 这个注解会根据添加的依赖和项目中的配置自动配置Spring Bean

### @Configuration

- 用来标志一个类为配置类，相当于一个Spring XML文件，配置类可以包含一个或多个@Bean方法，用来声明并注册Bean到Spring容器

## 组件扫描和注入注解

### @ ComponentScan

- 指定要扫描的包，以便发现和注册Spring组件，默认情况下，@ComponentScan会扫描启动类所在包及其子包

```java
@ComponentScan(basePackages = "com.example")
public class MyApplication{
  
}
```

### @Component

- 讲一个类标识为Spring组件(Bean)，可以被自动检测和注册，比较通用只能标识类；
- @Bean标识方法，必须在@Configuration类里使用；
- @Bean适用于无法直接在类上加@Component，例如三方库的类；
- @Component注解的Bean的名字是类名首字母小写，@Bean是标注的Bean的名字是其方法名；

### @Service

- 标识服务层组件

### @Repository

- 标识持久层组件

### @Controller

- 标识控制重组件

### @RestController

- 标识RESTful Web的控制器，是@Controller和@ResponseBody的结合

## 数据绑定与验证注解

### **@RequestMapping**

- 映射HTTP请求到处理方法上(GET、POST、PUT、DELETE等)

```java
@RequestMapping(value = "/users", method = RequestMethod.GET)
```

### **@GetMapping** **@PostMapping**

- @RequestMapping的简化版

### **@ResponseBody**

- `@ResponseBody` 是 Spring MVC 提供的注解，用于告诉 **Spring 将控制器方法的返回值直接作为 HTTP 响应体输出**，而不是去寻找一个视图（JSP/Thymeleaf 等）。
- @RestController=@Controller+@ResponseBody

  也就是说，**如果整个类都只返回 JSON / 字符串，而不是页面**，就直接用 `@RestController`，不需要每个方法都写 `@ResponseBody`。

```java
@Controller
public class HelloController {
    @GetMapping("/hello")
    public String hello() {
        return "hello"; // 默认认为是返回视图名 hello.html
    }
}
// 访问 /hello → 会去找 resources/templates/hello.html 页面。
@Controller
public class HelloController {
    @GetMapping("/hello")
    @ResponseBody
    public String hello() {
        return "Hello World"; // 直接作为响应体输出，而不是找页面
    }
}
```

### **@RequestBody**

- 将HTTP请求体的内容（如JSON、XML等）映射到一个Java对象
- 通常用于POST请求中，将客户端发送的数据绑定到方法的参数上

![image-20250823221711883](https://cdn.jsdelivr.net/gh/wenqiangye/yesky_image/img/image-20250823221711883.png)

### **@PathVariable**

- 从URI路径中提取参数值，将其映射到方法的参数上

```java
@RestController
public class MyRestController {
    @GetMapping("/users/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        // 根据userId查询用户信息
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }
}
```

### **@RequestParam**

- 用于从请求中获取参数的值

```java
@RestController
public class MyRestController {
    @GetMapping("/users")
    public ResponseEntity<User> getUserByName(@RequestParam String username) {
        // 根据用户名查询用户信息
        User user = userService.getUserByUsername(username);
        return ResponseEntity.ok(user);
    }
}
```

## 数据访问注解

### @Entity

- 标识一个JPA实体，用于定义一个与数据库表映射的持久化类。

### @Table

- 指定实体对应的数据库表名称，如果类名与数据库表名不同，可以使用 `@Table`注解进行指定。

## 其他注解

### **@Value**

### **@Autowired**

### @Bean

### **@Conditional**

### @Primary

- 当存在多个相同类型的 Bean 时，优先选择标记了 `@Primary` 的那个 Bean 注入

### **@Qualifier**

- 用来 **精确指定要注入的 Bean**，一般和 `@Autowired` 一起使用，当一个接口有多个实现类时，告诉 Spring **到底要用哪个实现类**

```java
public interface MessageService {
    String getMessage();
}

@Component("emailService")
public class EmailMessageService implements MessageService {
    public String getMessage() {
        return "Email message";
    }
}

@Component("smsService")
public class SmsMessageService implements MessageService {
    public String getMessage() {
        return "SMS message";
    }
}

@Autowired
private MessageService messageService;
//NoUniqueBeanDefinitionException
//期望找到一个 MessageService，但是有 2 个候选：emailService，smsService。

@Autowired
@Qualifier("smsService")
private MessageService messageService;

// @Qualifier明确告诉 Spring 用哪个
// @Primary和这个类似，优先选择带@Primary注解的类注入
```

### **@Lazy**

- 延迟初始化Bean，只有在首次使用时才创建Bean

### **@Scope**

- 指定Bean的作用域（单例、多例、请求、会话等）

### @Data

- `@Data` 是一个复合注解，集成了 `@ToString`、`@EqualsAndHashCode`、`@Getter`、`@Setter` 和 `@RequiredArgsConstructor` 的功能
- 简单来说使用这个组件后，不需要再写Getter，Setter等方法

### Lombok

- **Lombok** 是一个 Java **编译时注解处理器库**（Annotation Processor）
- 通过注解来 **自动生成 getter、setter、构造器、toString、equals、hashCode 等样板代码**，减少冗余，提高开发效率。
- @NoArgsConstructor无参构造器，@AllArgsConstructor全参构造器，@RequiredArgsConstructor必要参数构造器（针对 `final` 字段或 `@NonNull` 字段）
- @Builder，构建者模式

  ```java
  User.builder().name("Tom").age(20).build();
  ```
- @Slf4j，日志注解，自动生成 `private static final Logger log = LoggerFactory.getLogger(当前类.class);`，不需要手动写这句代码，只需要一个注解即可使用，log.Info("xxx")
