import { fetchWeatherApi } from 'openmeteo';
import geocoder from 'local-reverse-geocoder';

// Gets the current weather, defaults to Sydney
export async function getWeather(lat = -33.8727, long = 151.2057) {
    let locationString = 'Current weather';
    try {
        const loc = await getLocationFromCoords(lat, long);
        locationString += ` in ${loc[0][0].name}`;
    } catch (err) {
        console.error("Error looking up location:", err);
    }

    const params = {
        "latitude": lat,
        "longitude": long,
        "hourly": "uv_index",
        "current": ["temperature_2m", "rain", "showers", "cloud_cover", "wind_gusts_10m", "wind_speed_10m", "wind_direction_10m"],
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const latitude = response.latitude();
    const longitude = response.longitude();
    const elevation = response.elevation();
    const utcOffsetSeconds = response.utcOffsetSeconds();

    console.log(
        `\nCoordinates: ${latitude}°N ${longitude}°E`,
        `\nElevation: ${elevation}m asl`,
        `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`,
    );

    const current = response.current();
    const hourly = response.hourly();

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
        locationString: locationString,
        current: {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            temperature_2m: parseFloat(current.variables(0).value().toFixed(1)),
            rain: current.variables(1).value(),
            showers: current.variables(2).value(),
            cloud_cover: current.variables(3).value(),
            wind_gusts_10m: parseFloat(current.variables(4).value().toFixed(1)),
            wind_speed_10m: parseFloat(current.variables(5).value().toFixed(1)),
            wind_direction_10m: current.variables(6).value(),
        },
        hourly: {
            time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
                (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
            ),
            uv_index: hourly.variables(0).valuesArray(),
        },
    };

    return weatherData;
}

export async function getWeatherForecast(lat = -33.8727, long = 151.2057) {
    let locationString = 'Today\'s weather';
    try {
        const loc = await getLocationFromCoords(lat, long);
        locationString += ` in ${loc[0][0].name}`;
    } catch (err) {
        console.error("Error looking up location:", err);
    }

    const params = {
	"latitude": lat,
	"longitude": long,
	"daily": ["wind_speed_10m_max", "wind_gusts_10m_max", "temperature_2m_max", "temperature_2m_min", "uv_index_max", "precipitation_probability_max", "precipitation_hours", "wind_direction_10m_dominant"],
	"timezone": "Australia/Sydney",
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const latitude = response.latitude();
    const longitude = response.longitude();
    const elevation = response.elevation();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const utcOffsetSeconds = response.utcOffsetSeconds();

    console.log(
        `\nCoordinates: ${latitude}°N ${longitude}°E`,
        `\nElevation: ${elevation}m asl`,
        `\nTimezone: ${timezone} ${timezoneAbbreviation}`,
        `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`,
    );

    const daily = response.daily();

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
        locationString: locationString,
        daily: {
            time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
                (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
            ),
            wind_speed_10m_max: parseFloat(daily.variables(0).valuesArray()[0].toFixed(1)),
            wind_gusts_10m_max: parseFloat(daily.variables(1).valuesArray()[0].toFixed(1)),
            temperature_2m_max: parseFloat(daily.variables(2).valuesArray()[0].toFixed(1)),
            temperature_2m_min: parseFloat(daily.variables(3).valuesArray()[0].toFixed(1)),
            uv_index_max: parseFloat(daily.variables(4).valuesArray()[0].toFixed(1)),
            precipitation_probability_max: daily.variables(5).valuesArray()[0],
            precipitation_hours: daily.variables(6).valuesArray()[0],
            wind_direction_10m_dominant: daily.variables(7).valuesArray()[0],
        },
    };

    return weatherData
}

export function getWindDirection(angle) {
    if (angle >= 22.5 && angle < 67.5 ) {
        return 'north east';
    } else if (angle >= 67.5 && angle < 112.5) {
        return 'east';
    } else if (angle >= 112.5 && angle < 157.5) {
        return 'south east';
    } else if (angle >= 157.5 && angle < 202.5) {
        return 'south';
    } else if (angle >= 202.5 && angle < 247.5) {
        return 'south west';
    } else if (angle >= 247.5 && angle < 292.5) {
        return 'west';
    } else if (angle >= 292.5 && angle < 337.5) {
        return 'north west';
    } else {
        return 'north';
    }
}

export function getLocationFromCoords(lat, long) {
  return new Promise((resolve, reject) => {
    geocoder.init(
      {
        citiesFileOverride: 'cities15000',
        load: {
          admin1: true,
          admin2: false,
          admin3And4: false,
          alternateNames: false,
        },
      },
      () => {
        geocoder.lookUp({ latitude: lat, longitude: long }, (err, res) => {
          if (err) return reject(err);
          resolve(res);
        });
      }
    );
  });
}
