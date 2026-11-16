import { useState, useEffect } from "react";
import "../Styles/ReportItem.css";

import {
    getReports,
    createReport,
    deleteReport
} from "../services/api";

const ReportItem = () => {
    const [itemType, setItemType] = useState("lost");
    const [itemName, setItemName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [image, setImage] = useState(null);
    const [reports, setReports] = useState([]);
    useEffect(() => {
        const loadReports = async () => {
            try {
                const data = await getReports();
                setReports(data);
            } catch (error) {
                console.error("Error loading reports:", error);
            }
        };

        loadReports();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newReport = {
                itemType,
                itemName,
                category,
                description,
                location,
                date,
                image,
            };

            const savedReport = await createReport(newReport);

            setReports((prevReports) => [
                ...prevReports,
                savedReport
            ]);

            alert("Report submitted successfully!");

            setItemType("lost");
            setItemName("");
            setCategory("");
            setDescription("");
            setLocation("");
            setDate("");
            setImage(null);

            e.target.reset();

        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit report. Please try again.");
        }
    };
    return (
        <div className="report-container">
            <h1>Report an Item</h1>

            <form onSubmit={handleSubmit}>
                <label>
                    <input
                        type="radio"
                        name="itemType"
                        value="lost"
                        checked={itemType === "lost"}
                        onChange={() => setItemType("lost")}
                    />
                    Lost Item
                </label>

                <label>
                    <input
                        type="radio"
                        name="itemType"
                        value="found"
                        checked={itemType === "found"}
                        onChange={() => setItemType("found")}
                    />
                    Found Item
                </label>
                <p>Selected Type: {itemType}</p>
                <div>
                    <label>Item Name</label>

                    <input
                        type="text"
                        placeholder="Enter item name"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Category</label>

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select a category</option>
                        <option value="electronics">Electronics</option>
                        <option value="books">Books</option>
                        <option value="clothing">Clothing</option>
                        <option value="accessories">Accessories</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label>Description</label>

                    <textarea
                        placeholder="Describe the item..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Location</label>

                    <input
                        type="text"
                        placeholder="Where was the item lost or found?"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Upload Item Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>

                {image && (
                    <div>
                        <p>Image Preview:</p>
                        <img
                            src={URL.createObjectURL(image)}
                            alt="Item Preview"
                            width="200"
                        />
                    </div>
                )}

                <button type="submit">
                    Submit Report
                </button>

            </form>
            <h2 className="reports-section">Submitted Reports</h2>

            {reports.length === 0 ? (
                <p className="empty-reports">No reports submitted yet.</p>
            ) : (
                reports.map((report) => (
                    <div key={report.id} className="report-card">
                        <h3>{report.itemName}</h3>

                        <p>
                            Status:{" "}
                            <span className={`report-status ${report.itemType}`}>
                                {report.itemType}
                            </span>
                        </p>
                        <p>Category: {report.category}</p>
                        <p>Description: {report.description}</p>
                        <p>Location: {report.location}</p>
                        <p>Date: {report.date}</p>

                        <button
                            onClick={async () => {
                                try {
                                    const updatedReports = await deleteReport(report.id);
                                    setReports(updatedReports);
                                } catch (error) {
                                    console.error("Delete error:", error);
                                    alert("Failed to delete report.");
                                }
                            }}
                        >
                            Delete Report
                        </button>

                        {report.image && (
                            <img
                                src={URL.createObjectURL(report.image)}
                                alt={report.itemName}
                                width="150"
                            />
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default ReportItem;