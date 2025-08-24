# GPON Project - Huawei BackEnd (Spring Boot Microservices)

This backend consists of multiple Spring Boot microservices powering the GPON Project - Huawei. Each microservice is responsible for a specific domain (User, Equipment, Gateway, Eureka Server, DTOs).

## Microservices
- **User_MicroService**: Manages user data and authentication
- **GPON_Equipment_MicroService**: Handles equipment-related operations
- **Gateway**: API gateway for routing requests
- **Eureka_Server**: Service discovery
- **DTOs**: Data Transfer Objects shared between services

## Project Structure
Each microservice has the following structure:
- `src/main/java/` - Main source code
- `src/main/resources/` - Configuration files (e.g., `application.properties`)
- `src/test/java/` - Test code
- `pom.xml` - Maven build configuration

## Getting Started
1. **Install Java (JDK 17+) and Maven**
2. **Build a microservice:**
   ```powershell
   mvn clean install
   ```
3. **Run a microservice:**
   ```powershell
   mvn spring-boot:run
   ```
   Or run the JAR from `target/`:
   ```powershell
   java -jar target/<service-name>-0.0.1-SNAPSHOT.jar
   ```

## Service Communication
- Services communicate via REST APIs
- Eureka Server is used for service discovery
- Gateway routes requests to appropriate microservices

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.
