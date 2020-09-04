const jwt = require('jsonwebtoken');

const hashSeed = "9941a39c2fd25cb05931";
const passwordhashSeed = "9941a39c2fd25bc05931"

exports.passwordEncode = (password) => {
    return jwt.sign(password,passwordhashSeed) ;   
}

exports.passwordDecode = (encodedString) => {
    return new Promise((resolve,reject) => {
        jwt.verify(encodedString,passwordhashSeed , (err, decoded) => {
            if(decoded){
                resolve(decoded);
            }else{
                reject(`${err} , decode Failed`);
            }
        });
    });
}

exports.tokenEncode = (id) => {
    return jwt.sign(id,hashSeed) ;   
}

exports.tokenDecode = (token) => {
    return new Promise((resolve,reject) => {
        jwt.verify(token,hashSeed , (err, decoded) => {
            if(decoded){
                resolve(decoded);
            }else{
                reject(`${err} , decode Failed`);
            }
        });
    });
}


/*
const client = new OAuth2Client("590731925935-p80q78ga8hv34ck97q39epgfjlf9idu4.apps.googleusercontent.com");
exports.verifyGoogleToken = async (token) => {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "590731925935-p80q78ga8hv34ck97q39epgfjlf9idu4.apps.googleusercontent.com"
  });
  const payload = ticket.getPayload();
  return payload;
}*/