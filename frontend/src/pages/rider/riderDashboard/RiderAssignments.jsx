import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

dayjs.extend(relativeTime);
dayjs.extend(duration);

const RiderAssignments = () => {
  const [RiderId, setRiderId] = useState(null);
  const [Assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionRes = await axios.get(
          'http://localhost:5000/api/riders/check-session',
          { withCredentials: true }
        );

        if (sessionRes.status === 200 && sessionRes.data.rider) {
          const id = sessionRes.data.rider.id;
          setRiderId(id);

          const assignmentsRes = await axios.post(
            'http://localhost:5000/api/riders/fetch-assignments',
            { id },
            { withCredentials: true }
          );

          if (assignmentsRes.status === 200 && assignmentsRes.data.success) {
            setAssignments(assignmentsRes.data.assignments);
          }
        }
      } catch (error) {
        console.log('Error:', error);
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
    <div className="container mt-4">
      <h2 className="mb-4 text-center">🧾 Rider Assignments</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Assignment ID</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Status</th>
              <th>Assigned</th>
              <th>Picked</th>
              <th>Delivered</th>
              <th>Deadline</th>
              <th>⏳ Pickup</th>
              <th>⏳ Delivery</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Assignments.map((assignment, index) => (       
              <tr key={assignment.id}>
                <td>{index + 1}</td> 
                <td className="text-monospace">{assignment.unique_id}</td>
                <td>{assignment.source_address}</td>
                <td>{assignment.dest_address}</td>
                <td>
                  <span className="badge bg-info text-dark">{assignment.status}</span>
                </td>
                <td>{assignment.assigned_time ? dayjs(assignment.assigned_time).format("DD MMM, HH:mm") : "—"}</td>
                <td>{assignment.pickup_time ? dayjs(assignment.pickup_time).format("DD MMM, HH:mm") : "—"}</td>
                <td>{assignment.delivery_time ? dayjs(assignment.delivery_time).format("DD MMM, HH:mm") : "—"}</td>
                <td>{assignment.customer_deadline ? dayjs(assignment.customer_deadline).format("DD MMM, HH:mm") : "—"}</td>
                <td>{renderCountdown(getDeadlineTime(assignment.deadlines, "pickup"))}</td>
                <td>{renderCountdown(getDeadlineTime(assignment.deadlines, "delivery"))}</td>
                <td>
                  <button className="btn btn-outline-primary btn-sm">View Assignment</button>
                </td>
              </tr>
            ))}
            {Assignments.length === 0 && (
              <tr>
                <td colSpan="12" className="text-center text-muted">
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
