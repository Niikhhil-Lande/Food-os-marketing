FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build
COPY pom.xml .
RUN mvn -q -B dependency:go-offline
COPY src ./src
RUN mvn -q -B -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
RUN useradd --system --uid 1001 foodos
COPY --from=build /build/target/foodos-backend-1.0.0.jar app.jar
USER foodos
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
