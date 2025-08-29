import { fetchWeatherApi } from 'openmeteo';

export function rateUV(uv) {
    let rating = {index: parseFloat(uv.toFixed(1)), rating: "", recc: ""}
    if (uv <= 3) {
        rating.rating = "low";
        rating.recc = "No precautions necessary."
    } else if (3 < uv && uv <= 6) {
        rating.rating =  "moderate";
        rating.recc = "UV exposure may cause harm, especially to lighter skin. Avoid sun exposure and apply sun protection.";
    } else if (6 < uv && uv  <= 8) {
        rating.rating = "high";
        rating.recc = "UV exposure carries a high risk of harm. Skin and eye protection is necessary.";
    } else if (8 < uv && uv  <= 10) {
        rating.rating = "very high";
        rating.recc = "UV exposure is dangerous at this level. Skin and eye protection is critical and without it, you will burn quickly. ";
    } else {
        rating.rating = "extreme"
        rating.recc = "UV exposure is extremely high. Avoid all unnecessary sun exposure and apply skin and eye protection regularly. Exposed body parts may burn in minutes.";
    }

    return rating;
}

// Gets the max UV forecast for today, defaults to Sydney
export async function maxUV(lat, long) {
    if (!lat || !long) {
        lat = -33.8727;
        long = 151.2057;
    }

    const params = {
        "latitude": lat,
        "longitude": long,
        "daily": "uv_index_max",
        "hourly": ["temperature_2m", "relative_humidity_2m"],
        "timezone": "Australia/Sydney"
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
        daily: {
            time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
                (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
            ),
            uv_index_max: daily.variables(0).valuesArray(),
        },
    };

    return weatherData.daily.uv_index_max;
}
