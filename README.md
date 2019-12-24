# ECE_ING4_NODEJS
Project of DevOps and NodeJS



### How to run the Project

```shell
npm install
npm run populate
npm start 
npm test
```

Then navigate to [http://localhost:8080/login]()

You can log in using those credentials :

```javascript
username : User0
password : paroli
```

You can also create your own account.

Once logged in, you can modify your metrics on the page  [http://localhost:8080/modification]()

### Some interesting links to use for debugging purposes

To see all the users as they are stored in the database : http://localhost:8080/api/allUsers 

To see all the metrics as they are stored in the database : http://localhost:8080/api/all



#### Disclaimer

We haven't been able to re-do all the project on our own. As such, we reckon having used parts of the course to be able to to this app, as we didn't manage to do the project without them.

###### The parts we used almost entirely are :

- Authentification middleware
- Router when logged in (in server.ts)

###### Some parts are used only for the template, and we made our own modifications to it later on :

- Base for tests with Chai
- Base for populate
- Base for users
- Base for metrics

###### Those parts are done on our own only :

- .ejs files (chart + CRUD user's metrics)
- Functions to save, delete, see users

We know it was explicitly said not to do it, however there is no way we would have even started the project by now if we hadn't used those templates.

 