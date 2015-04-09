# Perf-matters dashboard

## Instalation

```
npm i
npm i -g pm2
```

## Dependencies

MongoDB

## Configuration
Copy ```packages/default/dashboards/example.json``` contents to new file in same folder to create new dashboard.
Replace ```serviceUrl``` with your website url.
Dashboard will be running at
```http://localhost:8080/[file name]```.

## Run dashboard

```
npm run mongo
npm run dash
```
