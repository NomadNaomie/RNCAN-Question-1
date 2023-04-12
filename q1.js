const fetch = require('node-fetch')
let url = "https://restcountries.com/v3.1/all"
var countries = []

// Return a list of numbers based on the population density of each country.
function populationDensity(countries) {
    let populationDensities = []
    for (let country of countries) {
        populationDensities.push(parseFloat(country.population_density))
    }
    return populationDensities
}

// Return the mean of a list of numbers.
function mean(numbers) {
    let sum = 0
    for (let number of numbers) {
        sum += number
    }
    return sum / numbers.length
}

// Return the median of a list of numbers.
function median(numbers) {
    numbers.sort()
    let middle = Math.floor(numbers.length / 2)
    if (numbers.length % 2 == 1) { // Odd has a middle choice.
        return numbers[middle] 
    } else { // Even has no middle, so we take the average of the two middle choices.
        return (numbers[middle - 1] + numbers[middle]) / 2
    }
}

// Standard Deviation = Square Root of the Variance
// Variance = element - mean, squared and divided by the number of elements.
// https://www.cuemath.com/data/standard-deviation/
function standardDeviation(numbers) {
    let m = mean(numbers)
    let sum = 0
    for (let number of numbers) {
        sum += Math.pow(number - m, 2)
    }
    return Math.sqrt(sum / numbers.length)
}

// Fetch the data from the all end point, then push the data into the countries array.
fetch(url).then(res => res.json()).then(
    data => {
        for (let country of data) {
            let { name, population, area } = country
            countries.push({
                name: name.common == name.official ? name.common : `${name.common} (${name.official})`,
                population_density: `${(population / area)}`
            })
        }
    }
).then(() => {
    let populationDensities = populationDensity(countries)
    countries.map(country => {
        country.population_density = parseFloat(country.population_density).toFixed(2) + " people per square km"
    })
    console.table(countries)
    console.log(
        `The mean population density of the countries in the list is ${mean(populationDensities).toFixed(2)} people per square km, the median is ${median(populationDensities).toFixed(2)} people per square km, and the standard deviation is ${standardDeviation(populationDensities).toFixed(2)} people per square km.`
    )
})
