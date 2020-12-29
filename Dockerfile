### Build environment
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env
WORKDIR /app

ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=1

RUN apt-get update -yq
RUN apt-get install curl gnupg -yq
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs

COPY *.csproj ./
RUN dotnet restore

ENV \
NPM_CONFIG_LOGLEVEL=silent \
NPM_CONFIG_AUDIT=false \
NPM_CONFIG_FUND=false \
ASPNETCORE_ENVIRONMENT=Production

COPY . ./
RUN dotnet publish -c Release -o out

### Runtime
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
WORKDIR /app
EXPOSE 80
COPY --from=build-env /app/out .
ENV \
TZ=Europe/Stockholm \
LANG=en_GB.UTF-8 \
LANGUAGE=en_GB.UTF-8 \
LC_ALL=en_GB.UTF-8
ENTRYPOINT ["dotnet", "FerryTimetableApp.dll"]
