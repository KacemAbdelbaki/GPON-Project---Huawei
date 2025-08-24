# GPON Project - Huawei FrontEnd (Angular)

This is the Angular-based front-end for the GPON Project - Huawei. It provides a user interface for interacting with the backend microservices and visualizing data.

## Features
- User authentication and management
- Equipment dashboard and management
- Address and location services
- Responsive design

## Project Structure
- `src/app/` - Main application code
- `src/app/dashboard/` - Dashboard components
- `src/app/equipment/` - Equipment management
- `src/app/user/` - User management
- `src/app/shared/` - Shared components and services
- `src/Services/` - Service layer for API communication
- `src/environment/` - Environment configuration

## Getting Started
1. **Install dependencies:**
   ```powershell
   npm install
   ```
2. **Run the development server:**
   ```powershell
   ng serve
   ```
   The app will be available at `http://localhost:4200/`.

## Build
To build the project for production:
```powershell
ng build --prod
```

## Environment Configuration
Edit `src/environment/environment.ts` for API endpoints and environment-specific settings.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.# GPONPRJ

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
