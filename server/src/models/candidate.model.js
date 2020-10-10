const { Schema, model } = require("mongoose");

const CandidateSchema = new Schema({
    source: {
        type: String,
        required: true,
        default: null
    },
    createdDate: {   //ngày ghi vào database
        type: Date,
        required: true,
        default: Date.now
    },
    updatedDate: {   //ngày sửa data base
        type: Date,
        default: null
    },
    candidateUrl: {   //Link người tìm việc từ nguồn trang web tìm việc nào
        type: String,
        unique: true,
        required: true,
        default: null
    },
    candidateName: { // Tên đối tượng Offer, tên người tìm việc
        type: String,
        default: null
    },
    candidateAvatar: { // Avatar
        type: String,
        default: null
    },
    candidateBirth: { // Ngày tháng năm sinh
        type: String,
        default: null
    },
    candidateBirthYear: { // Năm sinh
        type: Number,
        default: 0
    },
    candidateGender: { // Gioi tinh
        type: String,
        default: null
    },
    candidateMaritalStatus: { // Quan he hon nhan
        type: String,
        default: null
    },

    candidateUpdateTimestamp: { // Thời gian ứng viên update thông tin trên mywork
        type: String,
        default: null
    },

    candidatePosition: {  //vị trí mong muốn làm việc
        type: String,
        default: null
    },
    candidateSalary: {  //múc lương hiện tại
        type: String,
        default: null
    },


    candidateProfile: [{  //mô tả bản thân 
        type: String,
        default: null
    }],
    candidateProfession: [{  //Ngành nghề:
        type: String,
        default: null
    }],

    candidateAcademicLevel: {  //Trình độ học vấn: 
        type: String,
        default: null
    },
    candidateJobType: {  //Loại hình công việc:
        type: String,
        default: null
    },

    candidatePosition: {  //Cấp bậc mong muốn
        type: String,
        default: null
    },
    candidateDesiredSalary: {  //mức lương mong muốn
        type: String,
        default: null
    },
    candidateDesiredSalaryNums: [], //mức lương mong muốn
    candidateDesiredSalaryMax: {   //mức lương mong muốn max number( trieu)
        type: Number,
        default: 0
    },
    candidateDesiredSalaryMin: {   //mức lương mong muốn min number( trieu)
        type: Number,
        default: 0
    },
    candidateYearsOfExp: {  //Số năm kinh nghiệm
        type: String,
        default: null
    },
    candidateYearsOfExpNum: {  //Số năm kinh nghiệm number
        type: Number,
        default: 0
    },
    candidateLocation: [{  //Nơi làm việc: 
        type: String,
        default: null
    }],

    candidateDistrict: {   //Quận/Huyện
        type: String,
        default: null
    },
    candidateProvinceCity: {   //Tỉnh / thành phố:
        type: String,
        default: null
    },
    candidateProfileNum: {  // Mã hồ sơ: 
        type: String,
        default: null
    },

    candidateViewNum: {  // Số lượt xem: 
        type: String,
        default: null
    },

    candidateSkill: [{  //kỹ năng người tìm việc 
        type: String,
        default: null
    }],
    candidateExperience: [{   //kinh nghiem
    }],

    candidateExperienceLength: {  //kinh nghiem length
        type: Number,
        default: 0
    },

    candidateEducation: [{  //hoc van 
    }],

    candidateEducationLength: {  //hoc van length
        type: Number,
        default: 0
    },

    candidateLanguage: [{  //ngôn ngữ người tìm việc
    }],

    candidateScore: {   //
        type: Number,
        default: 0
    },
    candidateMeetRequirement: {   //
        type: Boolean,
        default: false
    },
    candidateEmail: {   //
        type: String,
        default: null
    },
    candidatePhone: {   //
        type: String,
        default: null
    },
    candidateAddress: {   // địa chỉ cụ thể
        type: String,
        default: null
    },
});


const CandidateModel = model("Candidate", CandidateSchema);

module.exports = CandidateModel;