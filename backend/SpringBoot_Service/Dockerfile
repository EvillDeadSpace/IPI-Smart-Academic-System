# Use official OpenJDK image as base
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy only necessary files first
COPY backend/SpringBoot_Service/mvnw .
COPY backend/SpringBoot_Service/.mvn .mvn
COPY backend/SpringBoot_Service/pom.xml .

# Fix line endings and make mvnw executable
RUN apt-get update && \
    apt-get install -y dos2unix && \
    dos2unix mvnw && \
    chmod +x mvnw

# Copy the source code
COPY backend/SpringBoot_Service/src src

# Download dependencies
RUN ./mvnw dependency:go-offline

# Build the application
RUN ./mvnw package -DskipTests

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/SpringBoot_Service-0.0.1-SNAPSHOT.jar"]


