const { Schema, model } = require("mongoose")

const JobSchema = new Schema({
    source: {
        type: String,
        required: true,
        default: null
    },
    createdDate: {   //ngày ghi vào database
        type: Date,
        default: null
    },
    updatedDate: {   //ngày sửa data base
        type: Date,
        default: null
    },
    companyId: {  // id của công ty đó ở model công ty
        type: Schema.Types.ObjectId,
        ref: 'Company',
        default: null
    },
    companyTitle: {   //tên công ty đó
        type: String,
        default: null
    },
    jobTitle: {   //Tên Position đăng tuyển
        type: String,
        required: true,
        default: null
    },
    jobProfession: [{
        type: String,
        default: null
    }],
    jobUrl: {   //Link bài đăng tuyển
        type: String,
        required: true,
        unique: true,
        default: null
    },
    jobSalary: {
        type: String,
        default: null
    },
    jobExpirationDate: {
        type: String,
        default: null
    },
    jobYearsofExperience: {
        type: String,
        default: null
    },
    jobDescription: [{
        type: String,
        default: null
    }],
    jobBenefit: [{
        type: String,
        default: null
    }],
    jobTags: [{
        type: String,
        default: null
    }],
    jobRequirement: [{
        type: String,
        default: null
    }],
    jobType: [{
        type: String,
        default: null
    }],
    jobAcademicDegree: [{
        type: String,
        default: null
    }],
    jobSkill: [{
        type: String,
        default: null
    }],
    jobSubmitDate: {
        type: String,
        default: null
    },

    jobPosition: {
        type: String,
        default: null
    },

    jobLocation: {   // Nơi làm việc của job này
        type: String,
        default: null
    },
    jobLanguage: {
        type: String,
        default: null
    },

})


const JobModel = model("Job", JobSchema)

module.exports = JobModel