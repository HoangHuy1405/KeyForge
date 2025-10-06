############################################
# Stage 1: Build Frontend (Next.js)
############################################
FROM node:20 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

############################################
# Stage 2: Build Backend (Spring Boot with Maven)
############################################
FROM maven:3.9.6-eclipse-temurin-21 AS backend-builder
WORKDIR /app/backend
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B
COPY backend .
RUN mvn clean package -DskipTests

############################################
# Stage 3: Final Image
############################################
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy backend jar
COPY --from=backend-builder /app/backend/target/*.jar app.jar

# Copy frontend build output
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Set environment variables (Spring Boot)
ENV PORT=8080
ENV SPRING_WEB_RESOURCES_STATIC_LOCATIONS=classpath:/static/,file:/app/frontend/.next/,file:/app/frontend/public/

EXPOSE 8080

# Start both backend and frontend
CMD ["java", "-jar", "app.jar"]
