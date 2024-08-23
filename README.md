# API Documentation for Knowledge Base

Abstract:

This API documentation aims to provide a comprehensive guide for accessing publicly available data of all Mirats Group companies through a single platform. The purpose is to facilitate easy access for company employees to relevant information.

## Base Path

- The base path for accessing the API is: https://knowledge-base-v1.vercel.app  ( {{baseUrl}} )

Endpoints
===



## Authorization

<h3>Register User(Method : Post)</h3>

 ```
  {{baseUrl}}/api/auth/register
```

 Input:
```
    {
        "name":"John",
        "email":"John@gmail.com",
        "password":"1234",
        "profilePhoto":"http://dindifndifne.com"
    }
```

Output:
```
    {
        "message": "User created",
        "user": {
            "name": "John",
            "userType": "user",
            "email": "John@gmail.com",
            "password": "$2a$10$doHuHmmxJX33AlErEyF77.wOVVIlIdKnKSGiNLlct4NRrU32U/8cC",
            "profilePhoto": "http://dindifndifne.com",
            "_id": "66c84c4ad8b6427d16666b75",
            "createdAt": "2024-08-23T08:46:02.542Z",
            "updatedAt": "2024-08-23T08:46:02.542Z",
            "__v": 0
        }
    }
```

<h3>Login User(Method : Post)</h3>

 ```
  {{baseUrl}}/api/auth/login
```

 Input:
 ```
    {
        "email":"John@gmail.com",
        "password":"1234"
    }
  ```

  Output:
  ```
    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YzgyNzEzMWJiODg4ZGU2ZjMxNmNkZCIsIm5hbWUiOiJKb2huIiwiZW1haWwiOiJKb2huQGdtYWlsLmNvbSIsInVzZXJUeXBlIjoidXNlciIsImlhdCI6MTcyNDQwMjgzMCwiZXhwIjoxNzI0NDA2NDMwfQ.KicyEp5TVsB165aBguc0IomDO3O9lCgudN-H43Q7SIs",
        "user": {
            "_id": "66c827131bb888de6f316cdd",
            "name": "John",
            "userType": "user",
            "email": "John@gmail.com",
            "password": "$2a$10$6lrS1sZXCQ4GK4UhfC7qgOxQvDAnZlDIDrEBhAoUr9qppfYtm8W8C",
            "profilePhoto": "http://dindifndifne.com",
            "createdAt": "2024-08-23T06:07:15.587Z",
            "updatedAt": "2024-08-23T06:07:15.587Z",
            "__v": 0
        }
    }
  ```


<h3>Update User(Method : Put)</h3>


```
  {{baseUrl}}/api/user/update/:id
```

 Input:
```
 {
  "name": "John Doe",
  "profilePhoto": "http://example.com/photo.jpg"
}
```

Output:
```
    {
        "user": {
            "_id": "66c5aaf48e02206de4ea0081",
            "name": "John Doe",
            "userType": "super_user",
            "email": "nikhil@gmail.com",
            "password": "$2a$10$egl6jB4MI0TM7nOHyMq0auv2jeqiIwgE6kMnR.5hr71M6mSTBPjEG",
            "profilePhoto": "http://example.com/photo.jpg",
            "createdAt": "2024-08-21T08:53:08.158Z",
            "updatedAt": "2024-08-23T08:50:32.044Z",
            "__v": 0
        }
    }
```



<Hr color="Beige">


## Categories  (By superUser)


  <h3>Add Categories(Method : Post)</h3>

  ```
  {{baseUrl}}/api/category/add
  ```

  Input:

   ```
    {
        "categoryName":"Javac"
    }
  ```

  Output:
 
   ```
    {
        "categoryName": "Javac",
        "categoryCreatedBy": "66c5aaf48e02206de4ea0081",
        "isActive": true,
        "_id": "66c84e06d8b6427d16666b88",
        "createdAt": "2024-08-23T08:53:26.717Z",
        "updatedAt": "2024-08-23T08:53:26.717Z",
        "__v": 0
    }
  ```





<h3>Get all Category(Method : Get)</h3>

  ```
 {{baseUrl}}/api/category/get
  ```

Output:
```
[
    {
        "_id": "66c5ac772c58a25b9ed03f62",
        "categoryName": "Go lang",
        "categoryCreatedBy": {
            "_id": "66c5aaf48e02206de4ea0081",
            "name": "John Doe",
            "email": "nikhil@gmail.com"
        },
        "isActive": true,
        "createdAt": "2024-08-21T08:59:35.976Z",
        "updatedAt": "2024-08-21T08:59:35.976Z",
        "__v": 0
    },
    {
        "_id": "66c5ac842c58a25b9ed03f66",
        "categoryName": "Java",
        "categoryCreatedBy": {
            "_id": "66c5aaf48e02206de4ea0081",
            "name": "John Doe",
            "email": "nikhil@gmail.com"
        },
        "isActive": true,
        "createdAt": "2024-08-21T08:59:48.991Z",
        "updatedAt": "2024-08-21T08:59:48.991Z",
        "__v": 0
    },
  ]
```
<h3>Get Single Category (Method : Get)</h3>

```
{{baseUrl}}/api/category/get/:id
```

Output:

```
    {
        "_id": "66c5ac772c58a25b9ed03f62",
        "categoryName": "Go lang",
        "categoryCreatedBy": {
            "_id": "66c5aaf48e02206de4ea0081",
            "name": "John Doe",
            "email": "nikhil@gmail.com"
        },
        "isActive": true,
        "createdAt": "2024-08-21T08:59:35.976Z",
        "updatedAt": "2024-08-21T08:59:35.976Z",
        "__v": 0
    }
 ```

<h3>Delete Category(Method:Delete)</h3>

```
{{baseUrl}}/api/category/remove/:id
```

  Output:

  ```
    Category deleted successfully
  ```

<h3>Update category(Method : Put)</h3>

  ```
   {{baseUrl}}/api/category/update/:id
  ```

   Input:
  ```
    {
        "categoryName":"Go Lang and Java "
    }
  ```
   Output:
  ```
    {
        "_id": "66c5ac772c58a25b9ed03f62",
        "categoryName": "Go Lang and Java ",
        "categoryCreatedBy": "66c5aaf48e02206de4ea0081",
        "isActive": true,
        "createdAt": "2024-08-21T08:59:35.976Z",
        "updatedAt": "2024-08-23T08:59:56.319Z",
        "__v": 0
    }
  ```
  <Hr color="Beige">

## Documents

```
  headers:{
    "Authorization": "Encrypted token"
  }
```

<h3>Add Documents(Method : Post)</h3>

  ```
  {{baseUrl}}/api/document/add
  ```

  Input:

   ```
    {
        "documentName":"Python Roadmap full",
        "description":"all about java and springboot",
        "category":"66c5ac842c58a25b9ed03f66"
    }
  ```

  Output:
 
   ```
    {
        "documentName": "Python Roadmap full",
        "status": "Draft",
        "description": "all about java and springboot",
        "createdByUserId": "66c5aaf48e02206de4ea0081",
        "category": "66c5ac842c58a25b9ed03f66",
        "favourite": false,
        "_id": "66c835d340f1ad3b287f0248",
        "createdAt": "2024-08-23T07:10:11.184Z",
        "updatedAt": "2024-08-23T07:10:11.184Z",
        "__v": 0
    }
  ```


<h3>Get all Documents(Method : Get)</h3>

  ```
   {{baseUrl}}/document/getAllDocuments
  ```

Output:
```
    [
        {
            "_id": "66c84f82d8b6427d16666b99",
            "documentName": "Computer Information 1",
            "status": "Draft",
            "description": "all about computer knowledge",
            "createdByUserId": {
                "_id": "66c839c773bb1c0fb43d6f1b",
                "name": "Sami123",
                "email": "sami@gmail.com"
            },
            "category": {
                "_id": "66c84f57d8b6427d16666b95",
                "categoryName": "Computer Knowledge"
            },
            "favourite": false,
            "createdAt": "2024-08-23T08:59:46.403Z",
            "updatedAt": "2024-08-23T09:01:07.579Z",
            "__v": 0
        },
        {
            "_id": "66c835d340f1ad3b287f0248",
            "documentName": "Python Roadmap full",
            "status": "Draft",
            "description": "all about java and springboot",
            "createdByUserId": {
                "_id": "66c5aaf48e02206de4ea0081",
                "name": "John Doe",
                "email": "nikhil@gmail.com"
            },
            "category": {
                "_id": "66c5ac842c58a25b9ed03f66",
                "categoryName": "Java"
            },
            "favourite": false,
            "createdAt": "2024-08-23T07:10:11.184Z",
            "updatedAt": "2024-08-23T07:10:11.184Z",
            "__v": 0
        },
        {
            "_id": "66c82ddfc5c454f0ad799712",
            "documentName": "Backend",
            "status": "Draft",
            "description": "all about java and springboot",
            "createdByUserId": {
                "_id": "66c827131bb888de6f316cdd",
                "name": "John",
                "email": "John@gmail.com"
            },
            "category": {
                "_id": "66c5ac842c58a25b9ed03f66",
                "categoryName": "Java"
            },
            "favourite": false,
            "createdAt": "2024-08-23T06:36:15.134Z",
            "updatedAt": "2024-08-23T06:36:15.134Z",
            "__v": 0
        },

    ]
```
<h3>Get Single Document (Method : Get)</h3>

```
{{baseUrl}}/api/document/get/:id
```

Output:

```
       {
            "_id": "66c84f82d8b6427d16666b99",
            "documentName": "Computer Information 1",
            "status": "Draft",
            "description": "all about computer knowledge",
            "createdByUserId": {
                "_id": "66c839c773bb1c0fb43d6f1b",
                "name": "Sami123",
                "email": "sami@gmail.com"
            },
            "category": {
                "_id": "66c84f57d8b6427d16666b95",
                "categoryName": "Computer Knowledge"
            },
            "favourite": false,
            "createdAt": "2024-08-23T08:59:46.403Z",
            "updatedAt": "2024-08-23T09:01:07.579Z",
            "__v": 0
        },
 ```

<h3>Delete Document(Method : Delete)</h3>

```
{{baseUrl}}/api/document/delete/:id
```

  Output:

  ```
    Document deleted successfully
  ```

<h3>Update Document(Method : Put)</h3>

  ```
  {{baseUrl}}/api/document/update/:id
  ```

   Input:
  ```
    {
        "documentName":"java and spring boot Roadmap 123"
    }
  ```
   Output:
  ```
    {
        "_id": "66c835d340f1ad3b287f0248",
        "documentName": "java and spring boot Roadmap 123",
        "status": "Draft",
        "description": "all about java and springboot",
        "createdByUserId": "66c5aaf48e02206de4ea0081",
        "category": "66c5ac842c58a25b9ed03f66",
        "favourite": false,
        "createdAt": "2024-08-23T07:10:11.184Z",
        "updatedAt": "2024-08-23T09:14:20.688Z",
        "__v": 0
    }
  ```

<h3>Get users all Document (Method : Get)</h3>

```
 {{baseUrl}}/api/document/getDocByUserId
```

Output:
```
    {
        "user": {
            "id": "66c5aaf48e02206de4ea0081",
            "name": "John Doe",
            "email": "nikhil@gmail.com",
            "userType": "super_user",
            "iat": 1724403189,
            "exp": 1724406789
        },
        "documents": [
            {
                "_id": "66c835d340f1ad3b287f0248",
                "documentName": "java and spring boot Roadmap 123",
                "status": "Draft",
                "description": "all about java and springboot",
                "createdByUserId": {
                    "_id": "66c5aaf48e02206de4ea0081",
                    "name": "John Doe",
                    "email": "nikhil@gmail.com"
                },
                "category": {
                    "_id": "66c5ac842c58a25b9ed03f66",
                    "categoryName": "Java"
                },
                "favourite": false,
                "createdAt": "2024-08-23T07:10:11.184Z",
                "updatedAt": "2024-08-23T09:14:20.688Z",
                "__v": 0
            },
        ]
    }
```

<Hr color="Beige">

## Pages


  <h3>Add Pages(Method : Post)</h3>

  ```
  {{baseUrl}}/api/pages
  ```

  Input:

   ```
    {
    "title": "Programming", 
    "content":"sample",  
    "documentId": "66c835d340f1ad3b287f0248", 
    "pageNestedUnder": ["66c5986446d0efd9e576b121","66c471f16b90b8d30dfee329"]
    }
  ```

  Output:
 
   ```
    {
        "title": "Programming",
        "content": "sample",
        "contributorId": [
            "66c835d340f1ad3b287f024a"
        ],
        "documentId": "66c835d340f1ad3b287f0248",
        "pageNestedUnder": [
            "66c5986446d0efd9e576b121",
            "66c471f16b90b8d30dfee329"
        ],
        "_id": "66c8553ff0f3991105ce0035",
        "createdAt": "2024-08-23T09:24:15.791Z",
        "updatedAt": "2024-08-23T09:24:15.791Z",
        "__v": 0
    }
  ```





<h3>Get all Pages(Method : Get)</h3>

```
  headers:{
    "Authorization": "Encrypted token"
  }
```

  ```
 {{baseUrl}}/api/pages
  ```

Output:
```
    [
        {
            "_id": "66c71b7c8f7b904ee0e1eac5",
            "title": "Memoryyyyyy MMMMYYYYYYRRRRR Helooo",
            "content": "sample Datatataa",
            "contributorId": [
                {
                    "_id": "66c71b0b8f7b904ee0e1eab6",
                    "userId": "66c5aaf48e02206de4ea0081",
                    "editAccess": 0
                },
                {
                    "_id": "66c71b0b8f7b904ee0e1eab6",
                    "userId": "66c5aaf48e02206de4ea0081",
                    "editAccess": 0
                }
            ],
            "documentId": {
                "_id": "66c71b0b8f7b904ee0e1eab4",
                "documentName": "DSA",
                "status": "Draft",
                "description": "all about java and springboot",
                "createdByUserId": "66c5aaf48e02206de4ea0081",
                "category": "66c5ac842c58a25b9ed03f66",
                "favourite": false,
                "createdAt": "2024-08-22T11:03:39.555Z",
                "updatedAt": "2024-08-22T11:04:32.843Z",
                "__v": 0
            },
            "pageNestedUnder": [
                {
                    "contributorId": [],
                    "_id": "66c5986446d0efd9e576b121",
                    "title": "RAMMMMMMMyyyyyeeee",
                    "content": "sample",
                    "userId": "66c476fa140a52faa6c1f96a",
                    "documentId": "66b31017d33727af388256dd",
                    "pageNestedUnder": [],
                    "createdAt": "2024-08-21T07:33:56.859Z",
                    "updatedAt": "2024-08-21T08:05:56.583Z",
                    "__v": 0
                },
                {
                    "contributorId": [],
                    "_id": "66c471f16b90b8d30dfee329",
                    "title": "RAM",
                    "content": "sample",
                    "userId": "66c46b7369bfad8a38ac79bc",
                    "documentId": "66c46b7369bfad8a38ac79bc",
                    "pageNestedUnder": [],
                    "createdAt": "2024-08-20T10:37:37.626Z",
                    "updatedAt": "2024-08-20T10:37:37.626Z",
                    "__v": 0
                }
            ],
            "createdAt": "2024-08-22T11:05:32.580Z",
            "updatedAt": "2024-08-23T05:15:50.319Z",
            "__v": 0
        },
    ]
```
<h3>Get Single Page(Method : Get)</h3>

```
{{baseUrl}}/api/pages/:id
```

Output:

```
    {
        "_id": "66c71b7c8f7b904ee0e1eac5",
        "title": "Memoryyyyyy MMMMYYYYYYRRRRR Helooo",
        "content": "sample Datatataa",
        "contributorId": [
            {
                "_id": "66c71b0b8f7b904ee0e1eab6",
                "documentId": "66c71b0b8f7b904ee0e1eab4",
                "userId": "66c5aaf48e02206de4ea0081"
            },
            {
                "_id": "66c71b0b8f7b904ee0e1eab6",
                "documentId": "66c71b0b8f7b904ee0e1eab4",
                "userId": "66c5aaf48e02206de4ea0081"
            }
        ],
        "documentId": {
            "_id": "66c71b0b8f7b904ee0e1eab4",
            "documentName": "DSA",
            "status": "Draft",
            "description": "all about java and springboot",
            "createdByUserId": "66c5aaf48e02206de4ea0081",
            "category": "66c5ac842c58a25b9ed03f66",
            "favourite": false,
            "createdAt": "2024-08-22T11:03:39.555Z",
            "updatedAt": "2024-08-22T11:04:32.843Z",
            "__v": 0
        },
        "pageNestedUnder": [
            {
                "contributorId": [],
                "_id": "66c5986446d0efd9e576b121",
                "title": "RAMMMMMMMyyyyyeeee",
                "content": "sample",
                "userId": "66c476fa140a52faa6c1f96a",
                "documentId": "66b31017d33727af388256dd",
                "pageNestedUnder": [],
                "createdAt": "2024-08-21T07:33:56.859Z",
                "updatedAt": "2024-08-21T08:05:56.583Z",
                "__v": 0
            },
            {
                "contributorId": [],
                "_id": "66c471f16b90b8d30dfee329",
                "title": "RAM",
                "content": "sample",
                "userId": "66c46b7369bfad8a38ac79bc",
                "documentId": "66c46b7369bfad8a38ac79bc",
                "pageNestedUnder": [],
                "createdAt": "2024-08-20T10:37:37.626Z",
                "updatedAt": "2024-08-20T10:37:37.626Z",
                "__v": 0
            }
        ],
        "createdAt": "2024-08-22T11:05:32.580Z",
        "updatedAt": "2024-08-23T05:15:50.319Z",
        "__v": 0
}
 ```

<h3>Delete Page(Method : Delete)</h3>

```
{{baseUrl}}/pages/:id
```

  Output:

  ```
    Page deleted successfully
  ```

<h3>Update Page(Method : Put)</h3>

  ```
  {{baseUrl}}/api/pages/:id
  ```

   Input:
  ```
    {
     "title": "Memoryyyyy", 
     "content":"sample Datatataa"
    }
  ```
   Output:
  ```
    {
        "_id": "66c71b7c8f7b904ee0e1eac5",
        "title": "Memoryyyyy",
        "content": "sample Datatataa",
        "contributorId": [
            "66c71b0b8f7b904ee0e1eab6",
            "66c71b0b8f7b904ee0e1eab6",
            "66c71b0b8f7b904ee0e1eab6"
        ],
        "documentId": "66c71b0b8f7b904ee0e1eab4",
        "pageNestedUnder": [
            "66c5986446d0efd9e576b121",
            "66c471f16b90b8d30dfee329"
        ],
        "createdAt": "2024-08-22T11:05:32.580Z",
        "updatedAt": "2024-08-23T09:36:17.143Z",
        "__v": 0
    }
  ```

  <Hr color="Beige">

  ## Coontributors

  <h3>Get all Contributor(Method : Get)</h3>

  ```
 {{baseUrl}}/contributor
  ```

Input:
```
    {
        "contributors": [
            {
                "_id": "66c6ee4d837ed55342154175",
                "documentId": "66c6ee4d837ed55342154173",
                "userId": "66c5aaf48e02206de4ea0081",
                "email": "nikhil@gmail.com",
                "editAccess": 0,
                "createdAt": "2024-08-22T07:52:45.619Z",
                "updatedAt": "2024-08-22T07:52:45.619Z",
                "__v": 0
            },
            {
                "_id": "66c6ee75837ed55342154179",
                "documentId": "66c6ee75837ed55342154177",
                "userId": "66c5aaf48e02206de4ea0081",
                "email": "nikhil@gmail.com",
                "editAccess": 0,
                "createdAt": "2024-08-22T07:53:25.608Z",
                "updatedAt": "2024-08-22T07:53:25.608Z",
                "__v": 0
            },
            count:2
        ]
    }
```

 <h3>Create Contributor(Method : Post)</h3>

  ```
 {{baseUrl}}/contributor
  ```

  Input:
  ```
    {
    "documentId": "66c835d340f1ad3b287f0248",
    "userId":"66c827131bb888de6f316cdd",
    "editAccess": 1
    }
  ```

  Output:
```
    {
        "documentId": "66c835d340f1ad3b287f0248",
        "userId": "66c827131bb888de6f316cdd",
        "email": "nikhil@gmail.com",
        "editAccess": 1,
        "_id": "66c8721e8330e15377d2d553",
        "createdAt": "2024-08-23T11:27:26.788Z",
        "updatedAt": "2024-08-23T11:27:26.788Z",
        "__v": 0
    }
```





  <Hr color="Beige">


<h2>Conclusion:</h2>
<p>This API documentation provides endpoints to interact with Mirats Group companies' data efficiently. For any further inquiries or assistance, please contact the API administrator.</p>