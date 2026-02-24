#!/bin/bash
# Build and run the Spring Boot application

cd /e/Social-System/backend

echo "Building Spring Boot application..."

# Compile
javac -version

# If Maven takes too long, we can use gradlew or just run with Java
# For now, let's wait for Maven installation

echo "Waiting for Maven installation to complete..."
