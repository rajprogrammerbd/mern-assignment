# Fullstack Web App with Kafka, Redis, PostgreSQL, and Prisma

This project is a fullstack web application built with:

- **Frontend**: React (served on `localhost:3000`)
- **Backend**: Node.js with Express and Prisma ORM (served on `localhost:5000`)
- **Database**: PostgreSQL
- **Message Broker**: Apache Kafka (with Zookeeper)
- **Cache Store**: Redis
- **API Docs**: Swagger UI available at `/api-docs`

---

## 🧰 Prerequisites

Before running the application, make sure you have the following installed:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/rajprogrammerbd/mern-assignment
cd mern-assignment
```

In order to run the project, please run in watch mode below command,
```
docker-compose up --build --watch
```
