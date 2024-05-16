import { expect, describe, it } from "vitest";
import { ErrorHandler } from "./errorHandler.mjs";

describe("ErrorHandler -> getErrorMessage", async () => {
  it("should return a human readable 200", async () => {
    // Arrange
    const blob = new Blob([]);
    const options = { status: 200, statusText: "" };
    const myResponse = new Response(blob, options);

    // Act
    const eh = new ErrorHandler(myResponse);

    // Assert
    expect(eh._response.status).toEqual(200);
  });

  it("should return a human readable 400", async () => {
    // Arrange
    const data = {
      errors: [
        {
          message: "Invalid email or password",
        },
      ],
      status: "Bad request",
      statusCode: 400,
    };
    const blob = new Blob([JSON.stringify(data)]);
    const options = { status: 400, statusText: "Bad request" };
    const myResponse = new Response(blob, options);

    // Act
    const eh = new ErrorHandler(myResponse);
    const msg = await eh.getErrorMessage();

    // Assert
    expect(msg).toBe("Invalid email or password");
  });

  it("should return a human readable 401", async () => {
    // Arrange
    const blob = new Blob([]);
    const options = { status: 401, statusText: "Unauthorized" };
    const myResponse = new Response(blob, options);

    // Act
    const eh = new ErrorHandler(myResponse);
    const result = await eh.getErrorMessage();

    // Assert
    expect(result).toBe(
      "Invalid username or password or you do not have an account yet!",
    );
  });

  it("should return a human readable 404", async () => {
    // Arrange
    const blob = new Blob([]);
    const options = { status: 404, statusText: "Not Found" };
    const myResponse = new Response(blob, options);

    // Act
    const eh = new ErrorHandler(myResponse);
    const result = await eh.getErrorMessage();

    // Assert
    expect(result).toBe("The requested resource was not found!");
  });

  it("should return a human readable 500", async () => {
    // Arrange
    const blob = new Blob([]);
    const options = { status: 500, statusText: "Internal Server Error" };
    const myResponse = new Response(blob, options);

    // Act
    const eh = new ErrorHandler(myResponse);
    const result = await eh.getErrorMessage();

    // Assert
    expect(result).toBe("Unknown error! Please retry later.");
  });

  it("should return a human readable 599", async () => {
    // Arrange
    const blob = new Blob([]);
    const options = {
      status: 599,
      statusText: "Network Connect Timeout Error",
    };
    const myResponse = new Response(blob, options);

    // Act
    const eh = new ErrorHandler(myResponse);
    const result = await eh.getErrorMessage();

    // Assert
    expect(result).toBe("Unknown error! Please retry later.");
  });
});
