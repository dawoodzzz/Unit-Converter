let num = document.getElementById("input");
let type = document.getElementById("type");
let convert = document.getElementById("convert");
let result = document.getElementById("result");

convert.addEventListener("click", () => {
    let value = Number(num.value);
    if (isNaN(value) || value >100000000) {
        result.innerHTML = "Please enter a valid number";
        return;
    }
    let typeofvalue = type.value;
    if (typeofvalue === "length") {
        result.innerHTML = `${value} kilometer = ${(value * 1.60934).toFixed(2)} miles | ${value} miles = ${(value / 1.60934).toFixed(2)} kilometers`;
    }
    else if (typeofvalue === "volume") {
        result.innerHTML = `${value} liter = ${(value * 0.264172).toFixed(2)} gallons | ${value} gallons = ${(value / 0.264172).toFixed(2)} liters`;
    }
    else if (typeofvalue === "mass") {
        result.innerHTML = `${value} kilogram = ${(value * 2.20462).toFixed(2)} pounds | ${value} pounds = ${(value / 2.20462).toFixed(2)} kilograms`;
    }

});