import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './InboxPage.css';
import gomailLogo from '../assets/gomail-logo.png';
import LabelManager from './LabelManager';

//dates to readable string
function formatDateTime(isoString){
  if (!isoString) return 'No date';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function InboxPage(){
  //hooks of react router
  const navigate = useNavigate();
  const { label = 'inbox' } = useParams(); 
  //values of auth context
  const { token, user, logout } = useAuth();
  //state vars
  const [mails, setMails] = useState([]);
  const [search, setSearch] = useState('');
  const [viewMail, setViewMail] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [composeForm, setComposeForm] = useState({ to: '', subject: '', body: '', id: null });
  const [selectedMails, setSelectedMails] = useState([]);
  const [searchFeedback, setSearchFeedback] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [labels, setLabels] = useState([]);
  //fetching lables 
  useEffect(() =>{
    if (!token) return;
    fetch('/api/labels', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setLabels)
      .catch(() => setLabels([]));
  }, [token]);
  //fetching mail whenever label change
  useEffect(() =>{
    if (!token || !user){
      navigate('/');
      return;
    }
    fetchMails();
  }, [label]);
  //toggling darkmode
  useEffect(() =>{
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);
  //hiding menu on click
  useEffect(() =>{
    const close = () => setShowMenu(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);
  //fetching mails for user
  const fetchMails = async () =>{
    try{
      const res = await fetch('/api/mails', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401){
        return handleLogout();
      }
      const data = await res.json();
      setMails(data);
    }catch (err){
      console.error('Failed to fetch mails', err);
    }
  };
  //logout and then go to login
  const handleLogout = () =>{
    logout();
    navigate('/');
  };
//extracting urls from the strign
  const extractLinks = (text) =>
    text.match(/(?:https?:\/\/|www\.)[^\s]+|(?:[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g) || [];
//sending new mail or updating 
  const handleSendMail = async () =>{
    const links = extractLinks(composeForm.body);
    const isNew = !composeForm.id;
    const url = isNew ? '/api/mails' : `/api/mails/${composeForm.id}`;
    const method = isNew ? 'POST' : 'PATCH';
    try{
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...composeForm,
          links,
          sent: true
        })
      });
      if (res.ok){
        fetchMails();
        setViewMail(null);
        setComposeForm({ to: '', subject: '', body: '', id: null });
      }else{
        const error = await res.json();
        alert('Failed to send mail: ' + (error.error || res.status));
      }
    }catch (err){
      console.error('Send mail failed', err);
    }
  };
  //saving drafted mail so can be edited
  const handleSaveDraft = async () => {
    const links = extractLinks(composeForm.body);
    try{
      const res = await fetch('/api/mails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...composeForm,
          links,
          sent: false
        })
      });
      if (res.ok){
        fetchMails();
        setViewMail(null);
        setComposeForm({ to: '', subject: '', body: '', id: null });
      }else{
        const error = await res.json();
        alert('Failed to save draft: ' + (error.error || res.status));
      }
    }catch (err){
      console.error('Save draft failed', err);
    }
  };
  //deleting mail for the user
  const handleDeleteMail = async (id) =>{
    if (!window.confirm('Are you sure you want to delete this mail?')) return;
    try{
      await fetch(`/api/mails/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMails();
      setViewMail(null);
    }catch (err){
      console.error('Delete failed', err);
    }
  };
  //toggle spam or important labels
  const handleToggleLabel = async (mail, label) =>{
    try{
      await fetch(`/api/mails/${mail.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ label })
      });
      fetchMails();
      setViewMail(null);
    }catch (err){
      console.error(`Toggle ${label} failed`, err);
    }
  };
  //selecting mails for bulk actions
  function handleToggleSelect(mailId) {
    setSelectedMails(prev =>
      prev.includes(mailId)
        ? prev.filter(id => id !== mailId)
        : [...prev, mailId]
    );
  }
  //filtering mails acording to labels
  const filteredMails = mails.filter(mail =>{
    const userId = user?.id;
    const labels = mail.labels?.[userId] || [];
    const customLabels = mail.customLabels?.[userId] || [];
    if (mail.deletedBy?.includes(userId)){
       return false;
      }
    const isSpam = labels.includes('spam');
    const matchesLabel =
      label === 'sent'
        ? mail.from === userId && mail.sent
        : label === 'spam'
          ? isSpam
          : label === 'important'
            ? labels.includes('important')
            : label === 'draft'
              ? mail.from === userId && !mail.sent
              : label === 'inbox'
                ? mail.to === userId && mail.sent && !isSpam
                : customLabels.includes(label);

    const matchesSearch = mail.subject?.toLowerCase().includes(search.toLowerCase()) ||
      mail.body?.toLowerCase().includes(search.toLowerCase());
    return matchesLabel && matchesSearch;
  });
  const isEditingDraft = viewMail && viewMail.from === user.id && !viewMail.sent;
  //render
  return (
    <div className="gmail-layout">
      <header className="top-bar">
        <div className="logo-wrapper" onClick={() => navigate('/inbox')}>
          <img src={gomailLogo} alt="GoMail Logo" className="gomail-logo" />
          <span className="gomail-title">GoMail</span>
        </div>
        <input
          type="text"
          placeholder="Search mail"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="topbar-right">
          <button onClick={() => setIsDarkMode(prev => !prev)}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <div className="profile-menu">
            <div
              className="profile-circle"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(prev => !prev);
              }}
            >
              {user?.image ? (
                <img
                  src={`http://localhost:3003${user.image}`}
                  alt="Profile"
                  className="profile-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-avatar.png';
                  }}
                />
              ) : (
                <span className="profile-letter">
                  {(user.username?.[0] || '?').toUpperCase()}
                </span>
              )}
            </div>
            {showMenu && (
              <div className="dropdown">
                <div className="dropdown-username">{user?.username}</div>
                <button onClick={handleLogout}>🚪 Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="main-content">
        <aside className="sidebar">
          <button onClick={() => {
            setViewMail({});
            setComposeForm({ to: '', subject: '', body: '', id: null });
          }}>Compose</button>
          <ul>
            <li onClick={() => navigate('/inbox')}>📬 Inbox</li>
            <li onClick={() => navigate('/sent')}>✈️ Sent</li>
            <li onClick={() => navigate('/draft')}>📝 Drafts</li>
            <li onClick={() => navigate('/spam')}>🚫 Spam</li>
            <li onClick={() => navigate('/important')}>⭐ Important</li>
          </ul>
          <LabelManager token={token} onSelectLabel={(label) => navigate(`/${label}`)} />
        </aside>

        <section className="mail-content">
          {viewMail === null ? (
            <>
              <ul className="mail-list">
                {filteredMails.map(mail => {
                  const userId = user?.id;
                  const mailLabels = mail.labels?.[userId] || [];
                  return (
                    <li key={mail.id} onClick={() => {
                      setViewMail(mail);
                      setComposeForm({
                        to: mail.toName || '',
                        subject: mail.subject,
                        body: mail.body,
                        id: mail.id
                      });
                    }}>
                      <div className="mail-row">
                        <div className="mail-line">
                          <div className="mail-left-tools">
                            <input
                              type="checkbox"
                              className="mail-checkbox"
                              checked={selectedMails.includes(mail.id)}
                              onChange={() => handleToggleSelect(mail.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <button
                              className="icon-button"
                              title="Mark as Important"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleLabel(mail, 'important');
                              }}
                            >
                              {mailLabels.includes('important') ? '⭐' : '☆'}
                            </button>
                            <button
                              className="icon-button"
                              title="Mark as Spam"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleLabel(mail, 'spam');
                              }}
                              style={{
                                color: mailLabels.includes('spam') ? 'crimson' : 'gray'
                              }}
                            >
                              {mailLabels.includes('spam') ? '🚫' : '⭕'}
                            </button>
                          </div>
                          <span className="mail-from">
                            {mail.from === user.id
                              ? `To: ${mail.toName || mail.to}`
                              : mail.fromName || mail.from}
                          </span>
                          &nbsp;
                          <span className="mail-subject">{mail.subject}</span>
                          &nbsp;
                          <span className="mail-snippet">{mail.body.substring(0, 60)}...</span>
                        </div>
                        <span className="mail-date">{formatDateTime(mail.timestamp)}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {searchFeedback && (
                <p className="search-feedback">{searchFeedback}</p>
              )}
            </>
          ) : Object.keys(viewMail).length === 0 || isEditingDraft ? (
            <div className="compose-form">
              <h2>{composeForm.id ? 'Edit Draft' : 'Compose Mail'}</h2>
              <input
                type="text"
                placeholder="To"
                value={composeForm.to}
                onChange={e => setComposeForm({ ...composeForm, to: e.target.value })}
              />
              <input
                type="text"
                placeholder="Subject"
                value={composeForm.subject}
                onChange={e => setComposeForm({ ...composeForm, subject: e.target.value })}
              />
              <textarea
                placeholder="Message"
                value={composeForm.body}
                onChange={e => setComposeForm({ ...composeForm, body: e.target.value })}
              />
              <div>
                <button className="styled-button" onClick={handleSendMail}>Send</button>
                <button className="styled-button" onClick={handleSaveDraft}>Save Draft</button>
                <button className="styled-button" onClick={() => setViewMail(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="mail-view">
              <button onClick={() => setViewMail(null)}>Back</button>
              <h2>{viewMail.subject}</h2>
              <p><strong>From:</strong> {viewMail.fromName || 'Unknown'}</p>
              <p><strong>To:</strong> {viewMail.toName || 'Unknown'}</p>
              <p>{viewMail.body}</p>
              <select
                defaultValue=""
                onChange={async (e) => {
                  const labelName = e.target.value;
                  if (!labelName) return;
                  const userCustomLabels = viewMail.customLabels?.[user.id] || [];
                  if (!userCustomLabels.includes(labelName)) {
                    await fetch(`/api/mails/${viewMail.id}`, {
                      method: 'PATCH',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({ customLabels: [...userCustomLabels, labelName] }),
                    });
                    fetchMails();
                    setViewMail(null);
                  }
                }}
              >
                <option value="">Move to label…</option>
                {labels.map(label => (
                  <option key={label.id} value={label.name}>{label.name}</option>
                ))}
              </select>
              <div style={{ marginTop: '1rem' }}>
                <button className="styled-button" onClick={() => handleDeleteMail(viewMail.id)}>Delete</button>
                <button className="styled-button" onClick={() => handleToggleLabel(viewMail, 'spam')}>
                  {(viewMail.labels?.[user.id] || []).includes('spam') ? 'Unmark Spam' : 'Mark as Spam'}
                </button>
                <button className="styled-button" onClick={() => handleToggleLabel(viewMail, 'important')}>
                  {(viewMail.labels?.[user.id] || []).includes('important') ? 'Unmark Important' : 'Mark as Important'}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
