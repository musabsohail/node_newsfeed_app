## A simple NodeJS backend for a sample newsfeed website.

To test the APIs start the application with the following commands

##### (*Note: to install the dependencies run yarn install or npm install. The environment must have mongodb and redis installed on your system. For configuring different ports than default use .env file*)
```bash
yarn start:dev
```
or 
```bash
npm run start:dev
```


#### For further improving the app following steps could have been taken
- Better structure code to ensure the following:
    - DRY principles with utility/helper methods.
    - Decoupling some of the middleware code into separate modules.
    - Models Controllers reduced with **service layer pattern** for thin controllers improving readability and maintainability of the code.
- Authentication and Authorization for protecting the resources.
- Utilities such as validators, consistent api response structures, Request sanity. 
- Typescript for strict types.
- Error handling for consistent responses.
- CORS for better security
- Sanity of requests for protection against sql-injection.
- Dockers for consistent environment and avoiding system errors during deployments.
- CI/CD for automated deployments.
- Git branches for separate environments.
- Logging / Sentry integration for better error catching and debugging help
- Testing and code coverage for better code quality and avoiding breaking changes in the code while development.
- API documentation for easy referencing
- Linting, Formatters and Git hooks for standardised code writing.
