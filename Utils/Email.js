const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ajaysmart26@gmail.com',
      pass: 'whitewall177'
    }
 });

 const sendMail = async (email,message) => new Promise( (resolve,reject) => {
    const messag_config = {
        from : 'ajaysmart26@gmail.com',
        to : email,
        subject : 'OTP for Flipkart Login !',
        text: message
    };
    transporter.sendMail(messag_config,(err,info) => {
        if (err) {
            reject(err)
        }else{
            resolve(info)
        }
        
    });
})



/*transporter.sendMail({
  from :'ajaysmart26@gmail.com',
  to : 'ajaysiva2000@gmail.com',
  subject: 'Hi',
  text : 'bye'
},(err,info)=>{
  if(err){
    console.error(err);
  }else{
    console.log(info);
  }
})*/

exports.sendOTP = sendMail;
