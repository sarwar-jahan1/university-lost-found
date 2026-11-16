
const REPORTS_KEY = "campus_lost_found_reports";

// Get all reports
export const getReports = async () => {
    const data = localStorage.getItem(REPORTS_KEY);

    return data ? JSON.parse(data) : [];
};

// Convert uploaded image into a storable format
const convertImage = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(null);
            return;
        }

        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(
            new Error("Unable to read image.")
        );

        reader.readAsDataURL(file);
    });
};

// Create a new report
export const createReport = async (report) => {
    const reports = await getReports();

    const imageData = await convertImage(report.image);

    const newReport = {
        ...report,
        id: Date.now(),
        image: imageData,
    };

    reports.push(newReport);

    localStorage.setItem(
        REPORTS_KEY,
        JSON.stringify(reports)
    );

    return newReport;
};

// Delete a report
export const deleteReport = async (id) => {
    const reports = await getReports();

    const updatedReports = reports.filter(
        (report) => report.id !== id
    );

    localStorage.setItem(
        REPORTS_KEY,
        JSON.stringify(updatedReports)
    );

    return updatedReports;
};
