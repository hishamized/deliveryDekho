import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import { useNavigate } from "react-router-dom";

dayjs.extend(relativeTime);
dayjs.extend(duration);
 const baseUrl = import.meta.env.VITE_API_BASE_URL;
const RiderAssignments = () => {
  const navigate = useNavigate();
  const [RiderId, setRiderId] = useState(null);
  const [Assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionRes = await axios.get(
          `${baseUrl}/api/riders/check-session`,
          { withCredentials: true }
        );

        if (sessionRes.status === 200 && sessionRes.data.rider) {
          const id = sessionRes.data.rider.id;
          setRiderId(id);

          const assignmentsRes = await axios.post(
            `${baseUrl}/api/riders/fetch-assignments`,
            { id },
            { withCredentials: true }
          );

          if (assignmentsRes.status === 200 && assignmentsRes.data.success) {
            setAssignments(assignmentsRes.data.assignments);
          }
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchData();
  }, []);

  const getDeadlineTime = (deadlines, type) => {
    const dl = deadlines.find((d) => d.deadline_type === type);
    return dl ? dl.deadline_expire_time : null;
  };

  const renderCountdown = (time) => {
    if (!time) return "N/A";
    const diff = dayjs(time).diff(dayjs());
    if (diff <= 0) return <span className="text-danger fw-bold">Expired</span>;
    const dur = dayjs.duration(diff);
    return `${dur.hours()}h ${dur.minutes()}m ${dur.seconds()}s`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <h2 className="text-2xl font-semibold text-center mb-6">
        🧾 Rider Assignments
      </h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full text-sm text-left text-gray-800">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Assignment ID</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Destination</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assigned</th>
              <th className="px-4 py-3">Picked</th>
              <th className="px-4 py-3">Delivered</th>
              <th className="px-4 py-3">Deadline</th>
              <th className="px-4 py-3">⏳ Pickup</th>
              <th className="px-4 py-3">⏳ Delivery</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Assignments.map((assignment, index) => (
              <tr key={assignment.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3 font-mono">{assignment.unique_id}</td>
                <td className="px-4 py-3">{assignment.source_address}</td>
                <td className="px-4 py-3">{assignment.dest_address}</td>
                <td className="px-4 py-3">
                  <span className="inline-block bg-blue-200 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {assignment.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {assignment.assigned_time
                    ? dayjs(assignment.assigned_time).format("DD MMM, HH:mm")
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  {assignment.pickup_time
                    ? dayjs(assignment.pickup_time).format("DD MMM, HH:mm")
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  {assignment.delivery_time
                    ? dayjs(assignment.delivery_time).format("DD MMM, HH:mm")
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  {assignment.customer_deadline
                    ? dayjs(assignment.customer_deadline).format(
                        "DD MMM, HH:mm"
                      )
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  {renderCountdown(
                    getDeadlineTime(assignment.deadlines, "pickup")
                  )}
                </td>
                <td className="px-4 py-3">
                  {renderCountdown(
                    getDeadlineTime(assignment.deadlines, "delivery")
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() =>
                      navigate(
                        `/rider/riderDashboard/viewAssignment/${assignment.id}`
                      )
                    }
                    className="text-sm border border-blue-500 text-blue-600 px-3 py-1 rounded hover:bg-blue-50 transition"
                  >
                    View Assignment
                  </button>
                </td>
              </tr>
            ))}

            {Assignments.length === 0 && (
              <tr>
                <td
                  colSpan="12"
                  className="text-center px-4 py-6 text-gray-500 italic"
                >
                  No assignments available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiderAssignments;
