# GPON Project - Huawei

This repository contains the full source code for the GPON Project - Huawei, including both the Angular front end and Spring Boot microservice backend.

## Structure
- **FrontEnd/**: Angular application for user interface and data visualization
- **BackEnd/**: Spring Boot microservices (User, Equipment, Gateway, Eureka Server, DTOs)

## How to Run
### FrontEnd
1. Navigate to `FrontEnd/`
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the development server:
   ```powershell
   ng serve
   ```
   The app will be available at `http://localhost:4200/`

### BackEnd
1. Navigate to the desired microservice folder in `BackEnd/`
2. Build and run:
   ```powershell
   mvn clean install
   mvn spring-boot:run
   ```
   Or run the JAR from `target/`:
   ```powershell
   java -jar target/<service-name>-0.0.1-SNAPSHOT.jar
   ```

## Documentation
- See `FrontEnd/README.md` for Angular front end details
- See `BackEnd/README.md` for backend microservices details

## License
This project is licensed under the MIT License.
