const jwt = require("jsonwebtoken")

const createJWT = ({payload})=>{
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
      });
      return token;
}

const isTokenValid = (token) => {return jwt.verify(token, process.env.JWT_SECRET)}



const attachCookiesToresponse = ({res, user, refreshToken})=>{
  const accessTokenJwT = createJWT({payload:{user}})
  const refreshTokenJWT  = createJWT({payload:{user, refreshToken}})
  const oneday = 1000* 60*60*24
  const oneMonth = 1000* 60*60*24*30
  res.cookie("accessToken", accessTokenJwT, {
    httpOnly:true,
    secure:process.env.NODE_ENV ==="production",
    signed: true,
    expires: new Date(Date.now() + oneday),
  })

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly:true,
    expires: new Date(Date.now() + oneMonth),
    secure:process.env.NODE_ENV ==="production",
    signed: true
  })
}

// const attachCookiesToresponse = ({res, user})=>{
//   const token = createJWT({payload:user})

//   const oneday = 1000* 60*60*24
//   res.cookie("token", token, {
//     httpOnly:true,
//     expires: new Date(Date.now() + oneday),
//     secure:process.env.NODE_ENV ==="production",
//     signed: true
//   })

// }
module.exports ={
  createJWT,
  isTokenValid,
  attachCookiesToresponse
}