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
    MYWORK_USERNAME=username
    MYWORK_PASSWORD=password
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

## APIs DOC

**API:** POST http://crawl.joco.asia:4000/api/mywork/crawl

```
ROUTE: api/mywork/crawl
METHOD: POST
BODY-RAW-DATA:

{
    "urls" :[
        "https://mywork.com.vn/ho-so/4900532/qa-qc-leader.html"
    ]
}

RESPONSE:
{
    "statusCode": 200,
    "message": "Data crawled successfully!",
    "data": [
        {
            "source": "MyWork",
            "candidateIdFromSource": "4900532",
            "updatedDate": "2020-10-24T03:56:21.144Z",
            "candidateUrl": "https://mywork.com.vn/ho-so/4900532/qa-qc-leader.html",
            "candidateName": "Nguyễn Nhân Quyền",
            "candidateAvatar": null,
            "candidateBirth": "29/12/1980",
            "candidateBirthYear": 1980,
            "candidateGender": "Nam",
            "candidateMaritalStatus": "Đã kết hôn",
            "candidateUpdateTimestamp": "24/10/2020",
            "candidatePosition": "Trưởng nhóm",
            "candidateSalary": null,
            "candidateProfile": [
                "Desire "
            ],
            "candidateProfession": [
                "QA-QC/ Thẩm định/ Giám định"
            ],
            "candidateAcademicLevel": "Kỹ sư",
            "candidateJobType": "Toàn thời gian cố định,",
            "candidateDesiredSalary": "12 triệu - 15 triệu",
            "candidateDesiredSalaryNums": [
                12,
                15
            ],
            "candidateDesiredSalaryMax": 15,
            "candidateDesiredSalaryMin": 12,
            "candidateYearsOfExp": "11 năm",
            "candidateYearsOfExpNum": 11,
            "candidateLocation": [
                "Hồ Chí Minh",
                "Bình Dương",
                "Đồng Nai"
            ],
            "candidateDistrict": "9",
            "candidateProvinceCity": "Hồ Chí Minh",
            "candidateProfileNum": "4900532",
            "candidateViewNum": "258",
            "candidateSkill": [],
            "candidateExperience": [
                {
                    "period": "Từ 02/2018 - 09/2020",
                    "title": "QA / QC Manager",
                    "description": "-Control DMAIC",
                    "company": "New Hanam"
                },
            ],
            "candidateExperienceLength": 3,
            "candidateEducation": [
                {
                    "period": "Từ 09/2003 - 08/2009",
                    "title": "Engineer",
                    "institution": "Ho Chi Minh City University Of Technology",
                    "faculty": "Điện - Điện tử",
                    "department": "electronic"
                }
            ],
            "candidateEducationLength": 1,
            "candidateLanguage": [],
            "candidateScore": 0,
            "candidateMeetRequirement": false,
            "candidateEmail": "nquyenv203@gmail.com",
            "candidatePhone": "0903178427",
            "candidateAddress": "45 / 4 Đường Số 7, Phường Long Trường, Quận 9, Hồ Chí Minh",
            "error": false,
            "errorMessage": null,
            "_id": "5f93a5e7cb34fca67b35b166",
            "__v": 0,
            "createdDate": "2020-10-24T03:56:23.474Z"
        }
    ]
}
```