# DOCUMENTATION OF ATTENDANCE STAFF API

# A.Technology
- loopback 3
- MongoDB 
- Postman
- Node js
- NPM
- Visual studio code (vsc)

# B.Story
This staff attendance API is used to record staff attendance with status: present, absent,late, leave and record monthly staff reports.

# C.Table Design
<img width="650" alt="Screen Shot 2023-02-07 at 02 59 04" src="https://user-images.githubusercontent.com/106460262/217073767-0f9211af-5a79-4e44-a7b2-b2fcf885cd98.png">


# D.API
<img width="250" alt="Screen Shot 2023-02-07 at 08 43 25" src="https://user-images.githubusercontent.com/106460262/217126638-f9f2dbc6-8e8d-4e32-b25e-f08a0277689b.png">


# E.Database
For database i use mongoDB :

<img width="200" alt="Screen Shot 2023-02-07 at 07 24 14" src="https://user-images.githubusercontent.com/106460262/217117326-e0facd7c-b02f-473d-b8f1-1728f95e304c.png">


1.Staff Document

<img width="300" alt="Screen Shot 2023-02-07 at 07 28 42" src="https://user-images.githubusercontent.com/106460262/217117560-da4b1d7e-9168-4438-b231-0aeba41dd0a5.png">


2.Attendance Document

<img width="300" alt="Screen Shot 2023-02-07 at 07 25 50" src="https://user-images.githubusercontent.com/106460262/217117467-04820282-e03b-4074-af62-c2b4c3927716.png">

3.Request Permession Document

<img width="300" alt="Screen Shot 2023-02-07 at 07 24 44" src="https://user-images.githubusercontent.com/106460262/217117645-bc5b18ca-0953-4465-882b-90c1ff092e03.png">




# F.How To Use

To test this API I used Postman. To test the API sometimes we need several requests from the body, we usually take the request body from the input form from the frontend, because we don't have an input form, so we use the request body in postman.

1. API Add new staff 

- This API is used to adding new staff 
- API for adding new staff "http://localhost:3000/api/Staffs/add"
- we use HTTP method "POST"
- The API response will be displayed as show below :
<img width="400" alt="Screen Shot 2023-02-07 at 07 33 53" src="https://user-images.githubusercontent.com/106460262/217118933-0335afc1-a6ba-4c73-9dba-2baaa6438b41.png">

- and in the database we will see the data as shown below :
<img width="300" alt="Screen Shot 2023-02-07 at 07 45 37" src="https://user-images.githubusercontent.com/106460262/217119588-aa4392aa-ab1e-4fc4-9661-69a8e8bb3a9a.png">

2. API Check in 

- When we use this API we will get the status of staff in the database such as present, absent, late.
- This API is used when staff checking in
- API use for checking in staff "http://localhost:3000/api/Attedances/checkIn"
- we use HTTP method "POST"
- The API response will be displayed as show below :
<img width="400" alt="Screen Shot 2023-02-07 at 07 55 33" src="https://user-images.githubusercontent.com/106460262/217120777-1d07988b-59e3-45be-b200-edc1f36a963c.png">


- and in the database we will see the data as shown below :
<img width="300" alt="Screen Shot 2023-02-07 at 07 56 00" src="https://user-images.githubusercontent.com/106460262/217120760-1b819f0e-014d-4c0a-8b4b-e2f8b51c6d3c.png">

3. API Check out 

- This API is used when staff checking out
- API use for check out staff "http://localhost:3000/api/Attedances/checkOut"
- we used HTTP method "POST"
- The API response will be displayed as show below : 
<img width="400" alt="Screen Shot 2023-02-07 at 08 01 19" src="https://user-images.githubusercontent.com/106460262/217121513-73116dc1-a12d-4bee-b561-509385a7ab36.png">

- and in the database we will see the data as shown below :

<img width="300" alt="Screen Shot 2023-02-07 at 08 03 11" src="https://user-images.githubusercontent.com/106460262/217121635-c35bdcd5-b61d-4e76-a190-d8786a390c9e.png">

4. API Request Permession 

- This API is used by staff to apply for leave
- API used for staff to apply for leave "http://localhost:3000/api/RequestPermissions/requestPermision"
- we use HTTP method "POST"
- The API response will be displayed as show below :
<img width="400" alt="Screen Shot 2023-02-07 at 08 06 18" src="https://user-images.githubusercontent.com/106460262/217122616-57492002-7ceb-4144-8006-1798fec0662c.png">

- and in the database we will see the data as shown below :
<img width="300" alt="Screen Shot 2023-02-07 at 08 12 39" src="https://user-images.githubusercontent.com/106460262/217122739-d9d03af8-2171-400d-adc6-f84a24b3384a.png">

5. API Approved 

- This API is used when staff apply for leave if approved.
- API for staff who apply for approved leave "http://localhost:3000/api/RequestPermissions/approve/{idRequest}"
- by adding parameters "idRequest" in the API
- we use HTTP method "PUT"
- The API response will be displayed as show below :
<img width="400" alt="Screen Shot 2023-02-07 at 08 33 59" src="https://user-images.githubusercontent.com/106460262/217125523-ef46219a-7803-4432-b274-055664c38df2.png">


- and in the database we will see the data as shown below :
<img width="300" alt="Screen Shot 2023-02-07 at 08 22 09" src="https://user-images.githubusercontent.com/106460262/217124033-95118a65-8860-4233-aa3d-e22d07c79813.png">

6. API Reject 

- This API is used when staff who apply for leave are not approved.
- API to not approve "http://localhost:3000/api/RequestPermissions/reject/{idRequest}"
- by adding parameters "idRequest" in the API
- we use HTTP method "PUT"
- The API response will be displayed as show below :
<img width="400" alt="Screen Shot 2023-02-07 at 08 33 44" src="https://user-images.githubusercontent.com/106460262/217125558-c760823c-51f8-4f54-bac9-4d44620874c1.png">


- and in the database we will see the data as shown below :
<img width="300" alt="Screen Shot 2023-02-07 at 08 35 27" src="https://user-images.githubusercontent.com/106460262/217125688-cdbd0c1a-c425-4e7a-b00b-5a55a5413504.png">

7. API View All Staff 

- This API is used to view all staff data
- API for view all staff "http://localhost:3000/api/Staffs/view"
- we use HTTP method "GET"
- The API response will be displayed as show below :
<img width="400" alt="Screen Shot 2023-02-07 at 08 40 08" src="https://user-images.githubusercontent.com/106460262/217126491-819b7945-ddaa-43cd-8ca0-d9eeb9ad5452.png">


8. API View All Attendance with Staff 

- This API is used to view all staff data with attendance
- API View All Attendance with Staff "http://localhost:3000/api/Attedances/view"
- we use HHTP method "GET"
- The API response will be displayed as show below :
<img width="400" alt="Screen Shot 2023-02-07 at 08 47 08" src="https://user-images.githubusercontent.com/106460262/217127670-766ca80e-ed8f-4c5a-a972-aaee3ed67fa4.png">

9. API view result approved and unapproved

- API to view the number of staff who applied for leave
- API View All Attendance with Staff "http://localhost:3000/api/RequestPermissions/view"
- we use HTTP method "GET"
- The API response will be displayed as show below :
<img width="400" alt="Screen Shot 2023-02-07 at 09 03 34" src="https://user-images.githubusercontent.com/106460262/217129263-b62d0ada-fe00-4f8b-aeba-7a238c4f1c8d.png">

10. API Attendance report staff

- API to view staff reports for a month
- API Attendance report staff "http://localhost:3000/api/Attedances/report/{name}"
- by adding parameters "name" in the API
- The API response will be displayed as show below :
<img width="400" alt="Screen Shot 2023-02-07 at 09 05 57" src="https://user-images.githubusercontent.com/106460262/217129774-1bfc4310-2440-441d-85cb-e384158900f6.png">






















