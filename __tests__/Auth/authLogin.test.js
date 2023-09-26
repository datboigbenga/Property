const supertest = require("supertest");
const app = require("../../app");
const serve = supertest.agent(app)
const {StatusCodes} = require("http-status-codes")

const {connectDb, closeDb} = require("../../db/database")

const {userLoginData} = require("../../mockData");


beforeAll(async () => await connectDb());
afterAll(async () => await closeDb());
 


describe("AUTH", ()=>{
    test("Login a user", async()=>{

        await serve.post("/api/v1/auth/login")
        .set("User-Agent", "test")
        .send({
            email: "eruolagbenga@lass.com",
            password: "secret",
          })
        .then((res) => {
        //   expect(res.body.msg).toEqual("Successfully created, please verify your email");
          expect(res.statusCode).toEqual(StatusCodes.OK);
        });
    })

})