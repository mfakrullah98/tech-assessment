# <h3>Tech Assessment</h3>

#This is a simple POC microservices application using RabbitMQ as a message broker. 
The application is composed of two services, serviceA and serviceB. 
ServiceA sends a message to a queue and serviceB consumes the message from the queue. 
The message is then logged to the console. 
Simple Api gateway is used to redirect the request to the appropriate service.
Versioning is used to manage the API versions.

#Prerequisites<br>
- Node.js<br>
- Docker<br>
- RabbitMQ<br>
- Express.js<br>

#Install packages<br>
```npm install```<br>

#Run rabbitmq instance<br>
```docker run -d -p 5672:5672 --hostname my-rabbit --name some-rabbit rabbitmq:3```<br>

#Run the application<br>
```npm run start:serviceA```<br>
```npm run start:serviceB```<br>
```npm start```<br>