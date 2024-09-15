function findAge(date_of_birth) {
  const currentDate = new Date().toISOString().split("T")[0].split("-");
  const birthDate = date_of_birth.toISOString().split("T")[0].split("-");

  let age = 0;

  // Birthday has occured this year
  // therefore, this year will also be counted in age.
  if (currentDate[1] >= birthDate[1] && currentDate[2] >= birthDate[2]) {
    age = currentDate[0] - birthDate[0];
  } else {
    age = currentDate[0] - 1 - birthDate[0];
  }

  return age;
}

const age = findAge(new Date("2002-11-04"));
console.log("Your age is: " + age);
