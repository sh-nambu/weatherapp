import { Callback } from "aws-lambda";
import axios from "axios";

exports.handler = async (event: Event) => {
  if (event.city) {
    const response = await getWeatherData(event.city);
    console.log(response);
    if (response.status === 200) {
      return response.body;
    } else {
      throw Error(`${response.status}:${JSON.stringify(response.body)}`);
    }
  } else {
    // 都市名が取得できないときはエラーとする
    throw Error("city name is not specified");
  }
};

type Event = {
  city: string;
};

/**
 * 天気情報取得API.
 * @param city 都市名
 * @returns レスポンス
 */
const getWeatherData = async (city: string) => {
  try {
    const response = await fetchCurrentWeatherDataApi(city);
    console.log(response);

    if (response && response.status === 200) {
      // 必要な情報のみ返す
      const current = response.body.main.temp;
      const maxTemp = response.body.main.temp_max;
      const minTemp = response.body.main.temp_min;
      const description = response.body.weather[0].main;
      const descriptionText = response.body.weather[0].description;
      return {
        status: response.status,
        body: {
          description: description + ":" + descriptionText,
          current: current,
          maxTemp: maxTemp,
          minTemp: minTemp,
        },
      };
    } else {
      return {
        status: response.status,
        body: {
          message: response.body.message,
        },
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      body: {
        message: "unexpected error occurred",
      },
    };
  }
};

/**
 * OpenWeatherMapAPI呼び出し.
 * @param cityName 都市名
 * @returns レスポンス
 */
const fetchCurrentWeatherDataApi = async (cityName: string) => {
  return await axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${process.env.API_KEY}`
    )
    .then((response) => ({
      status: response.status,
      body: response.data,
    }))
    .catch((error) => {
      console.log(error);
      if (axios.isAxiosError(error) && error.response) {
        return { status: error.response.status, body: error.response.data };
      } else {
        return {
          status: 500,
          body: {
            message: "unexpected error occurred",
          },
        };
      }
    });
};
