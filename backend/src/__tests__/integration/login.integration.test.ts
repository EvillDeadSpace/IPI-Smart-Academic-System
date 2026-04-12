import request from "supertest";
import { createApp } from "../../app";
import { TEST_STUDENT } from "../test.constants";
const app = createApp()


describe("POST /api/auth/login", ()=>{
  it("should return 200 when credentials are valid", async()=>{
    const response = await request(app).post("/api/auth/login").send({
      email: TEST_STUDENT.email,
      password: TEST_STUDENT.password
    })

    expect(response.status).toBe(200)
  })

  it("should return 401 when user does not exist", async()=>{
    const response = await request(app).post("/api/auth/login").send(
      {
        email: "test@test.com",
        password: "123123"
   })
   expect(response.status).toBe(401)
  })

  it("should return 400 when email and password are missing", async()=>{
    const response = await request(app).post("/api/auth/login").send(
      {
        email: "",
        password: ""
   })
   expect(response.status).toBe(400)
  })
})

