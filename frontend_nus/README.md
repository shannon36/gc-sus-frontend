# NUS-ISS Smart Cart Version 1.3 - 16/10/2023  

### Updates 07/10/2023 - Frontend 

#### \*This version revised the application to Angular-HTML

### Updates 15/10/2023 - Backend 

#### \*Includes customer, product category and products entities by Shannon

---

### Github clone link

`https://github.com/hanyeencs/nusiss-smartcart.git`

---

### To run the frontend application (NEW)
ng serve

### To run the backend application (NEW)  
ng serve

---

### To work on github and actions

1. make sure is correct branch (namely 'main')

        git branch

2. to commit (e.g. _git commit -m "fix user login bug")

        git add .

        git commit -m "(COMMIT COMMENTS)"`

3. to push to git

        git push

4. to build

        ng build

The build artifacts will be stored in the `dist/` directory.


---

### To configure environment (for frontend/Angular)

1. Check in your machine Command Prompt, type :

        ng
        npm

2. A favoured result will be something like below:

   for npm
        
        npm <command>
        Usage:
        ..........

   for ng

        Error: You need to specify a command before moving on. Use '--help' to view the available commands.


3. If you failed in the `npm` step, go download Angular and install in your machine https://nodejs.org/en/download, after installation, go test `npm`` if works. If it works like above, type in cmd:

        npm install -g @angular/cli


4. If you failed in the `ng` step after a success `npm` however, just do type in cmd

        npm install -g @angular/cli

5. You are good to go for Angular Configuration! Try:

        npm start 
        ng serve

6. **AWS Amplify Configuration** needed to be done too should you haven't. Run below

        npm install --save aws-amplify @aws-amplify/ui-angular
    
7. New Things! Commits are now getting us updated!

8. Now front-end and back-end are in **separated individual directory** (i.e. frontend_nus, and backend_nus), to run either, remember to go into the respective directory, then only npm start or mvn spring-boot:run.


---

### To configure environment (for Backend)

#### Refer to folder named: backend_nus

#### Author: Shannon on 15 October 2023

1. Install Intellij and ensure that you have JDK 17.

2. Open Intellij and follow this link to import maven Spring boot project:
https://www.jetbrains.com/idea/guide/tutorials/working-with-maven/importing-a-project/

3. Ensure project structure is set as such - refer to images ProjectStructure1.PNG and ProjectStructure2.PNG inside authornotes_backend folder  (https://github.com/hanyeencs/nusiss-smartcart/tree/main/backend_nus/authornotes_backend)

4. If run configuration exists, please ensure that it is set as such - refer to image RunConfig3.PNG inside authornotes_backend folder (https://github.com/hanyeencs/nusiss-smartcart/tree/main/backend_nus/authornotes_backend)


6. Press play button if run config is set as seen in point 4. 
*If not, add a run configuration for the project as an Application and set it as you see in point 4.

7. Please refer to the configured swagger UI: http://13.229.63.255:9090/swagger-ui/index.html#/ 
- for searchUrls in service.ts files in frontend and for JSON response bodies.

*An example of a searchUrl: http://13.229.63.255:9090/Products/getProductsByCategoryId?pdtCatId=C11 under 
Products/getProductsByCategoryId (expandable) 





