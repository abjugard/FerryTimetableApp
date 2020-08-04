# FerryTimetableApp

An API with SPA frontend for calculating next departure and timetables by day for ferries operated by the Swedish Trafikverket.

## Requirements

* An account at [Trafikverkets open API](https://api.trafikinfo.trafikverket.se/)

#### For development

* [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download/dotnet-core/3.1)
* [Node.js + NPM](https://nodejs.org/en/)

#### For deployment

* [Docker](https://www.docker.com/products/docker-desktop/)
* (optional) GNU make

## Configuration

Register an account at [Trafikverkets open API](https://api.trafikinfo.trafikverket.se/) and generate an API key.

Copy `appsettings.json.example` to `appsettings.json` and enter your API key and where your app will be hosted.

## Build and develop

The API automatically installs all frontend dependencies (`npm install`) and builds the frontend (`npm run build`) when run.

```
export ASPNETCORE_Environment=Development
dotnet build
dotnet run
```

After this the frontend will be available at [https://localhost:5000/](https://localhost:5000/)

## Deployment

_NOTE: For production builds the app disables the .NET Core built-in https redirection and HSTS features. This should be added by a reverse proxy like Caddy, nginx or HAProxy._

#### GNU make

If you have `GNU make` installed all you need to do is run

```
make
make deploy
```

Or the shorthand

```
make redeploy
```

#### Docker

```
docker build -t abjugard/ferrytimetableapp .
docker run -p 6363:80 abjugard/ferrytimetableapp
```
