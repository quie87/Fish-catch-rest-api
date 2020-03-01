# Release

In this file, you indicate the status of your assignment by checking the checkboxes below. No unchecked checkboxes are allowed in the document when your hand in for an assessment.

## Release status

_To make a release that will be assessed by the examiner, you need to make sure all checkboxes below are checked. You check a checkbox by adding an "x" within the brackets._

- [x] I have started working on the assignment.
- [x] All functional requirements are met.
- [x] All non-functional requirements are met.
- [x] I have completed the assignment report (see below).
- [x] README.md contains instructions on how to test the API

---

- [x] I intend to submit the assignment, and at the same time, I guarantee that I am the one who created the code that is submitted. In cases where I use external libraries or borrowed code from other sources, the source is clearly stated.
(_Jag avser göra en inlämning av uppgiften och jag garanterar samtidigt att jag är den som skapat koden som lämnas in. I de fall jag använder externa bibliotek eller har lånat kod från andra källor så är källan tydligt angiven._)

---

## Assignment report

### HATEOAS

I decided to respond with an array, links, of objects that describe the different paths a user could take from the location they are at. The objects describe:
* Type: GET, POST,PATCH, DELETE
* URL: The URL they can go to
* Description: An explanation of what they can expect to happen
* Requires: For example, if a user needs to be authorized to visit

There are also some other attributes when appropriate like a message, type of response the user will receive etcetera.

I believe that I have done this in a way that is clear and easy to understand. Also, you get different links depending on which path you are at in the given moment as HATEOAS instructs.  

### Multiple representations

I´m not sure that I understand the question but I assume it regards version control. 
In that case, I would implement versions in the URL. For example “www.api/mywebsite/v1/categories”. It is not the best way but it is easy to understand to the people that are using the website. It is also easy for developers when developing. 

### Autentication

I have used JTW-Tokens. It´s a convenient way for authentication and authorization.

1. I could have used Oauth2.0. In this project I thought that was more work then it would be worth.
2. It is easy to use. It uses HMACSHA256 encoding and I set a short expiration time, which makes it fairly secure from e.g CSRF attacks and XSS. 

The only downside that I can figure at this point is that revocation could be hard but at the same time, as the expiration time is fairly short, It would not be a big problem. Especially not in this application.

### Webhooks

A member is able to subscribe to an event in the form of webhooks. At this point, there is only one event implemented, create, which is triggered when a new catch registers.  When this event is triggered, a method will iterate over all subscribers to that event and send out a notification to those users. It will be sent to the URL that the user has entered at registration and the notification will come in the form of a URL to the newly created catch. 

A member is also able to unsubscribe to that event. 
I can see a couple of improvements to this implementation. For example a better notification message. But I have not had time to do it.


### Further improvments

This was not my first API but it is my first REST-API. I think I did tackle this assignment pretty well so there is not much I would do differently. One thing I can think of that I would spend more time on would be developing a strategy on how the different response messages should have been implemented. I believe that I could have done that part better.
With that, I probably could have improved on the representation of HATEOAS.

### Extras

I don´t think I did any particularly extra. If so that would be that I implemented a database with MongoDB that contains a cluster with members, catches and hooks. The application is also running in a production server. 

Regarding the webhooks, I have made sure that it is easy to add new events without the need to change the code structure or responses to the user.

### Feedback

_Feedback to the course management about the assignment._