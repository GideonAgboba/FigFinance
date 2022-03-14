## FigFinance API by Agboba Gideon

- Yarn install and setup .env from .env.example

## API Endpoints

#

#

# Auth:

    Endpoint: post /auth/signup
    Endpoint: post /auth/login
    Endpoint: post /auth/logout
    Endpoint: post /auth/forgotPwd
    Endpoint: post /auth/resetPwd

    Endpoint: post /auth/admin/init
    Endpoint: post /auth/admin/login
    Endpoint: patch /auth/admin/change-password

# Admin:

    Endpoint: post /admin/create
    Endpoint: get /admin/analytics

    Endpoint: get /admin/get-events
    Endpoint: get /admin/get-events-categories
    Endpoint: get /admin/all-users
    Endpoint: get /admin/get-subscribers
    Endpoint: get /admin/get-contacts
    Endpoint: put /admin/toggle-user

# User:

    Endpoint: put /user/profile
    Endpoint: get /user/profile
    Endpoint: patch /user/change-password

# Event:

    Endpoint: get /event
    Endpoint: get /event/nearby
    Endpoint: post /event/create
    Endpoint: post /event/update
    Endpoint: delete /event/:id
    Endpoint: get /event/category
    Endpoint: post /event/category/create
    Endpoint: post /event/category/update
    Endpoint: delete /event/category/:id

# Contact:

    Endpoint: post /contact/create

# Subscribe:

    Endpoint: post /subscribe/create
    Endpoint: post /subscribe/delete
