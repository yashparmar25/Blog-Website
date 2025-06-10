const mongoose=require('mongoose')

const postSchema = new mongoose.Schema(
    {
        userId:{
            type:String,
            require:true,
        },
        
        content:{
            type:String,
            required:true,
        },
        title:{
             type:String,
             required:true,
             unique:true,
        },
        image:{
            type:String,
            default:'https://www.google.com/imgres?q=blog%20post%20image%20hostinger&imgurl=https%3A%2F%2Fwww.hostinger.com%2Fblog%2Fwp-content%2Fuploads%2Fsites%2F4%2F2023%2F06%2FProduct-Update-WordPress-Blog-Theme.webp&imgrefurl=https%3A%2F%2Fwww.hostinger.com%2Fblog%2Fhostinger-blog-theme&docid=vrF6lxTAtrxnWM&tbnid=Zd6sCPtsmdmqYM&vet=12ahUKEwibhfnY0uyGAxVmoWMGHeaVCA0QM3oECBQQAA..i&w=1906&h=1110&hcb=2&ved=2ahUKEwibhfnY0uyGAxVmoWMGHeaVCA0QM3oECBQQAA',
        },
        category:{
            type:String,
            default:'Uncategorized',
        },
        slug:{
            type:String,
            required:true,
            unique:true,
        },
    },{timestamps:true}
)

module.exports=mongoose.model('Post',postSchema)