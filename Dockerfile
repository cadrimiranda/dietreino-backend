FROM eclipse-temurin:17-jdk-jammy
EXPOSE 8080
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

RUN chmod +x ./mvnw

RUN apt-get update && apt-get install -y dos2unix
RUN dos2unix ./mvnw

RUN ./mvnw dependency:resolve

COPY src ./src

ENTRYPOINT ["./mvnw", "spring-boot:run"]
CMD ["--spring.profiles.active=prod"]
