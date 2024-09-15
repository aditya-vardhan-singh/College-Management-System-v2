import React from "react";
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const baseUrl = "http://127.0.0.1:5000";

export function findAge(date_of_birth: Date): number {
  try {
    const currentDate = new Date().toISOString().split("T")[0].split("-");
    const birthDate = date_of_birth.toISOString().split("T")[0].split("-");

    let age = 0;

    // Birthday has occured this year
    // therefore, this year will also be counted in age.
    if (currentDate[1] >= birthDate[1] && currentDate[2] >= birthDate[2]) {
      age = Number(currentDate[0]) - Number(birthDate[0]);
    } else {
      age = Number(currentDate[0]) - 1 - Number(birthDate[0]);
    }
    return age;
  } catch (err) {
    console.error("Error occured while calculating age: " + err);
    return 0;
  }
}
