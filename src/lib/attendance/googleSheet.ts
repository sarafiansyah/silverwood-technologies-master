import { google } from "googleapis";

const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SHEET_CLIENT_EMAIL,
    key: process.env.GOOGLE_SHEET_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({
    version: "v4",
    auth,
});

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID!;

const EMPLOYEE_SHEET = "Members";
const ATTENDANCE_SHEET = "Attendance";

/* =========================
   EMPLOYEE
========================= */

export async function getEmployees() {
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${EMPLOYEE_SHEET}!A2:D`,
    });

    const rows = res.data.values ?? [];

    return rows.map((row) => ({
        id: row[0] ?? "",
        name: row[1] ?? "",
        department: row[2] ?? "",
        position: row[3] ?? "",
    }));
}

export async function addEmployee(data: {
    id: string;
    name: string;
    department: string;
    position: string;
}) {
    await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${EMPLOYEE_SHEET}!A:D`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: [[data.id, data.name, data.department, data.position]],
        },
    });

    return true;
}

export async function updateEmployee(
    id: string,
    data: {
        name: string;
        department: string;
        position: string;
    },
) {
    const employees = await getEmployees();

    const index = employees.findIndex((e) => e.id === id);

    if (index === -1) throw new Error("Employee not found");

    const rowNumber = index + 2;

    await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${EMPLOYEE_SHEET}!A${rowNumber}:D${rowNumber}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: [[id, data.name, data.department, data.position]],
        },
    });

    return true;
}

export async function deleteEmployee(id: string) {
    // Read employees
    const employees = await getEmployees();

    const rowIndex = employees.findIndex((e) => e.id === id);

    if (rowIndex === -1) {
        throw new Error("Employee not found");
    }

    // Get spreadsheet metadata
    const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID,
    });

    const employeeSheet = spreadsheet.data.sheets?.find(
        (sheet) => sheet.properties?.title === EMPLOYEE_SHEET,
    );

    if (!employeeSheet || employeeSheet.properties?.sheetId === undefined) {
        throw new Error("Employees sheet not found");
    }

    const sheetId = employeeSheet.properties.sheetId;

    // +1 because row 1 is the header
    // Google API uses zero-based indexes
    const startIndex = rowIndex + 1;
    const endIndex = startIndex + 1;

    await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
            requests: [
                {
                    deleteDimension: {
                        range: {
                            sheetId,
                            dimension: "ROWS",
                            startIndex,
                            endIndex,
                        },
                    },
                },
            ],
        },
    });

    return true;
}

/* =========================
   ATTENDANCE
========================= */

export async function getAttendance() {
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${ATTENDANCE_SHEET}!A2:F`,
    });

    const rows = res.data.values ?? [];

    return rows.map((row) => ({
        id: row[0] ?? "",
        employeeId: row[1] ?? "",
        date: row[2] ?? "",
        checkIn: row[3] ?? "",
        checkOut: row[4] ?? "",
        status: row[5] ?? "",
    }));
}

export async function checkIn(employeeId: string) {
    const today = new Date().toISOString().split("T")[0];

    const attendance = await getAttendance();

    const exist = attendance.find(
        (a) => a.employeeId === employeeId && a.date === today,
    );

    if (exist) throw new Error("Already checked in.");

    await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${ATTENDANCE_SHEET}!A:F`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: [
                [
                    crypto.randomUUID(),
                    employeeId,
                    today,
                    new Date().toLocaleTimeString(),
                    "",
                    "Present",
                ],
            ],
        },
    });

    return true;
}

export async function checkOut(employeeId: string) {
    const today = new Date().toISOString().split("T")[0];

    const attendance = await getAttendance();

    const index = attendance.findIndex(
        (a) => a.employeeId === employeeId && a.date === today,
    );

    if (index === -1) throw new Error("Check in not found.");

    const rowNumber = index + 2;

    await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${ATTENDANCE_SHEET}!A${rowNumber}:F${rowNumber}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: [
                [
                    attendance[index].id,
                    employeeId,
                    today,
                    attendance[index].checkIn,
                    new Date().toLocaleTimeString(),
                    "Present",
                ],
            ],
        },
    });

    return true;
}
