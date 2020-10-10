const { Schema, model } = require("mongoose")

const CompanySchema = new Schema({
    source: {           //nguồn từ trang nào
        type: String,
        default: null
    },
    createdDate: {   //ngày ghi vào database
        type: Date,
        default:null
    },
    updatedDate: {   //ngày sửa data base
        type: Date,
        default:null
    },
    companyTitle: {     //Tên doanh nghiệp//Tên Hộ kinh doanh
        type: String,
        required: true,
        unique: true,
    },
    companyInfo: [{   //thông tin công ty
        type: String,
        default: null
    }],
    companyImage: [{   //hình ảnh công ty
        type: String,
        default: null
    }],

    companySize: {    //Quy mô doanh nghiệp
        type: String,
        default: null
    },
    companyAddress: {  //địa chỉ đầy đủ của công ty
        type: String,
        default: null
    },
    companyCity: {        //Thành Phố
        type: String,
        default: null
    },
    companyDistrict: {     //Quận/Huyện
        type: String,
        default: null
    },
    companyUrl: {    //URL của công ty từ nguồn trang tìm việc
        type: String,
        default: null
    },
    companyWebsite: {  //website cua cong ty
        type: String,
        default: null
    },
    companyPhone: {
        type: String,
        default: null
    },
    companyEmail: {  
        type: String,
        default: null
    },
    companyBusiness: [{   //Lĩnh vực kinh doanh
        type: String,
        default: null
    }],
    companyContactName: {   //Tên người đăng tin
        type: String,
        default: null
    },
    companyContactPosition: {   //Chức vụ người đăng tin
        type: String,
        default: null
    },

    companyContactEmail: {  //Email liên hệ
        type: String,
        default: null
    },
    companyContactMobile: {  //SDT liên hệ  
        type: String,
        default: null
    },
})




const CompanyModel = model("Company", CompanySchema)

module.exports = CompanyModel