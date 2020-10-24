# CRAWL-TOOL SERVICE

## Introduction

This tool help us to crawl data from Mywork, Careerbuilder and Vietnamwork and then save them to MongoDB


## Prerequisite

Before deploying the project:
- Install tools needed:
    ```
    ./install-tools.sh

    ```

- You have to create the `.env` file (refer to `example.env` file) in root folder then add MongoDB Url to `.env` file

    Eg:

    ```
    MONGODB_URL=mongodb://localhost:27017

    ```

## How to

```
Up to production:
./up.sh prod

Up to local (for developement):
./up.sh local

Log server:
./log.sh server

Exec to server:
./exec.sh server
```
