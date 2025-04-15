import * as tf from "@tensorflow/tfjs";

// Normalization helper
function normalizeData(data, min, max) {
  return data.map((val) => (val - min) / (max - min) || 0); // Avoid NaN if all values are the same
}

export async function predictTopEmployee(employeesData, startDate, endDate) {
  // Ensure employeesData is an array
  const employees = Array.isArray(employeesData) ? employeesData : [employeesData];
  
  if (employees.length === 0) return null;

  // Convert date range to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Filter out null or undefined entries
  const validEmployees = employees.filter(e => e && e.time_in);

  // Filter employees based on the date range
  const filteredEmployees = validEmployees.filter((e) => {
    const timeIn = new Date(e.time_in);
    return timeIn >= start && timeIn <= end;
  });

  if (filteredEmployees.length === 0) return null;

  // Aggregate totalHours and minutes_late per employee within the date range
  const employeeMap = new Map();

  filteredEmployees.forEach((e) => {
    if (!employeeMap.has(e.employee_id)) {
      employeeMap.set(e.employee_id, {
        employee_id: e.employee_id,
        employee_fullname: e.employee_fullname,
        position: e.position,
        totalHours: 0,
        minutes_late: 0,
      });
    }

    const employeeData = employeeMap.get(e.employee_id);
    employeeData.totalHours += e.totalHours;
    employeeData.minutes_late += e.minutes_late;
  });

  const aggregatedEmployees = Array.from(employeeMap.values());

  // Extract totalHours and minutes_late values
  let totalHours = aggregatedEmployees.map((e) => e.totalHours);
  let minutesLate = aggregatedEmployees.map((e) => e.minutes_late);

  // Normalize data
  const minTotalHours = Math.min(...totalHours);
  const maxTotalHours = Math.max(...totalHours);
  const minMinutesLate = Math.min(...minutesLate);
  const maxMinutesLate = Math.max(...minutesLate);

  totalHours = normalizeData(totalHours, minTotalHours, maxTotalHours);
  minutesLate = normalizeData(minutesLate, minMinutesLate, maxMinutesLate);

  // Prepare dataset: (Higher totalHours is better, lower minutesLate is better)
  const data = aggregatedEmployees.map((_, i) => [
    totalHours[i],
    1 - minutesLate[i],
  ]); // Inverting minutesLate to prioritize punctuality
  const scores = aggregatedEmployees.map(
    (_, i) => totalHours[i] * 0.7 + (1 - minutesLate[i]) * 0.3
  );

  // Define model
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [2], units: 8, activation: "relu" }));
  model.add(tf.layers.dense({ units: 4, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1, activation: "linear" }));

  model.compile({
    optimizer: "adam",
    loss: "meanAbsoluteError",
  });

  // Convert data into tensors
  const xs = tf.tensor2d(data);
  const ys = tf.tensor2d(scores, [scores.length, 1]);

  // Train model
  await model.fit(xs, ys, { epochs: 150 });

  // Make predictions
  const predictions = model.predict(xs).dataSync();
  const bestEmployeeIndex = predictions.indexOf(Math.max(...predictions));

  return aggregatedEmployees[bestEmployeeIndex];
}
