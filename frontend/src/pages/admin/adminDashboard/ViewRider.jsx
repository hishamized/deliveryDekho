import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ViewRider = () => {
    const { id } = useParams();
    const [rider, setRider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRider = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/admins/rider/${id}`, { withCredentials: true });
                const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
                setRider(data.rider);
                setLoading(false);
            } catch (err) {
                setError('Failed to load rider details' . concat(err.response ? `: ${err.response.data.message}` : ''));
                setLoading(false);
            }
        };

        fetchRider();
    }, [id]);

    if (loading) return <div className="container mt-5"><div className="alert alert-info">Loading rider details...</div></div>;
    if (error) return <div className="container mt-5"><div className="alert alert-danger">{error}</div></div>;

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="row g-0">
                    <div className="col-md-4">
                        <img src={`${rider.photo}`} className="img-fluid rounded-start" alt="Rider Photo" />
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            {/* <pre>{JSON.stringify(rider, null, 2)}</pre> */}
                            <h5 className="card-title">{rider.name}</h5>
                            <p className="card-text"><strong>Phone:</strong> {rider.phone}</p>
                            <p className="card-text"><strong>Email:</strong> {rider.email || 'N/A'}</p>
                            <p className="card-text"><strong>Address:</strong> {rider.address || 'N/A'}</p>
                            <p className="card-text"><strong>Driver License:</strong> {rider.driver_license_number}</p>
                            <p className="card-text"><strong>Vehicle Reg.:</strong> {rider.vehicle_registration_number}</p>
                            <p className="card-text"><strong>Aadhaar:</strong> {rider.adhaar_number}</p>
                            <p className="card-text"><strong>PAN Card:</strong> {rider.pan_card_number}</p>
                            <p className="card-text"><strong>Availability:</strong> {rider.availability_status ? 'Available' : 'Unavailable'}</p>
                            <p className="card-text"><strong>Active:</strong> {rider.is_active ? 'Yes' : 'No'}</p>
                            <p className="card-text"><strong>Last Seen:</strong> {rider.last_seen ? new Date(rider.last_seen).toLocaleString() : 'N/A'}</p>
                            <p className="card-text"><strong>Current Location:</strong> {rider.current_location || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewRider;
