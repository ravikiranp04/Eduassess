import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { BASE_URL } from '../port';
import { useLocation, useNavigate } from 'react-router-dom';

function AdminSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState({});
  const { state } = useLocation();
  const [messageStatus, setMessageStatus] = useState('');
  const [messageVisible, setMessageVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stateVerify = async () => {
      if (state && state.message) {
        setMessageStatus(state.message);
        setMessageVisible(true);
        setTimeout(() => setMessageVisible(false), 3000); // Hide after 3 seconds
      }
    };

    const getSubjects = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/admin-api/get-subjects`);
        if (res.data.message === 'Subjects are') {
          setSubjects(res.data.payload);
        } else {
          setErr(res.data.message);
        }
      } catch (error) {
        setErr('Failed to fetch subjects');
      } finally {
        setLoading(false);
      }
    };

    stateVerify();
    getSubjects();
  }, [state]);

  const deleteSubject = async (subid) => {
    try {
      const res = await axios.delete(`${BASE_URL}/admin-api/delete-subject/${subid}`);
      if (res.data.message === 'Subject deleted') {
        setSubjects((prevSubjects) => prevSubjects.filter((sub) => sub.subjectid !== subid));
      } else {
        setErr(res.data.message);
      }
    } catch (error) {
      setErr('Failed to delete subject');
    }
  };

  const modifySubject = async (subid) => {
    try {
      const res = await axios.get(`${BASE_URL}/admin-api/get-subject-cat/${subid}`);
      if (res.data.message === 'categories are') {
        navigate(`/admin-profile/add-subject`, { state: res.data.payload });
      } else {
        setErr('Failed to fetch subject categories');
      }
    } catch (error) {
      setErr('Failed to modify subject');
    }
  };

  const toggleDropdown = (subjectId) => {
    setDropdownVisible((prevState) => ({
      ...prevState,
      [subjectId]: !prevState[subjectId],
    }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ background: '#f0f0f0', minHeight: '100vh', padding: '20px 0' }}>
      <div className="container">
        <h2 className="text-center mb-4">Subjects</h2>
        {messageVisible && (
          <div className="alert alert-success" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: '1000' }}>
            {messageStatus}
          </div>
        )}
        {err && <div className="alert alert-danger">{err}</div>}
        <ul className="list-group">
          {subjects.map((sub) => (
            <li
              key={sub.subjectid}
              className="list-group-item"
              style={{
                background: '#ffffff',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                borderRadius: '5px',
                position: 'relative',
                marginBottom: '10px',
              }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => toggleDropdown(sub.subjectid)}
              >
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{sub.subject}</span>
                {dropdownVisible[sub.subjectid] ? <FaCaretUp /> : <FaCaretDown />}
              </div>

              {dropdownVisible[sub.subjectid] && (
                <ul className="list-group mt-2">
                  {sub.subtypes.map((subtype, index) => (
                    <li key={index} className="list-group-item">
                      {subtype}
                    </li>
                  ))}
                </ul>
              )}

              <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                <FaEdit
                  className="mr-3 text-primary"
                  onClick={() => modifySubject(sub.subjectid)}
                  style={{ cursor: 'pointer', fontSize: '20px', margin: '1px' }}
                />
                <FaTrash
                  className="text-danger"
                  onClick={() => deleteSubject(sub.subjectid)}
                  style={{ cursor: 'pointer', fontSize: '20px', margin: '1px' }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminSubjects;
