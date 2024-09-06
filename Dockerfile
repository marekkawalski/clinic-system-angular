FROM node:20-slim AS build
WORKDIR /usr/src/app
COPY package*.json ./
COPY .husky .husky
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.25.3-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/clinic-system-angular /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
