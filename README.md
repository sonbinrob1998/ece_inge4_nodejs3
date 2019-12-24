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

### DevOps part 

##### Docker 

We have an issue with the image. It is runnable, the image is done and all, but I just can't find a SINGLE WAY to give you this image. The file is blocked by Ubuntu (because I can't have docker on my PC), and I just can't seem to find a way to save it somewhere. (I broke 3 virtual machines trying to recover those files, nothing seems to work)
It does work however; the container runs, and I can access my webpage after having built and run the docker image.

Steps to reproduce (if you ever want to see it actually runs...)

```bash
sudo docker build -t devops .
sudo docker run -p 8081:8080 -d devops
```

We can now see the server (going onto port 8081 and not 8080 as it was originally intended, because the port 8080 is now reserved to the container)

![image-20191224172839920](C:\Users\Pierre\AppData\Roaming\Typora\typora-user-images\image-20191224172839920.png)