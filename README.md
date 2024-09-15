# Clinic System Angular

This project is a frontend for an application designed to manage a small medical
clinic. It is built using Angular and Angular Material. The project can be run
locally or deployed to a Kubernetes cluster. The system can be used as a
frontend for the following backend project:
[Clinic System](https://github.com/marekkawalski/clinic-system).

## Table of Contents

<!-- TOC -->

- [Clinic System Angular](#clinic-system-angular)
  - [Table of Contents](#table-of-contents)
  - [Running project locally](#running-project-locally)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
    - [Running the Project](#running-the-project)
  - [Deployment to Kubernetes](#deployment-to-kubernetes) _
  [Prerequisites](#prerequisites-1) _ [Setup](#setup-1) \*
  [Running the Project](#running-the-project-1)
  <!-- TOC -->

Clone the repository and navigate to the project directory

```bash
git clone https://github.com/marekkawalski/clinic-system-angular.git &&
cd clinic-system-angular
```

## Running project locally

### Prerequisites

- Node.js 20.x or higher
- npm
- Angular CLI 18.x or higher

### Setup

1. Install the dependencies

```bash
npm i
```

### Running the Project

1. Run the following command to start the application:

```bash
ng serve
```

2. Open the browser and navigate to `http://localhost:4200/`
3. The application should be running

## Deployment to Kubernetes

### Prerequisites

- Docker deamon, example:
  [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Kubernetes cluster, example: Docker Desktop Kubernetes, Minikube

### Setup

1. Add angular app host to the hosts file

```bash
sudo echo '127.0.0.1       angular.clinic.system.com'
>> ~/etc/hosts
```

2. Build the Docker image

```bash
docker build . -t clinic-system-angular:0.0.3
```

3. Deploy the image to the Kubernetes cluster

```bash
kubectl apply -f k8s/deployment.yaml
```

### Running the Project

1. Open the browser and navigate to `http://angular.clinic.system.com/`
2. The application should be running
