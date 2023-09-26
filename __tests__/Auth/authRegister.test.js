const supertest = require("supertest");
const app = require("../../app");
const serve = supertest.agent(app)
const {StatusCodes} = require("http-status-codes")

const {connectDb, closeDb} = require("../../db/database")




beforeAll(async () => await connectDb());
afterAll(async () => await closeDb());
 

const user = {
    firstname: "gbenga",
    lastname:"eruola",
    username:"ashley199",
    email:"ashleybaker10032@gmail.com",
    password:"secret"
}
describe("AUTH", ()=>{
    test("Register a user", async()=>{

        await serve.post("/api/v1/auth/register")
        .send(user)
        .then((res) => {
          expect(res.body.msg).toEqual("Successfully created, please verify your email");
          expect(res.statusCode).toEqual(StatusCodes.CREATED);
        });
    })

    test("Show User Already Exists", async()=>{
        await serve.post("/api/v1/auth/register")
        .send(user)
        .then((res) => {
          expect(res.body.msg).toEqual("Email already exist");
          expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        });
    })
})