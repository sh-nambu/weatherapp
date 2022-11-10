import axios from "axios";
const { handler } = require("../src/index");

jest.mock("axios");
const getApiMock = jest.spyOn(axios, "get");

describe("weather-infoのテスト", () => {
  test("引数に都市名がないとき、例外を発生させる", async () => {
    const event = {};
    await expect(handler(event)).rejects.toThrow(Error);
  });

  test("WeatherMapApiのレスポンスがエラーのとき、例外を発生させる", async () => {
    const mockedResponse = {
      status: 404,
      data: { cod: "404", message: "city not found" },
    };
    getApiMock.mockResolvedValue(mockedResponse);

    const event = { city: "unknownCity" };
    await expect(handler(event)).rejects.toThrow(Error);
  });

  test("WeatherMapApiのレスポンスが正常のとき、レスポンスを返却する", async () => {
    const mockedResponse = {
      status: 200,
      data: {
        weather: [
          {
            id: 804,
            main: "Clouds",
            description: "overcast clouds",
            icon: "04d",
          },
        ],
        main: {
          temp: 304.13,
          feels_like: 311.13,
          temp_min: 302.55,
          temp_max: 305.88,
          pressure: 1008,
          humidity: 72,
          sea_level: 1008,
          grnd_level: 1006,
        },
      },
    };
    getApiMock.mockResolvedValue(mockedResponse);

    const event = { city: "tokyo" };
    const response = await handler(event);

    expect(response).toEqual({
      description: "Clouds:overcast clouds",
      current: 304.13,
      maxTemp: 305.88,
      minTemp: 302.55,
    });
  });
});
