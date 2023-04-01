# BACKEND DEV TESTS

## Test Case 1

These test case involve sequence output of integers from 1 to 100,
If you have node install run the following command:
```bash
node fizzbuzz.js
```
And the results are:

```text
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
16
17
Fizz
19
Buzz
Fizz
22
23
Fizz
Buzz
26
Fizz
28
29
FizzBuzz
31
32
Fizz
34
Buzz
Fizz
37
38
Fizz
Buzz
41
Fizz
43
44
FizzBuzz
46
47
Fizz
49
Buzz
Fizz
52
53
Fizz
Buzz
56
Fizz
58
59
FizzBuzz
61
62
Fizz
64
Buzz
Fizz
67
68
Fizz
Buzz
71
Fizz
73
74
FizzBuzz
76
77
Fizz
79
Buzz
Fizz
82
83
Fizz
Buzz
86
Fizz
88
89
FizzBuzz
91
92
Fizz
94
Buzz
Fizz
97
98
Fizz
Buzz
```

## Test Case 2
These test case involve building Rest API with the ability to sign up, sign in, initiate transfer between accounts,
and utilize refresh token mechanism for re-authenticating users using Redis as cache storage and MongoDB as the persistent storage,

after you clone this repo, create a .env file in bank_api folder and peovide these information:

```text
JWT_SECRET_KEY = your-jwt-secret-key-should-be-here

JWT_EXPIRES_IN=1h

REFRESH_JWT_SECRET_KEY = your-refresh-token-secret-key-should-be-here

REFRESH_JWT_EXPIRES_IN=1d

PORT = 3500

MONGO_URI = copy-your-connection-from-mongodb-here
```

if you have docker, Start a redis via docker:

```bash
docker run -p 6379:6379 -it redis/redis-stack-server:latest
```

Then run the following commands in the terminal for better interaction:

```bash
# Move to the directory of this project
cd band_api

# Install node package manager dependencies.
npm install

# Start development server.
npm run dev 
```

- `Sign Up with`

```text
localhost:3500/api/v1/auth/sign_up

The accepted characters are:

{
  "firstName": "",
  "lastName": "",
  "email": "",
  "username": "",
  "password": "#"
}
The default role is 'user', but if you want to change the role, you can include extra parameter, like this:

{
  "firstName": ""
  "lastName": "",
  "email": "",
  "username": "",
  "password": "",
  "role": ""
}
```

- `Sign In with`

```text
localhost:3500/api/v1/auth/sign_in

the accepted characters are:

{
   "email": "",
   "password": "#"
}
you will be given an access_token for authorization for some specific routes, refreshToken for when you want to request for a new access_token.
```

- `Refresh your token with`

```text
localhost:3500/api/v1/auth/refresh

you will need to pass the refresh token you get from Sign in to get a new access_token and refresh token

the accepted character is:

{
   "refreshToken": ""
}

you will be given another access_token for authorization for some specific routes, another refreshToken for when you want to request for a new access_token.
```

- `Trabsfer to other account with`

```text
localhost:3500/api/v1/transfer

you will need to pass the access token you get from Sign in / refresh, attach it to your header with Bearer as the first string and also be a 'user' to tranfer to other account

the accepted characters are:

{
  "username": "megamsquare1",
  "amount": 900
}
```

- `Get account balance with`

```text
localhost:3500/api/v1/account/balance

you will need to pass the access token you get from Sign in / refresh, attach it to your header with Bearer as the first string and also be a 'user' to get your account balance
```

- `Get all account details`

```text
localhost:3500/api/v1/account/get_all

you will need to pass the access token you get from Sign in / refresh, attach it to your header with Bearer as the first string and also be a 'admin' to get all account details
```

# Take Note
I believe some part of the code can be make reduce instead of having spaghetti code, example. some part pf the login can be move to a use-case folder and make reference to them.

The redis also cut the refresh token latency to about 70% after cache.

I believe the system can also be optimize by implementing queue preocess.