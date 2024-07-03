import fs from 'fs';

// Read the contents of the JSON file
const path = './user.json';
let jsonData;

export function SaveData(user) {

  try {
    const data = fs.readFileSync(path);
    jsonData = JSON.parse(data);
  } catch (err) {
    console.error("Error reading user.json:", err);
    // Handle the error appropriately (e.g., create a new file if it doesn't exist)
  }

  // Modify the JavaScript object by adding new data
  jsonData.users.push(user);

  // Convert the JavaScript object back into a JSON string
  const jsonString = JSON.stringify(jsonData, null, 4);

  // Write the updated JSON string to the file
  fs.writeFileSync(path, jsonString, 'utf-8', (err) => {
    if (err) throw err;
    console.log('Data added to file');
  });

  console.log("After Adding data", JSON.stringify(jsonData, null, 4));
}

module.exports = SaveData;