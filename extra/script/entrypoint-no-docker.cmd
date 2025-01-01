@echo off

:: Update npm and install project dependencies
npm install -g npm@latest && npm install -g tsx

:: Check package version
npm run update:pkg

:: Check if the migrations directory exists
IF EXIST "..\migrations" (
    :: Change to the migrations directory
    cd ..\migrations

    :: Start migrations
    npm run typeorm migration:run -- -d ./src/helper/datasource.ts

    :: Go back to the previous directory
    cd ..

    :: Remove the migrations directory
    rmdir /s /q migrations
)

:: Build the project
npm run build

:: Start the project
npm run start:prod