const { exportAllDeclaration } = require("@babel/types");
const say = require("../say");
test("Say Jest Message", () => {
    expect(say()).toBe("Hello Jest2");
  });
