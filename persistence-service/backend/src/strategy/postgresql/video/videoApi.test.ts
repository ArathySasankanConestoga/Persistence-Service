import axios from "axios";

describe("video api", () => {
  it("returns hello world", async () => {
    const response = await axios.get("http://localhost:8000/video");

    expect(response).toBe("hello world");
  });
});
